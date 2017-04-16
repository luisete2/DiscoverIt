document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    //intel.xdk.device.setRotateOrientation('portrait');
    window.StatusBar.show();
    window.StatusBar.backgroundColorByHexString('#000000');
    window.StatusBar.overlaysWebView(false);
    document.getElementById('searchButton').disabled = true;
}
var iconPin = {
    url: "location_marker.svg",
    anchor: new google.maps.Point(25, 50),
    scaledSize: new google.maps.Size(50, 50)
}
var map, marker, mousedUp = false, service, directionsDisplay, typeQuery=0;
var geocoder = new google.maps.Geocoder;
var GeoMarker = new GeolocationMarker();
var markerArray = [];
var routesArray = [];
var infoWindow= new google.maps.InfoWindow;
//MAPA
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
    /*map.addListener('mouseup', function(e){ 
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
    });
}*/
}

function cleanMarkers() {
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }
    markerArray.length = 0;
    document.getElementById('cleanMarkersIcon').style.display = 'none';
}

function searchPlace() {
    if (typeQuery == 0) {
        alert('NO TIPO');
    } else if (typeQuery == 1) {
        //CODIGO PARA BUSQUEDAS COMPLEJAS
    } else {
        var userPos = GeoMarker.getPosition().toUrlValue();
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
            directionsDisplay.setDirections({routes: []});
            document.getElementById('cleanRouteIcon').style.display = 'none';
            document.getElementById('cleanMarkersIcon').style.display = 'inline';
        });
    }
}
/*    
Metodo para sacar lugares de interes en busqueda cercana. hay que implementar
alert('entramos');
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: userPos,         
            radius: document.getElementById('B2In').value,
            keyword: "POI"
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
    if(markerArray.length!=0) cleanMarkers();
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(routesArray[routeId].gRoute, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else alert('failed to get directions');
    });
    window.location.href = '#mapPage';
    document.getElementById('cleanRouteIcon').style.display = 'inline';
}
function getRoutes(){
    //alert('entramos');
    $.post('http://192.168.1.41/DiscoverIt/www/php/di_routeLoader.php', {}, function(data, status) {
        var mdata = JSON.parse(data);
        mdata.forEach(function(k) {
            //hay que hacer query por cada id de monumento
            $("#routes_accordion").append("<div class='accordion_button'>"+k.nombre+"</div><div class='accordion_content'>holaaaaaaaaaaaaaaaa<button onclick='setRoute(\"" + k._id.$id + "\")'>Iniciar ruta</button></div>");
            routesArray[k._id.$id]=k; 
        });
    });
};
initMap();
getRoutes();