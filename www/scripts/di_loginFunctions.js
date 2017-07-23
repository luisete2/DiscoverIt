document.addEventListener('deviceready', function() {
    $("[data-localize]").localize("lang", {pathPrefix: "languages", skipLanguage: ["es","es-ES"]});
    $.getJSON('./languages/js-'+language+'.json', function(json) {
        dictionary=json;
        console.log(dictionary);
    }).fail(function() {
        $.getJSON('./languages/js-en.json', function(json) {
            dictionary=json;
        });
    }).always(function(){
        if(localStorage.getItem('username')!==null){
            window.alert('¡'+dictionary.welcome+', '+localStorage.getItem('username')+'!');
            window.location.replace("main.html");
        }else{
            $.base64.utf8encode = true;
            checkIfOnline();
            db = openDatabase("local.db", '1.0', "LocalDB", 2 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS localUsers (nick text primary key, pass text)");
            });
            //var timer=window.setInterval(checkIfOnline,5000);
            window.StatusBar.overlaysWebView(false);
            window.StatusBar.backgroundColorByHexString('#000000');
        }
    });
});
$.fn.spin.presets.loading = {
    lines: 15, length: 41, width: 14, radius: 42, scale: 0.75, corners: 1, color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 1, trail: 60, fps: 20, zIndex: 2e9, className: 'spinner', top: '50%', left: '50%', shadow: true, hwaccel: false, position: 'absolute'
};
var url='http://192.168.1.110/DiscoverIt/www/php/', dictionary, language = window.navigator.language.substring(0, 2);
//var url='http://esp.uem.es:8000/descubrelo/';
function confirmRegistry() {
    if(document.getElementById('username').value){
        if(!document.getElementById('password').value){
            window.alert(dictionary.pleasePass);
        }else if(document.getElementById('password').value != document.getElementById('password-confirm').value){
            window.alert(dictionary.passNotMatch);
        }else{
            $('#signUpPage').spin('loading');
            $.post(url+'di_loginFunctions.php', {
                uname: document.getElementById('username').value,
                password: document.getElementById('password').value,
                confirmarRegistro: true
            }, function(data, status) {
                if(data=='Usuario existente'){
                    window.alert(dictionary.alreadyExistsUser);
                }else if(data=="Registro exitoso"){
                    var encodedPass = $.base64.encode(document.getElementById('password').value, true);
                    db.transaction(function (tx) {
                        tx.executeSql("INSERT INTO localUsers (nick, pass) VALUES (?,?)", [document.getElementById('username').value, encodedPass]);
                    });
                    window.alert(dictionary.successRegistration);
                    $.mobile.changePage("#loginPage");
                }else{
                    window.alert(dictionary.failRegistration);
                }
                $('#signUpPage').spin(false);
            });  
        }
    }else{
        window.alert(dictionary.pleaseUname);
    }
}
function confirmLogin () {
    if(!document.getElementById('log-password').value){
        window.alert(dictionary.pleasePass);
    }else{
        $('#loginPage').spin('loading');
        db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM localUsers WHERE nick=?", [document.getElementById('log-uname').value], function(tx, results) {
                if(results.rows.length > 0) {
                    var decodedPass = $.base64.decode(results.rows.item(0).pass, true);
                    if(decodedPass==document.getElementById('log-password').value){
                        window.alert(dictionary.successLogin);
                        localStorage.setItem('username', document.getElementById('log-uname').value);
                        window.location.replace("main.html");
                    }else{
                        window.alert(dictionary.wrongPass);
                    }
                    $('#loginPage').spin(false);
                }else{
                    if(testConnection()===false){
                        window.alert(dictionary.missingUname);
                        $('#loginPage').spin(false);
                    }else{
                        $.post(url+'di_loginFunctions.php', {
                            uname: document.getElementById('log-uname').value,
                            password: document.getElementById('log-password').value,
                            iniciarSesion: true
                        }, function(data, status) {
                            if(data=="Login exitoso"){
                                tx.executeSql("INSERT INTO localUsers (nick, pass) VALUES (?,?)", [document.getElementById('log-uname').value, $.base64.encode(document.getElementById('log-password').value, true)]);
                                localStorage.setItem('username', document.getElementById('log-uname').value);
                                window.alert(dictionary.successLogin);
                                window.location.replace("main.html");
                            }else if(data=="Login fallido"){
                                window.alert(dictionary.wrongCredentials);
                            }else{
                                window.alert(dictionary.failLogin);
                            } 
                        });  
                        $('#loginPage').spin(false);
                    }
                }
            });
        });
    }
}
function emailAddressIsValid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function testConnection() {
    jQuery.ajaxSetup({async:false});
    re="";
    r=Math.round(Math.random() * 10000);
    $.get("http://192.168.1.110/DiscoverIt/www/test.jpg",{subins:r},function(d){
        re=true;
    }).error(function(){
        re=false;
    });
    return re;
}
function checkIfOnline(){
    if(testConnection()===false){
        if (window.location.href.indexOf("signUpPage") > -1 ) {
            window.alert(dictionary.lostConnectionR);
            $.mobile.changePage( "#landingPage");
        }
        $("#toSignUp").button().button('disable');
    }else{
        $("#toSignUp").button().button('enable'); 
    }
}