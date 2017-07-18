document.addEventListener('deviceready', function() {
    if(getCookie('username')!=null){
        window.alert('¡Bienvenido, '+getCookie('username')+'!');
        window.location.replace("main.html");
    }else{
        $.base64.utf8encode = true;
        checkIfOnline();
        db = openDatabase("local.db", '1.0', "LocalDB", 2 * 1024 * 1024);
        /*db.transaction(function (tx) {
            tx.executeSql("DROP TABLE localUsers");
        });*/
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS localUsers (nick text primary key, pass text)");
        });
        var timer=window.setInterval(checkIfOnline,5000);
        window.StatusBar.overlaysWebView(false);
        window.StatusBar.backgroundColorByHexString('#000000');
    }
});
$.fn.spin.presets.loading = {
    lines: 15, length: 41, width: 14, radius: 42, scale: 0.75, corners: 1, color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 1, trail: 60, fps: 20, zIndex: 2e9, className: 'spinner', top: '50%', left: '50%', shadow: true, hwaccel: false, position: 'absolute'
};
//var url='http://192.168.1.43/DiscoverIt/www/php/';
var url='http://esp.uem.es:8000/descubrelo/';
function confirmRegistry() {
    if(document.getElementById('username').value){
        if(!document.getElementById('password').value){
            window.alert('Por favor, introduce una contraseña');
        }else if(document.getElementById('password').value != document.getElementById('password-confirm').value){
            window.alert('¡Las contraseñas no coinciden!');
        }else{
            $('#signUpPage').spin('loading');
            $.post(url+'di_loginFunctions.php', {
                uname: document.getElementById('username').value,
                password: document.getElementById('password').value,
                confirmarRegistro: true
            }, function(data, status) {
                console.log(data);
                if(data=='Usuario existente'){
                    window.alert('Ya existe un usuario con ese nombre. Por favor, introduce otro nombre o inicia sesión si eres este usuario.')
                }else if(data=="Registro exitoso"){
                    var encodedPass = $.base64.encode(document.getElementById('password').value, true);
                    db.transaction(function (tx) {
                        tx.executeSql("INSERT INTO localUsers (nick, pass) VALUES (?,?)", [document.getElementById('username').value, encodedPass]);
                    });
                    window.alert('¡Usuario registrado con éxito!');
                    $.mobile.changePage("#loginPage");
                }else{
                    window.alert('Algo ha fallado en el registro. Por favor intentelo de nuevo mas tarde.');
                }
                $('#signUpPage').spin(false);
            });  
        }
    }else{
        window.alert('Introduce un nombre de usuario, por favor');
    }
};
function confirmLogin () {
    if(!document.getElementById('log-password').value){
        window.alert('Introduce la contraseña, por favor');
    }else{
        $('#loginPage').spin('loading');
        db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM localUsers WHERE nick=?", [document.getElementById('log-uname').value], function(tx, results) {
                if(results.rows.length > 0) {
                    var decodedPass = $.base64.decode(results.rows.item(0).pass, true);
                    if(decodedPass==document.getElementById('log-password').value){
                        window.alert('¡Login realizado con éxito!');
                        document.cookie = "username="+document.getElementById('log-uname').value+"; path=/";
                        window.location.replace("main.html");
                    }else{
                        window.alert('Contraseña errónea. Por favor, introducela de nuevo.');
                    }
                    $('#loginPage').spin(false);
                }else{
                    if(testConnection()==false){
                        window.alert('Lo sentimos, ese nombre no esta en la base de datos local. Conéctate a internet para comprobarlo con la base online.');
                        $('#loginPage').spin(false);
                    }else{
                        $.post(url+'di_loginFunctions.php', {
                            uname: document.getElementById('log-uname').value,
                            password: document.getElementById('log-password').value,
                            iniciarSesion: true
                        }, function(data, status) {
                            console.log(data);
                            if(data=="Login exitoso"){
                                tx.executeSql("INSERT INTO localUsers (nick, pass) VALUES (?,?)", [document.getElementById('log-uname').value, $.base64.encode(document.getElementById('log-password').value, true)]);
                                document.cookie = "username="+document.getElementById('log-uname').value+"; path=/";
                                window.alert('¡Login realizado con éxito!');
                                window.location.replace("main.html");
                            }else if(data=="Login fallido"){
                                window.alert('Usuario o contraseña errónea. Por favor, introduce de nuevo las credenciales.');
                            }else{
                                window.alert('Algo falló en el login. Por favor, intentalo de nuevo mas tarde');
                            } 
                        });  
                        $('#loginPage').spin(false);
                    }
                }
            });
        });
    }
};
function emailAddressIsValid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
function testConnection() {
    jQuery.ajaxSetup({async:false});
    re="";
    r=Math.round(Math.random() * 10000);
    $.get("http://esp.uem.es/descubrelo/test.jpg",{subins:r},function(d){
        re=true;
    }).error(function(){
        re=false;
    });
    return re;
}
function checkIfOnline(){
    if(testConnection()==false){
        if (window.location.href.indexOf("signUpPage") > -1 ) {
            window.alert('Se ha perdido la conexión a internet. Por favor, conecta el dispositivo de nuevo para realizar el registro.');
            $.mobile.changePage( "#landingPage");
        }
        $("#toSignUp").button().button('disable');
    }else{
        $("#toSignUp").button().button('enable'); 
    }
}
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }else{
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
} 