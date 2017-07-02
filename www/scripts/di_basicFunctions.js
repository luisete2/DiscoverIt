/* jshint browser: true */
//PRIMERA INICIALIZACION
document.addEventListener('deviceready', function() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    //intel.xdk.device.setRotateOrientation('portrait');
    //window.StatusBar.show();
    db = openDatabase("local.db", '1.0', "LocalDB", 4 * 1024 * 1024);
    /*db.transaction(function (tx) {
        tx.executeSql("DROP TABLE downloadedRoutes");
    });*/
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS localEvents (id text primary key, title text, start text, end text)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS localMyRoutes (id text primary key, route text)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS downloadedRoutes (id text primary key, route text)");
        tx.executeSql("SELECT id FROM downloadedRoutes", [], function(tx, results) {
            if(results.rows.length > 0) {
                for(var i = 0; i < results.rows.length; i++) {
                    rutasBajadas.push(results.rows.item(i).id);
                }
            }
            getRoutes();
        });
        tx.executeSql("SELECT * FROM localEvents", [], function(tx, results) {
            if(results.rows.length > 0) {
                for(var i = 0; i < results.rows.length; i++) {
                    events.push({
                        id: results.rows.item(i).id,
                        title: results.rows.item(i).title,
                        start: results.rows.item(i).start,
                        end: results.rows.item(i).end
                    });
                }
                $('#calendar').fullCalendar( 'addEventSource', events);
            }
        });
    });
    loadMyRoutes();
    loadDownloadedRoutes();
    autor='luisete2';
    $('#userName').html(autor);
    $('input.timepicker').timepicker({
        timeFormat: 'HH:mm',
        interval: 10,
        minTime: '00:00 AM',
        maxTime: '11:50 PM',
        defaultTime: '12:00 PM',
        startTime: '00:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
    $('#calendar').fullCalendar({
        events: events,
        eventLimit: true, 
        header: {
            left:   'prev',
            center: 'title',
            right:  'next'
        },
        dayClick: function(date, jsEvent, view) {
            if(view.name == 'month' || view.name == 'basicWeek') {
                $('#calendar').fullCalendar('changeView', 'basicDay');
                $('#calendar').fullCalendar('gotoDate', date);
                $('#backDay').css('display', 'block');
            }
        }
    });
    window.StatusBar.overlaysWebView(false);
    window.StatusBar.backgroundColorByHexString('#000000');
});
$("#routeCreatorNav").hide();
$('#confirmRoute').addClass('ui-state-disabled');
//VARIABLES
$.fn.spin.presets.loading = {
    lines: 15, length: 41, width: 14, radius: 42, scale: 0.75, corners: 1, color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 1, trail: 60, fps: 20, zIndex: 2e9, className: 'spinner', top: '50%', left: '50%', shadow: true, hwaccel: false, position: 'absolute'
};
var iconPin = {
    url: "location_marker.svg",
    anchor: new google.maps.Point(25, 50),
    scaledSize: new google.maps.Size(50, 50)
};
var url='http://192.168.1.43/DiscoverIt/www/php/';
google.maps.event.addDomListener(window, "load", initMap);
google.maps.event.addDomListener(window, "load", initRouteMap);
var db, events=[], map, routeMap, marker, mousedUp = false, service, directionsDisplay, typeQuery=0, request, rutasBajadas=[], autor;
var geocoder = new google.maps.Geocoder(), GeoMarker = new GeolocationMarker();
var routesArray = [], infoWindow= new google.maps.InfoWindow();
var rDirectionsService = new google.maps.DirectionsService();
var autocomplete =  new google.maps.places.Autocomplete(document.getElementById('B1City'),{types: ['(cities)']});
var autocompleteRC =  new google.maps.places.Autocomplete(document.getElementById('RCCity'),{types: ['(cities)']});
var autocompleteRS =  new google.maps.places.Autocomplete(document.getElementById('RCity'),{types: ['(cities)']});
var autocompleteRCS =  new google.maps.places.Autocomplete(document.getElementById('cityName'),{types: ['(cities)']});
var rOrigin = null, rDestination = null, rWaypoints = [], markerArray = [], rDirectionsDisplay, rMarkerArray=[], bMarkerArray=[], rMarkerInfo=[];
google.maps.event.addListener(autocomplete, 'place_changed', function(){
    var place = autocomplete.getPlace();
});
google.maps.event.addListener(autocompleteRC, 'place_changed', function(){
    var place = autocompleteRC.getPlace();
});
google.maps.event.addListener(autocompleteRS, 'place_changed', function(){
    var place = autocompleteRS.getPlace();
});
google.maps.event.addListener(autocompleteRCS, 'place_changed', function(){
    var place = autocompleteRCS.getPlace();
});
//SECCIÓN MAPA
//Mapa de pagina principal
google.maps.visualRefresh = true;
function initMap() {
    map = new google.maps.Map(document.getElementById('mapa_div'), {
        center: {
            lat: 40.415347,
            lng: -3.707371
        },
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
        mapTypeControl: false,
        minZoom: 5, maxZoom: 18,
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        rotateControl: false,
        style: [{
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.government",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.medical",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.school",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.line",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station.airport",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station.bus",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station.bus",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station.rail",
            "stylers": [{
                "visibility": "simplified"
            }]
        }]
    });
    service = new google.maps.places.PlacesService(map);
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.panTo(pos);
            GeoMarker.setCircleOptions({
                fillColor: '#808080'
            });
            google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
                map.panTo(this.getPosition());
                map.fitBounds(this.getBounds());
            });
            google.maps.event.addListener(GeoMarker, 'geolocation_error', function(e) {
                window.alert('There was an error obtaining your position. Message: ' + e.message);
            });
            GeoMarker.setMap(map);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
//Mapa de crear ruta
function initRouteMap() {
    routeMap = new google.maps.Map(document.getElementById('mapa_route'), {
        center: {
            lat: 40.415347,
            lng: -3.707371
        },
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
        mapTypeControl: false,
        minZoom: 5, maxZoom: 18,
        scaleControl: false,
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        rotateControl: false,
        style: [{
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.government",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.medical",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.school",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.line",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station.airport",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station.bus",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station.bus",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit.station.rail",
            "stylers": [{
                "visibility": "simplified"
            }]
        }]
    });
    //service = new google.maps.places.PlacesService(map);
    rDirectionsDisplay = new google.maps.DirectionsRenderer({map: routeMap});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            routeMap.panTo(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    } 
    routeMap.addListener('mouseup', function(e){ 
        mousedUp = true;
    });
    routeMap.addListener('dragstart', function(e){ 
        mousedUp = true;
    });
    routeMap.addListener('dragend', function(e){ 
        mousedUp = true;
    });
    routeMap.addListener('zoom_changed', function(e){ 
        mousedUp = true;
    });
    routeMap.addListener('mousedown', function(e) {
        mousedUp = false;
        setTimeout(function(){
            if(mousedUp === false){
                e.position=e.latLng;
                addMarker(e);
            }
        }, 400);
    });
}
function addMarker(marker) {
    if (rOrigin === null) {
        rOrigin = marker.position;
        placeMarker(marker);
    } else if (rDestination === null) {
        rDestination = marker.position;
        placeMarker(marker);
    } else {
        if (rWaypoints.length < 9) {
            rWaypoints.push({ location: rDestination, stopover: true });
            rDestination = marker.position;
            placeMarker(marker);
        } else {
            window.alert("¡Has alcanzado el tamaño máximo de ruta! Por favor, elimina algún punto para añadir otro.");
        }
    }   
}
function placeMarker(marker){
    if(marker.hasOwnProperty('extraInfo')){
        rMarkerArray.push(new google.maps.Marker({
            position: marker.position, 
            map: routeMap,
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+(rMarkerArray.length+1)+'|58ACFA|000000',
            extraInfo: marker.extraInfo,
            pos: marker.pos
            //draggable: true,
        }));  
    }else{
        rMarkerArray.push(new google.maps.Marker({
            position: marker.position, 
            map: routeMap,
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+(rMarkerArray.length+1)+'|58ACFA|000000'  
            //draggable: true,
        }));  
    }
}
function undoMarker() {
    if(rMarkerArray.length==0){
        window.alert('No hay puntos para quitar.');
    }else{
        if(rMarkerArray.length==1){
            rOrigin = null
        }else if(rMarkerArray.length==2){
            rDestination=null;
        }else{
            rDestination=rMarkerArray[rMarkerArray.length-2].position;
        }
        rMarkerArray[rMarkerArray.length-1].setMap(null);
        if(rMarkerArray[rMarkerArray.length-1].hasOwnProperty('extraInfo') && bMarkerArray.length !== 0){
            bMarkerArray[rMarkerArray[rMarkerArray.length-1].pos].setMap(routeMap);
        }
        rMarkerArray.pop();
        rWaypoints.pop();
    }
}
function calcRoute() {
    cleanRouteMap();
    if (rOrigin == null) {
        window.alert("¡No puedes crear una ruta sin un punto de inicio!");
        return;
    }
    if (rDestination == null) {
        window.alert("Añade un punto de final para acabar la ruta.");
        return;
    }
    var mode = google.maps.DirectionsTravelMode.WALKING;
    request = {
        origin: rOrigin,
        destination: rDestination,
        waypoints: rWaypoints,
        travelMode: mode,
        optimizeWaypoints: true,
        avoidHighways: true,
        provideRouteAlternatives: true
    };
    rDirectionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            response.routes[0].bounds.getCenter.lng
            var nPoints = response.routes[0].overview_path.length;
            clearMarkers(rMarkerArray);
            rDirectionsDisplay.setDirections(response);
        }
    });
    $('#confirmRoute').removeClass('ui-state-disabled');
}
function clearMarkers(array) {
    for (var i = 0; i < array.length; i++) {
        array[i].setMap(null);
    }
}
function clearWaypoints() {
    rMarkerArray = [];
    rOrigin = null;
    rDestination = null;
    rWaypoints = [];
}
function resetRoute() {
    clearMarkers(rMarkerArray);
    clearWaypoints();
    rDirectionsDisplay.setMap(null);
    rDirectionsDisplay.setPanel(null);
    rDirectionsDisplay = new google.maps.DirectionsRenderer();
    rDirectionsDisplay.setMap(routeMap);
    $('#confirmRoute').addClass('ui-state-disabled');
}
function saveRoute(){
    $('#searchPage').spin('loading');
    if (!document.getElementById('routeName').value) {
        window.alert('Introduce un nombre a tu ruta para guardarla.');
        $('#searchPage').spin(false);
    }else if (!document.getElementById('cityName').value) {
        window.alert('Por favor, introduce una ciudad principal para indicar por donde transcurre la ruta.');
        $('#searchPage').spin(false);
    }else{
        var infoPlaces=[];
        rMarkerArray.forEach(function(element){
            var place = new Object();
            if(element.hasOwnProperty('extraInfo')){
                place.nombre=element.extraInfo.nombre;
                place.descripcion=element.extraInfo.descripcion;
                place.direccion=element.extraInfo.localizacion.direccion;
                infoPlaces.push(place);
            }else{
                place.nombre='Par de coord.'
                infoPlaces.push(place);
            }
        });
        $.post(url+'di_saveRoute.php', {
            ruta: JSON.stringify(request),
            nombre: document.getElementById('routeName').value,
            descripcion: document.getElementById('routeDesc').value,
            city: document.getElementById('cityName').value,
            arrayInfo: JSON.stringify(infoPlaces),
            autor: autor
        }, function(data, status) {
            if(data.substring(0,7)=='SUCCESS'){
                window.alert('¡Ruta guardada con éxito!');
                $.mobile.changePage("#mapPage");
                $("#mainNav").show();
                resetRoute();
                var idRuta=data.substring(12);
                var ruta={
                    gRoute: JSON.stringify(request),
                    nombre: document.getElementById('routeName').value,
                    descripcion: document.getElementById('routeDesc').value,
                    city: document.getElementById('cityName').value,
                    infoLugares: JSON.stringify(infoPlaces)
                }
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO localMyRoutes (id, route) VALUES (?,?)", [idRuta, JSON.stringify(ruta)]);
                });
                loadMyRoutes();
                getRoutes();
            }else{
                window.alert('Algo falló O.o');
            }
            $('#searchPage').spin(false);
        });
    }
}
function cleanMap() {
    clearMarkers(markerArray);
    markerArray = [];
    document.getElementById('cleanMarkersIcon').style.display = 'none';
}
function cleanRouteMap() {
    clearMarkers(bMarkerArray);
    bMarkerArray = [];
    document.getElementById('cleanRCMarkersIcon').style.display = 'none';
}
function searchRCPlace() {
    $('#searchRCPage').spin('loading');
    if(!document.getElementById('RCCity').value){
        window.alert('Por favor, inserta una ciudad para realizar la búsqueda.');
        $('#searchRCPage').spin(false);
    }else{
        geocoder.geocode({'address': document.getElementById('RCCity').value}, function(results, status) {
            if (status == 'OK') {
                var city;
                if(document.getElementById('RCCity').value.indexOf(',') !== -1){
                    city = document.getElementById('RCCity').value.substr(0, document.getElementById('RCCity').value.indexOf(',')); 
                }else if(document.getElementById('RCCity').value.indexOf(' ') !== -1){
                    city = document.getElementById('RCCity').value.substr(0, document.getElementById('RCCity').value.indexOf(' ')); 
                }else{
                    city = document.getElementById('RCCity').value;
                }
                $.post(url+'di_placeQuerys.php', {
                    tipoQuery: 4,
                    city: city,
                    tipo: document.getElementById("RCType").value
                }, function(data, status) {
                    //window.alert(JSON.stringify(data, null, 4));
                    var mdata = JSON.parse(data);
                    if(mdata!=="Vacia"){
                        var contador=0;
                        cleanRouteMap();
                        mdata.forEach(function(k) {
                            var marker = new google.maps.Marker({
                                position: {
                                    lat: k.localizacion.punto.latitud,
                                    lng: k.localizacion.punto.longitud
                                },
                                //icon: iconPin,
                                map: routeMap,
                                pos: contador,
                                extraInfo: k
                                //animation: google.maps.Animation.DROP
                            });
                            marker.addListener('click', function() {
                                infoWindow.setContent('<div id="content"><div id="siteNotice"></div><h2>' + k.nombre + '</h2><div id="bodyContent"><p>' + k.localizacion.direccion + '</p></div></div>');
                                infoWindow.open(routeMap, this);
                            });
                            marker.addListener('mouseup', function(e){ 
                                mousedUp = true;
                            });
                            marker.addListener('dragstart', function(e){ 
                                mousedUp = true;
                            });
                            marker.addListener('dragend', function(e){ 
                                mousedUp = true;
                            });
                            marker.addListener('zoom_changed', function(e){ 
                                mousedUp = true;
                            });
                            marker.addListener('mousedown', function(e) {
                                mousedUp = false;
                                setTimeout(function(){
                                    addMarker(marker);
                                    marker.setMap(null);
                                }, 400);
                            });                           
                            bMarkerArray.push(marker);
                            contador++;
                        });
                        routeMap.panTo(results[0].geometry.location);
                        rDirectionsDisplay.setDirections({routes: []});
                        document.getElementById('cleanRCMarkersIcon').style.display = 'inline';
                        $.mobile.changePage("#routeCreatorPage");
                        $("#routeCreatorNav").show();
                    }else{
                        window.alert('¡No se han encontrado resultados!');
                    } 
                    $('#searchRCPage').spin(false);
                });
            } else {
                window.alert('La geolocalización de la ciudad ha fallado. Introduce una ciudad válida. ');
                $('#searchRCPage').spin(false);
            }         
        });
    }
}
function loadMyRoutes(){
    var descripcion, valoracion, lista="";
    $("#myRoutesCollapsible").empty();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM localMyRoutes", [], function(tx, results) {
            if(results.rows.length > 0) {
                for(var i = 0; i < results.rows.length; i++) {
                    var id= results.rows.item(i).id;
                    var k = JSON.parse(results.rows.item(i).route);
                    valoracion="";
                    k.gRoute=JSON.parse(k.gRoute);
                    if(!('infoLugares' in k)){
                        lista="<li>"+k.gRoute.origin+"</li>";
                        if("waypoints" in k.gRoute){
                            var waypoints="";
                            k.gRoute.waypoints.forEach(function(m){
                                waypoints=waypoints.concat('<li>'+m.location+'</li>');
                            });
                            lista=lista.concat(waypoints, "<li>"+k.gRoute.destination+"</li>");
                        }else lista=lista.concat("<li>"+k.gRoute.destination+"</li>");
                    }else{
                        k.infoLugares=JSON.parse(k.infoLugares);
                        k.infoLugares.forEach(function(m){
                            lista=lista.concat('<li>'+m.nombre+'</li>');
                        });
                    }
                    if(k.descripcion) descripcion=k.descripcion; else descripcion='Esta ruta no tiene descripción.';
                    //hay que hacer query por cada id de monumento
                    $("#myRoutesCollapsible").append("<div data-role='collapsible' class='animateCollapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'><h3>"+k.nombre+"</h3><div class='ui-grid-a'><div class='ui-block-a'><p><b>Monumentos</b></p><ul class='monList'>"+lista+"</ul></div><div class='ui-block-b'><p><b>Descripción</b></p><p>"+descripcion+"</p></div></div><div class='ui-grid-a'><div class='ui-block-a'><div id='icons"+id+"'><a href='#eventConfigPage' onclick='toEventSchedule(\"" +id+ "\",\"" +k.nombre+ "\")'><i class='fa fa-calendar-plus-o fa-2x'></i></a><a onclick='deleteRoute(\"" +id+ "\")'><i class='fa fa-trash-o fa-2x'></i></a></div><br></div><div class='ui-block-b'><button onclick='setRoute(\"" +id+ "\")'>Iniciar ruta</button></div></div></div></div>").trigger('create');
                    routesArray[id]=k; 
                }
            }else{
                $("#myRoutesCollapsible").append('<p style="text-align:center;">No hay rutas aún creadas en este dispositivo.</p>');
            }
        });
    });
}
function deleteRoute(routeId){
    $.post(url+'di_deleteRoute.php', {
        id: routeId
    }, function(data, status) {
        db.transaction(function (tx) {
            tx.executeSql("DELETE FROM localMyRoutes WHERE id=?", [routeId]);
        });
        window.alert('¡Ruta borrada con éxito!');
        loadMyRoutes();
    });
}
function downloadRoute(routeId){
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO downloadedRoutes (id, route) VALUES (?,?)", [routeId, JSON.stringify(routesArray[routeId])]);
    });
    rutasBajadas.push(routeId);
    window.alert('¡Ruta descargada con éxito!');
    loadDownloadedRoutes();
    $(".dload"+routeId).hide();
}
function loadDownloadedRoutes(routeId){
    var descripcion, valoracion, lista="";
    $("#dloadRoutesCollapsible").empty();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM downloadedRoutes", [], function(tx, results) {
            if(results.rows.length > 0) {
                for(var i = 0; i < results.rows.length; i++) {
                    var id= results.rows.item(i).id;
                    var k = JSON.parse(results.rows.item(i).route);
                    valoracion="";
                    if(!('infoLugares' in k)){
                        lista="<li>"+k.gRoute.origin+"</li>";
                        if("waypoints" in k.gRoute){
                            var waypoints="";
                            k.gRoute.waypoints.forEach(function(m){
                                waypoints=waypoints.concat('<li>'+m.location+'</li>');
                            });
                            lista=lista.concat(waypoints, "<li>"+k.gRoute.destination+"</li>");
                        }else lista=lista.concat("<li>"+k.gRoute.destination+"</li>");
                    }else{
                        k.infoLugares=JSON.parse(k.infoLugares);
                        k.infoLugares.forEach(function(m){
                            lista=lista.concat('<li>'+m.nombre+'</li>');
                        });
                    }
                    if(k.descripcion) descripcion=k.descripcion; else descripcion='Esta ruta no tiene descripción.';
                    //hay que hacer query por cada id de monumento
                    $("#dloadRoutesCollapsible").append("<div data-role='collapsible' class='animateCollapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'><h3>"+k.nombre+"</h3><div class='ui-grid-a'><div class='ui-block-a'><p><b>Monumentos</b></p><ul class='monList'>"+lista+"</ul></div><div class='ui-block-b'><p><b>Descripción</b></p><p>"+descripcion+"</p></div></div><div class='ui-grid-a'><div class='ui-block-a'><p><b>Creada por:</b></p><div id='userName'>"+k.autor+"</div><br><div id='icons"+k._id.$id+"'><a href='#eventConfigPage' onclick='toEventSchedule(\"" +id+ "\",\"" +k.nombre+ "\")'><i class='fa fa-calendar-plus-o fa-2x'></i></a><a onclick='removeRoute(\"" +id+ "\")'><i class='fa fa-minus-square-o fa-2x'></i></a></div><br></div><div class='ui-block-b'><div data-role='fieldcontain' style='padding:0;'><select data-native-menu='false' id='sel"+k._id.$id+"'><option value='5'>★★★★★</option><option value='4'>★★★★☆</option><option value='3'>★★★☆☆</option><option value='2'>★★☆☆☆</option><option value='1'>★☆☆☆☆</option><option value='0'>☆☆☆☆☆</option></select></div><button class='btn"+k._id.$id+"' onclick='saveRate(\"" +k._id.$id+ "\")'><i class='fa fa-star-half-o'></i> Valorar</button><button onclick='setRoute(\"" +k._id.$id+ "\")'>Iniciar ruta</button></div></div></div></div>").trigger('create');
                    routesArray[id]=k; 
                }                
            }else{
                $("#dloadRoutesCollapsible").append('<p style="text-align:center;">No hay rutas descargadas.</p>');
            }
        });
    });
}
function removeRoute(routeId){
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM downloadedRoutes WHERE id=?", [routeId]);
    });
    var index = rutasBajadas.indexOf(routeId);
    if (index > -1) {
        rutasBajadas=rutasBajadas.splice(index, 1);
    }
    loadDownloadedRoutes();
    $(".dload"+routeId).show();
}
function searchPlace() {
    $('#searchPage').spin('loading');
    if (typeQuery === 0) {
        window.alert('Por favor, selecciona un tipo de búsqueda.');
        $('#searchPage').spin(false);
    } else if (typeQuery == 1) {
        //CODIGO PARA BUSQUEDAS COMPLEJAS
        if(!document.getElementById('B1Query').value){
            window.alert('Por favor, inserta un tipo para realizar la busqueda.');
            $('#searchPage').spin(false);
        }else if(!document.getElementById('B1City').value){
            window.alert('Por favor, inserta una ciudad para realizar la busqueda.');
            $('#searchPage').spin(false);
        }else{
            geocoder.geocode({'address': document.getElementById('B1City').value}, function(results, status) {
                if (status == 'OK') {
                    $.post(url+'di_placeQuerys.php', {
                        tipoQuery: typeQuery,
                        lat: results[0].geometry.location.lat,
                        lng: results[0].geometry.location.lng,
                        query: document.getElementById("B1Query").options[document.getElementById("B1Query").selectedIndex].value
                    }, function(data, status) {
                        var mdata = JSON.parse(data);
                        if(mdata!=="Vacia"){
                            map.panTo(results[0].geometry.location);
                            //window.alert(JSON.stringify(data, null, 4));
                            var contador=0;
                            cleanMap();
                            $.mobile.changePage("#mapPage");
                            $("#mainNav").show();
                            mdata.forEach(function(k) {
                                var marker = new google.maps.Marker({
                                    position: {
                                        lat: k.latitud,
                                        lng: k.longitud
                                    },
                                    //icon: iconPin,
                                    map: map,
                                    animation: google.maps.Animation.DROP
                                });
                                marker.addListener('click', function() {
                                   infoWindow.setContent('<div id="content"><div id="siteNotice"></div><h2>' + k.nombre + '</h2><div id="bodyContent"><p>' + k.direccion + '</p></div></div>');
                                   infoWindow.open(map, this);
                                });
                                markerArray.push(marker);
                                contador++;
                            });
                            directionsDisplay.setDirections({routes: []});
                            document.getElementById('cleanRouteIcon').style.display = 'none';
                            document.getElementById('cleanMarkersIcon').style.display = 'inline';
                        }else{
                            window.alert('¡No se han encontrado resultados!');
                        }
                        $('#searchPage').spin(false);
                    });
                } else {
                    window.alert('La geolocalización de la ciudad ha fallado. Introduce una ciudad válida. '+status);
                    $('#searchPage').spin(false);
                }
            });
        }
    } else if (typeQuery == 2){
        var userPos = GeoMarker.getPosition();
        //CODIGO PARA BUSQUEDAS POR CERCANIA
        $.post(url+'di_placeQuerys.php', {
            tipoQuery: typeQuery,
            radio: document.getElementById('B2In').value,
            lat: userPos.lat,
            lng: userPos.lng,
            query: document.getElementById("B2Query").options[document.getElementById("B2Query").selectedIndex].value
        }, function(data, status) {
            var mdata = JSON.parse(data);
            if(mdata!=="Vacia"){
                cleanMap();
                $.mobile.changePage( "#mapPage");
                $("#mainNav").show();
                map.panTo(GeoMarker.getPosition());
                mdata.forEach(function(k) {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: k.latitud,
                            lng: k.longitud
                        },
                        //icon: iconPin,
                        map: map,
                        animation: google.maps.Animation.DROP
                    });
                    marker.addListener('click', function() {
                       infoWindow.setContent('<div id="content"><div id="siteNotice"></div><h2>' + k.nombre + '</h2><div id="bodyContent"><p>' + k.direccion + '</p></div></div>');
                       infoWindow.open(map, this);
                    });
                    markerArray.push(marker);
                });
                directionsDisplay.setDirections({routes: []});
                document.getElementById('cleanRouteIcon').style.display = 'none';
                document.getElementById('cleanMarkersIcon').style.display = 'inline';
            }else{
                window.alert('¡No se han encontrado resultados!');
            }
            $('#searchPage').spin(false);
        });
    } else if (typeQuery == 3){
        if(!document.getElementById('B3City').value){
            window.alert('Por favor, inserta una ciudad para realizar la busqueda.');
            $('#searchPage').spin(false);
        }else{
            var city;
            if(document.getElementById('B3City').value.indexOf(' ') !== -1){
                city = document.getElementById('B3City').value.replace(/\s+/g, '_');
            }else{
                city = document.getElementById('B3City').value;
            }
            $.post(url+'di_placeQuerys.php', {
                tipoQuery: typeQuery,
                query: city,
            }, function(data, status) {
                var mdata = JSON.parse(data);
                if(mdata!=="Vacia"){
                    $("#cityInfoCollapsible").empty();
                    for (var k in mdata){
                        if (mdata.hasOwnProperty(k)) {
                            $("#cityInfoCollapsible").append("<div data-role='collapsible' class='animateCollapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'><h3>"+k+"</h3>"+mdata[k]+"</div>").trigger('create');
                        }
                    }
                    $.mobile.changePage( "#cityInfoPage");
                    $('#cityInfoPage').children('div').children('h1').text(capitalizeFirstLetter(city));
                }else{
                    window.alert('¡No se han encontrado resultados!');
                } 
                $('#searchPage').spin(false);
            });  
        }
    }
}
/*Metodo para sacar lugares de interes en busqueda cercana. hay que implementar
    alert('sumergise');
        service.nearbySearch({
            location: userPos,         
            radius: document.getElementById('B2In').value,
            //keyword: "POI",
            types: document.getElementById("B2Type").options[document.getElementById("B2Type").selectedIndex].value
        }, function (results, status) {
            window.alert(status);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                window.alert('hemos hecho busqueda');
                cleanMap();
                $.mobile.changePage( "#mapPage");
                map.panTo(GeoMarker.getPosition());
                results.forEach(function(k) {
                    var marker = new google.maps.Marker({
                        position: k.geometry.location,
                        //icon: iconPin,
                        map: map,
                        animation: google.maps.Animation.DROP
                    });
                    marker.addListener('click', function() {
                       infoWindow.setContent('<div id="content"><div id="siteNotice"></div><h2>' + k.name, + '</h2><div id="bodyContent"><p></p></div></div>');
                       infoWindow.open(map, this);
                    });
                    markerArray.push(marker);
                });
                directionsDisplay.setDirections({routes: []});
                document.getElementById('cleanRouteIcon').style.display = 'none';
                document.getElementById('cleanMarkersIcon').style.display = 'inline';
            } else {
                window.alert(status);
            }
        });
*/
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: El servicio geolocalizador falló.' : 'Error: Tu dispositivo no tiene geolocalización.');
}
$('#locationIcon').click(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.panTo(pos);
    });
});
//SECCION RUTAS
function setRoute(routeId){
    $('#all').spin('loading');
    if(markerArray.length!==0) cleanMap();
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(routesArray[routeId].gRoute, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else alert('failed to get directions');
        $.mobile.changePage("#mapPage", {
            reverse: true,
            changeHash: true
        });       
    });
    $('#mainNav').show();
    document.getElementById('cleanRouteIcon').style.display = 'inline';
    $('#all').spin(false);
}
function getRoutes(){
    var descripcion, valoracion;
    $("#routesCollapsible").empty();
    $.post(url+'di_routeLoader.php', {}, function(data, status){ 
        var mdata = JSON.parse(data);
        mdata.forEach(function(k) {
            var lista="", valoracion="";
            if(!('infoLugares' in k)){
                lista="<li>"+k.gRoute.origin+"</li>";
                if("waypoints" in k.gRoute){
                    var waypoints="";
                    k.gRoute.waypoints.forEach(function(m){
                        waypoints=waypoints.concat('<li>'+m.location+'</li>');
                    });
                    lista=lista.concat(waypoints, "<li>"+k.gRoute.destination+"</li>");
                }else lista=lista.concat("<li>"+k.gRoute.destination+"</li>");
            }else{
                k.infoLugares.forEach(function(m){
                    lista=lista.concat('<li>'+m.nombre+'</li>');
                });
            }
            if(k.descripcion) descripcion=k.descripcion; else descripcion='Esta ruta no tiene descripción.';
            if(k.valoracion!=null){
                valoracion="<div style='float:right; padding-right:2px;'><i class='fa fa-star-half-o' aria-hidden='true'></i> "+k.valoracion.toFixed(1)+"</div>";
            }
            //hay que hacer query por cada id de monumento
            $("#routesCollapsible").append("<div data-role='collapsible' class='animateCollapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'><h3>"+k.nombre+valoracion+"</h3><div class='ui-grid-a'><div class='ui-block-a'><p><b>Monumentos</b></p><ul class='monList'>"+lista+"</ul></div><div class='ui-block-b'><p><b>Descripción</b></p><p>"+descripcion+"</p></div></div><div class='ui-grid-a'><div class='ui-block-a'><p><b>Creada por:</b></p><div id='userName'>"+k.autor+"</div><br><div id='icons"+k._id.$id+"'><a href='#eventConfigPage' onclick='toEventSchedule(\"" +k._id.$id+ "\",\"" +k.nombre+ "\")'><i class='fa fa-calendar-plus-o fa-2x'></i></a><a class='dload"+k._id.$id+"' onclick='downloadRoute(\"" +k._id.$id+ "\")'><i class='fa fa-download fa-2x'></i></a></div></div><div class='ui-block-b'><div data-role='fieldcontain' class='val"+k._id.$id+"' style='padding:0;'><select data-native-menu='false' id='sel"+k._id.$id+"'><option value='5'>★★★★★</option><option value='4'>★★★★☆</option><option value='3'>★★★☆☆</option><option value='2'>★★☆☆☆</option><option value='1'>★☆☆☆☆</option><option value='0'>☆☆☆☆☆</option></select></div><button class='btn"+k._id.$id+"' onclick='saveRate(\"" +k._id.$id+ "\")'><i class='fa fa-star-half-o'></i> Valorar</button><button onclick='setRoute(\"" +k._id.$id+ "\")'>Iniciar ruta</button></div></div></div></div>").trigger('create');
            routesArray[k._id.$id]=k;
            if(rutasBajadas.indexOf(k._id.$id)!==-1||autor==k.autor){
                $('.dload'+k._id.$id).hide();
            }
            if(autor==k.autor){
                $('.val'+k._id.$id).hide();
                $('.btn'+k._id.$id).hide();
            }
        });
    });
}
function searchRoutes(){
    if(!document.getElementById('RName').value&&!document.getElementById('RCity').value&&$('input:radio[name=RVal]:checked').length <= 0){
        window.alert('Por favor, selecciona al menos un parámetro para realizar la busqueda.');
    }else{
        $('#routesPage').spin('loading');
        var descripcion, valoracion;
        if(document.getElementById('RCity').value.indexOf(',') !== -1){
            city = document.getElementById('RCity').value.substr(0, document.getElementById('RCity').value.indexOf(',')); 
        }else if(document.getElementById('RCity').value.indexOf(' ') !== -1){
            city = document.getElementById('RCity').value.substr(0, document.getElementById('RCity').value.indexOf(' ')); 
        }else{
            city = document.getElementById('RCity').value;
        }
        $.post(url+'di_routeLoader.php', {
            name: document.getElementById("RName").value,
            city: city,
            rank: $('input:radio[name=RVal]:checked').val()
        }, function(data, status) {
            $("#routeResultCollapsible").empty();
            var mdata = JSON.parse(data);
            if(mdata!=="Vacia"){
                mdata.forEach(function(k) {
                    valoracion="";
                    if(!('infoLugares' in k)){
                        lista="<li>"+k.gRoute.origin+"</li>";
                        if("waypoints" in k.gRoute){
                            var waypoints="";
                            k.gRoute.waypoints.forEach(function(m){
                                waypoints=waypoints.concat('<li>'+m.location+'</li>');
                            });
                            lista=lista.concat(waypoints, "<li>"+k.gRoute.destination+"</li>");
                        }else lista=lista.concat("<li>"+k.gRoute.destination+"</li>");
                    }else{
                        k.infoLugares.forEach(function(m){
                            lista=lista.concat('<li>'+m.nombre+'</li>');
                        });
                    }
                    if(k.descripcion) descripcion=k.descripcion; else descripcion='Esta ruta no tiene descripción.';
                    if(k.valoracion!=null){
                        valoracion="<div style='float:right; padding-right:2px;'><i class='fa fa-star-half-o' aria-hidden='true'></i>"+k.valoracion.toFixed(1)+"</div>";
                    }
                    //hay que hacer query por cada id de monumento
                    $("#routeResultCollapsible").append("<div data-role='collapsible' class='animateCollapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'><h3>"+k.nombre+valoracion+"</h3><div class='ui-grid-a'><div class='ui-block-a'><p><b>Monumentos</b></p><ul class='monList'>"+lista+"</ul></div><div class='ui-block-b'><p><b>Descripción</b></p><p>"+descripcion+"</p></div></div><div class='ui-grid-a'><div class='ui-block-a'><p><b>Creada por:</b></p><div id='userName'>"+k.autor+"</div><br><div id='icons"+k._id.$id+"'><a href='#eventConfigPage' onclick='toEventSchedule(\"" +k._id.$id+ "\",\"" +k.nombre+ "\")'><i class='fa fa-calendar-plus-o fa-2x'></i></a><a class='dload"+k._id.$id+"' onclick='downloadRoute(\"" +k._id.$id+ "\")'><i class='fa fa-download fa-2x'></i></a></div></div><div class='ui-block-b'><div data-role='fieldcontain' class='val"+k._id_$id+"' style='padding:0;'><select data-native-menu='false' id='sel"+k._id.$id+"'><option value='5'>★★★★★</option><option value='4'>★★★★☆</option><option value='3'>★★★☆☆</option><option value='2'>★★☆☆☆</option><option value='1'>★☆☆☆☆</option><option value='0'>☆☆☆☆☆</option></select></div><button class='btn"+k._id.$id+"' onclick='saveRate(\"" +k._id.$id+ "\")'><i class='fa fa-star-half-o'></i> Valorar</button><button onclick='setRoute(\"" +k._id.$id+ "\")'>Iniciar ruta</button></div></div></div></div>").trigger('create');
                    routesArray[k._id.$id]=k; 
                    if(rutasBajadas.indexOf(k._id.$id)!==-1||autor==k.autor){
                        $('.dload'+k._id.$id).hide();
                    }
                    if(autor==k.autor){
                        $('.val'+k._id.$id).hide();
                        $('.btn'+k._id.$id).hide();
                    }
                });
                $.mobile.changePage( "#routeResultPage");
            }else{
                window.alert('¡No se han encontrado rutas con esos parámetros!')
            }
            $('#routesPage').spin(false);
        });
    }
}
function saveRate(routeId){
    $.post(url+'di_saveRate.php', {
        rating: $("#sel"+routeId).val(),
        route: routeId
    }, function(data, status){
        window.alert('¡Valoración guardada con éxito!');
        $("#btn"+routeId).prop("disabled",true);
    });    
}
function toEventSchedule(routeId, routeName){
    $("#mainNav").hide();
    $('#idEvent').attr('value', routeId);
    $('#nameEvent').attr('value', routeName);
}
function addEvent(){
    if(!$('#dateEvent').val()){
        window.alert('Por favor, introduce un dia para realizar la ruta.');
    }else{
        var event= {
            id: $('#idEvent').val(),
            title: $('#nameEvent').val(),
            start: $('#dateEvent').val()+" "+$('#timeBeginEvent').val(),
            end: $('#dateEvent').val()+" "+$('#timeEndEvent').val()
        };
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO localEvents (id, title, start, end) VALUES (?,?,?,?)", [$('#idEvent').val(), $('#nameEvent').val(),$('#dateEvent').val()+" "+$('#timeBeginEvent').val(),$('#dateEvent').val()+" "+$('#timeEndEvent').val()]);
        });
        $("#calendar").fullCalendar('renderEvent', event, true);
        $('#calendar').fullCalendar('changeView', 'basicDay');
        $('#calendar').fullCalendar('gotoDate', $('#dateEvent').val());
        $('#backDay').css('display', 'block');
        $.mobile.changePage( "#calendarPage");
        $("#mainNav").show();         
    }
}
//AUTOCOMPLETAR Y DETALLES GRÁFICOS
$("#B3City").autocomplete({
    source: function(request, response) {
        $.ajax({
            url: "https://es.wikivoyage.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
            }
        });
    }
});
$(document).on("pagecontainerbeforehide", function () {
    $('#mainNav ul').addClass('ui-state-disabled');
    $('#routeCreatorNav ul').addClass('ui-state-disabled');
});
$(document).on("pagecontainershow", function () {
    $('#mainNav ul').removeClass('ui-state-disabled');
    $('#routeCreatorNav ul').removeClass('ui-state-disabled');
});
$('#searchPage, #routesPage, #cityInfoPage, #routeResultPage, #myRoutesPage').on("pagecreate", function(event, ui) {
    $(".animateCollapsible .ui-collapsible-heading-toggle").on("click", function (e) { 
        var current = $(this).closest(".ui-collapsible");             
        if (current.hasClass("ui-collapsible-collapsed")) {
            //collapse all others and then expand this one
            $(".ui-collapsible").not(".ui-collapsible-collapsed").find(".ui-collapsible-heading-toggle").click();
            $(".ui-collapsible-content", current).slideDown(300);
        } else {
            $(".ui-collapsible-content", current).slideUp(300);
        }
    });
});
$('#routeCreatorPage').on("pageshow", function(event, ui) {
     google.maps.event.trigger(routeMap, "resize");
});
$('#mapPage').on("pageshow", function(event, ui) {
     //google.maps.event.trigger(map, "resize");
});
$('#calendarPage').on("pageshow", function(event, ui) {
    $('#calendar').fullCalendar('render');
});
$(function() {
	$("[data-role='navbar']").navbar();
	$("[data-role='footer']").toolbar({theme: "d"});
});
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//SECCION FOTOS (DEPRECADA)
function onSuccess(imageURI) {
    /*getFileContentAsBase64(imageURI,function(base64Image){
        $.post(url+'di_serverCamera.php', {imagen:base64Image}, function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
    });*/
}
function onFail(message) {
    console.log("Picture failure: " + message);
}
//Hacer foto con cámara
function takePicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 1,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: false
    });
}
//Sacar foto de galería
function importPicture(source) {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 1,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}