document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    //intel.xdk.device.setRotateOrientation('portrait');
    window.StatusBar.show();
    window.StatusBar.backgroundColorByHexString('#000000');
    window.StatusBar.overlaysWebView(false);
    document.getElementById('searchButton').disabled = true;
    //google.maps.event.addDomListener(window, 'load', initMap);
}
var iconPin = {
    url: "location_marker.svg",
    anchor: new google.maps.Point(25, 50),
    scaledSize: new google.maps.Size(50, 50)
};

var map, marker, mousedUp = false, service, directionsDisplay, typeQuery=0;
var geocoder = new google.maps.Geocoder;
var GeoMarker = new GeolocationMarker();
var markerArray = [];
var routesArray = [];
var infoWindow= new google.maps.InfoWindow;
var autocomplete = new google.maps.places.Autocomplete(document.getElementById('B1City'),{types: ['(cities)']});

//MAPA
function initMap() {
    map = new google.maps.Map(document.getElementById('mapa_div'), {
        center: {
            lat: 40.415347,
            lng: -3.707371
        },
        zoom: 7,
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
            map.setCenter(pos);
            GeoMarker.setCircleOptions({
                fillColor: '#808080'
            });
            google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
                map.setCenter(this.getPosition());
                map.fitBounds(this.getBounds());
            });
            google.maps.event.addListener(GeoMarker, 'geolocation_error', function(e) {
                alert('There was an error obtaining your position. Message: ' + e.message);
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
    /*
    map.addListener('mouseup', function(e){ 
        mousedUp = true;
    });
    map.addListener('dragstart', function(e){ 
        mousedUp = true;
    });
    map.addListener('zoom_changed', function(e){ 
        mousedUp = true;
    });
    map.addListener('mousedown', function(e) {
        mousedUp = false;
        setTimeout(function(){
            if(mousedUp === false){
                placeMarker(e.latLng);
                setInfo(e.latLng);
                //map.panTo(e.latLng);
            }
        }, 600);
    });*/
}

function cleanMarkers() {
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }
    markerArray.length = 0;
    document.getElementById('cleanMarkersIcon').style.display = 'none';
}

function searchPlace() {
    if (typeQuery === 0) {
        alert('NO TIPO');
    } else if (typeQuery == 1) {
        //CODIGO PARA BUSQUEDAS COMPLEJAS
        if(!document.getElementById('B1Keywords').value){
            alert('Por favor, inserta palabras clave para realizar la busqueda.');
        }else if(!document.getElementById('B1City').value){
            alert('Por favor, inserta una ciudad para realizar la busqueda.');
        }else{
            geocoder.geocode( { 'address': document.getElementById('B1City').value}, function(results, status) {
                if (status == 'OK') {
                    map.setCenter(results[0].geometry.location);
                    $.post('http://192.168.1.41/DiscoverIt/www/php/di_placeQuerys.php', {
                        tipoQuery: typeQuery,
                        lat: results[0].geometry.location.lat,
                        lng: results[0].geometry.location.lng,
                        query: document.getElementById('B1Keywords').value,
                        tipo: document.getElementById("B1Type").options[document.getElementById("B1Type").selectedIndex].value
                    }, function(data, status) {
                        //alert(JSON.stringify(data, null, 4));
                        cleanMarkers();
                        window.location.href = '#mapPage';
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
                    });
                } else {
                    alert('La geolocalización de la ciudad ha fallado. Introduce una ciudad válida. '+status);
                }
            });
            
        }
    } else {
        var userPos = GeoMarker.getPosition();
        //CODIGO PARA BUSQUEDAS POR CERCANIA
        $.post('http://192.168.1.41/DiscoverIt/www/php/di_placeQuerys.php', {
            tipoQuery: typeQuery,
            radio: document.getElementById('B2In').value,
            location: userPos,
            tipo: document.getElementById("B2Type").options[document.getElementById("B2Type").selectedIndex].value
        }, function(data, status) {
            cleanMarkers();
            window.location.href = '#mapPage';
            map.setCenter(GeoMarker.getPosition());
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
        });
    }
}
/*Metodo para sacar lugares de interes en busqueda cercana. hay que implementar
    alert('sumergise hijo de puta');
        service.nearbySearch({
            location: userPos,         
            radius: document.getElementById('B2In').value,
            //keyword: "POI",
            types: document.getElementById("B2Type").options[document.getElementById("B2Type").selectedIndex].value
        }, function (results, status) {
            alert(status);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                alert('hemos hecho busqueda');
                cleanMarkers();
                window.location.href = '#mapPage';
                map.setCenter(GeoMarker.getPosition());
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
                alert(status);
            }
        });
*/

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
        map.setCenter(pos);
    });
});
$('#cleanMarkersIcon').click(function() {
    cleanMarkers();
});
$('#cleanRouteIcon').click(function() {
    directionsDisplay.setDirections({routes: []});
    document.getElementById('cleanRouteIcon').style.display = 'none';
});
//FOTOS
function onSuccess(imageURI) {
    /*getFileContentAsBase64(imageURI,function(base64Image){
        $.post('http://192.168.1.41/DiscoverIt/www/php/di_serverCamera.php', {imagen:base64Image}, function(data, status){
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
//RUTAS
function setRoute(routeId){
    if(markerArray.length!==0) cleanMarkers();
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
}
function getRoutes(){
    //alert('entramos');
    $.post('http://192.168.1.41/DiscoverIt/www/php/di_routeLoader.php', {}, function(data, status) {
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
            $("#routes_accordion").append("<div class='accordion_button'>"+k.nombre+"</div><div class='accordion_content'><div class='routeMonList'><h4>Monumentos</h4>            <ul>"+lista+"</ul></div><div class='routeDesc'><h4>Descripción</h4>Esta es una ruta con encanto propio que sin duda dejara a aquellos que la realicen boqueabiertos por su belleza y su misterio.</div><div class='routeFooter'><div class='button' style='width: 40%;'><i class='fa fa-star-half-o fa-lg'></i> Valorar ruta</div><br><div class='button' style='width: 40%;' onclick='setRoute(\"" + k._id.$id + "\")'>Iniciar ruta</div></div></div>");
            routesArray[k._id.$id]=k; 
        });
    });
}
initMap();
getRoutes();