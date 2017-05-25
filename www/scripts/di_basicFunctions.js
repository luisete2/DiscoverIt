/* jshint browser: true */

//PRIMERA INICIALIZACION
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    //intel.xdk.device.setRotateOrientation('portrait');
    //window.StatusBar.show();
    window.StatusBar.backgroundColorByHexString('#000000');
    window.StatusBar.overlaysWebView(false);
    //google.maps.event.addDomListener(window, 'load', initMap);
}
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
var url='http://10.34.81.129/DiscoverIt/www/php/';
google.maps.event.addDomListener(window, "load", initMap);
google.maps.event.addDomListener(window, "load", initRouteMap);
getRoutes();
var map, routeMap, marker, mousedUp = false, service, directionsDisplay, typeQuery=0, request;
var geocoder = new google.maps.Geocoder(), GeoMarker = new GeolocationMarker();
var routesArray = [], infoWindow= new google.maps.InfoWindow();
var rDirectionsService = new google.maps.DirectionsService();
var autocomplete =  new google.maps.places.Autocomplete(document.getElementById('B1City'),{types: ['(cities)']});
var rOrigin = null, rDestination = null, rWaypoints = [], markerArray = [], rDirectionsDisplay, rMarkerArray=[];

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
    google.maps.event.addListener(autocomplete, 'place_changed', function(){
        var place = autocomplete.getPlace();
    });
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
    routeMap.addListener('zoom_changed', function(e){ 
        mousedUp = true;
    });
    routeMap.addListener('mousedown', function(e) {
        mousedUp = false;
        setTimeout(function(){
            if(mousedUp === false){
                if (rOrigin === null) {
                    rOrigin = e.latLng;
                    addMarker(rOrigin);
                } else if (rDestination === null) {
                    rDestination = e.latLng;
                    addMarker(rDestination);
                } else {
                    if (rWaypoints.length < 9) {
                        rWaypoints.push({ location: rDestination, stopover: true });
                        rDestination = e.latLng;
                        addMarker(rDestination);
                    } else {
                        window.alert("¡Has alcanzado el tamaño máximo de ruta! Por favor, elimina algún punto para añadir otro.");
                    }
                }
            }
        }, 400);
    });
}

function addMarker(latlng) {
    rMarkerArray.push(new google.maps.Marker({
        position: latlng, 
        map: routeMap,
        //draggable: true,
    }));    
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
        rMarkerArray.pop();
        rWaypoints.pop();
    }
}
function calcRoute() {
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
    }else{
        $.post(url+'di_saveRoute.php', {
            ruta: JSON.stringify(request),
            nombre: document.getElementById('routeName').value,
            descripcion: document.getElementById('routeDesc').value,
        }, function(data, status) {
            if(data=='SUCCESS'){
                window.alert('¡Ruta guardada con éxito!');
                $.mobile.changePage("#mapPage");
                resetRoute();
            }else{
                window.alert('Algo falló O.o');
            }
            $('#searchPage').spin(false);
        });
    }
}

function placeMarker(position) {
    if (markerArray[0]) {
        markerArray[0].setMap(null);
        markerArray.length = 0;
    }
    markerArray[0] = new google.maps.Marker({
        position: position,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        raiseOnDrag: true
    });
}
function cleanMap() {
    clearMarkers(markerArray);
    markerArray = [];
    document.getElementById('cleanMarkersIcon').style.display = 'none';
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
                    map.panTo(results[0].geometry.location);
                    $.post(url+'di_placeQuerys.php', {
                        tipoQuery: typeQuery,
                        lat: results[0].geometry.location.lat,
                        lng: results[0].geometry.location.lng,
                        query: document.getElementById("B1Query").options[document.getElementById("B1Query").selectedIndex].value
                    }, function(data, status) {
                        //window.alert(JSON.stringify(data, null, 4));
                        var contador=0;
                        cleanMap();
                        $.mobile.changePage("#mapPage");
                        $("#mainNav").show();
                        var mdata = JSON.parse(data);
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
                        console.log(contador);
                        directionsDisplay.setDirections({routes: []});
                        document.getElementById('cleanRouteIcon').style.display = 'none';
                        document.getElementById('cleanMarkersIcon').style.display = 'inline';
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
            cleanMap();
            $.mobile.changePage( "#mapPage");
            $( "#mainNav" ).show();
            map.panTo(GeoMarker.getPosition());
            var mdata = JSON.parse(data);
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
    $('#routesPage').spin('loading');
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
    document.getElementById('cleanRouteIcon').style.display = 'inline';
    $('#routesPage').spin(false);
}
function getRoutes(){
    $.post(url+'di_routeLoader.php', {}, function(data, status) {
        var mdata = JSON.parse(data);
        mdata.forEach(function(k) {
            var lista="<li>"+k.gRoute.origin+"</li>";
            if("waypoints" in k.gRoute){
                var waypoints="";
                k.gRoute.waypoints.forEach(function(m){
                    waypoints=waypoints.concat('<li>'+m.location+'</li>');
                });
                lista=lista.concat(waypoints, "<li>"+k.gRoute.destination+"</li>");
            }else lista=lista.concat("<li>"+k.gRoute.destination+"</li>");
            //hay que hacer query por cada id de monumento
            $("#routesCollapsible").append("<div data-role='collapsible' class='animateCollapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'><h3>"+k.nombre+"</h3><div class='ui-grid-a'><div class='ui-block-a'><h4>Monumentos</h4><ul class='monList'>"+lista+"</ul></div><div class='ui-block-b'><h4>Descripción</h4>Esta es una ruta con encanto propio que sin duda dejara a aquellos que la realicen boqueabiertos por su belleza y su misterio.</div></div><div class='ui-grid-a'><div class='ui-block-a'><img id='userPhoto' src='avatar.jpg' style='border-radius: 15px; height: 30%; width: 30%;'><div id='userName'>Antonio R.</div></div><div class='ui-block-b'><button><i class='fa fa-star-half-o fa-lg'></i> Valorar ruta</button><br><button onclick='setRoute(\"" + k._id.$id + "\")'>Iniciar ruta</button></div></div>");
            routesArray[k._id.$id]=k; 
        });
    });
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
$('#searchPage, #routesPage, #cityInfoPage').on("pagecreate", function(event, ui) {
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