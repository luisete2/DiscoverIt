/* jshint browser: true */
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
var iconPin = {
    url: "location_marker.svg",
    anchor: new google.maps.Point(25, 50),
    scaledSize: new google.maps.Size(50, 50)
};
var url='http://10.34.120.97/DiscoverIt/www/php/';
var map, routeMap, marker, mousedUp = false, service, directionsDisplay, typeQuery=0;
var geocoder = new google.maps.Geocoder(), GeoMarker = new GeolocationMarker();
var routesArray = [], infoWindow= new google.maps.InfoWindow();
var autocomplete =  new google.maps.places.Autocomplete(document.getElementById('B1City'),{types: ['(cities)']});
var autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('B3City'),{types: ['(cities)']});
var rOrigin = null, rDestination = null, rWaypoints = [], markerArray = [], rDirectionsDisplay;

//SECCIÓN MAPA
//Mapa de pagina principal
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
    google.maps.event.addListener(autocomplete2, 'place_changed', function(){
        var place = autocomplete2.getPlace();
    });
    google.maps.event.trigger(map, "resize");
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
    /*if (navigator.geolocation) {
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
    }*/
    /*google.maps.event.addListener(routeMap, 'click', function(event) {
        if (rOrigin === null) {
            rOrigin = event.latLng;
            addMarker(rOrigin);
        } else if (rDestination === null) {
            rDestination = event.latLng;
            addMarker(rDestination);
        } else {
            if (rWaypoints.length < 9) {
                rWaypoints.push({ location: rDestination, stopover: true });
                rDestination = event.latLng;
                addMarker(rDestination);
            } else {
                alert("Maximum number of waypoints reached");
            }
        }
    });*/
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
/*
function addMarker(latlng) {
    markers.push(new google.maps.Marker({
      position: latlng, 
      map: map,
      icon: "http://maps.google.com/mapfiles/marker" + String.fromCharCode(markers.length + 65) + ".png"
    }));    
  }
  function serializeLatLng(ll) {
  return '{latitude: ' + ll.lat() + ', longitude: ' + ll.lng() + '}';
  }
  function calcRoute() {
    if (origin == null) {
      alert("Click on the map to add a start point");
      return;
    }
    if (destination == null) {
      alert("Click on the map to add an end point");
      return;
    }
    var mode = google.maps.DirectionsTravelMode.DRIVING;
    var request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: mode,
        optimizeWaypoints: true,
        avoidHighways: false
    };
    
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
    var points_text = "", format = "raw";
    if (document.getElementById("json").checked) {
      format = "json";
      points_text += 'var routeCenter = ' + serializeLatLng(response.routes[0].bounds.getCenter()) + ';\n';
      points_text += 'var routeSpan = ' + serializeLatLng(response.routes[0].bounds.toSpan()) + ';\n';
      points_text += 'var routePoints = [\n'
    }
    response.routes[0].bounds.getCenter.lng
    var nPoints = response.routes[0].overview_path.length;
    for (var i = 0; i < nPoints; i++) { 
      if ( format == "json" ) {
        points_text += '\t' + serializeLatLng(response.routes[0].overview_path[i]) + (i < (nPoints - 1) ? ',\n' : '');
      } else {
        points_text += response.routes[0].overview_path[i].lat() + ',' + response.routes[0].overview_path[i].lng() + '\n';
      }
    }
    if ( format == "json" ) {
      points_text += '\n];'
    }
    var points_textarea=document.getElementById("points_textarea");
    points_textarea.value = points_text;
    clearMarkers();
      directionsDisplay.setDirections(response);
      }
    });
  }
  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  
  function clearWaypoints() {
    markers = [];
    origin = null;
    destination = null;
    waypoints = [];
  }
  
  function select_all() {
  var points_textarea=document.getElementById("points_textarea");
  points_textarea.focus();
  points_textarea.select();
  }
  function reset() {
    clearMarkers();
    clearWaypoints();
    directionsDisplay.setMap(null);
    directionsDisplay.setPanel(null);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
  document.getElementById("points_textarea").value = '';
  }*/

$('#searchPage').on("pagecreate", function(event, ui) {
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
$('#routesPage').on("pagecreate", function(event, ui) {
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
$('#cityInfoPage').on("pagecreate", function(event, ui) {
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

$('#routeCreatorPage').on("pagecreate", function(event, ui) {
    google.maps.event.trigger(routeMap, 'resize');
});
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
function cleanMarkers() {
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }
    markerArray.length = 0;
    document.getElementById('cleanMarkersIcon').style.display = 'none';
}

function searchPlace() {
    setTimeout(function(){
        $.mobile.loading('show');
    },1);
    if (typeQuery === 0) {
        window.alert('Por favor, selecciona un tipo de búsqueda.');
    } else if (typeQuery == 1) {
        //INSERTAR LOADING
        //CODIGO PARA BUSQUEDAS COMPLEJAS
        if(!document.getElementById('B1Keywords').value){
            window.alert('Por favor, inserta palabras clave para realizar la busqueda.');
        }else if(!document.getElementById('B1City').value){
            window.alert('Por favor, inserta una ciudad para realizar la busqueda.');
        }else{
            geocoder.geocode({'address': document.getElementById('B1City').value}, function(results, status) {
                if (status == 'OK') {
                    map.panTo(results[0].geometry.location);
                    $.post(url+'di_placeQuerys.php', {
                        tipoQuery: typeQuery,
                        lat: results[0].geometry.location.lat,
                        lng: results[0].geometry.location.lng,
                        query: document.getElementById('B1Keywords').value,
                        tipo: document.getElementById("B1Type").options[document.getElementById("B1Type").selectedIndex].value
                    }, function(data, status) {
                        //window.alert(JSON.stringify(data, null, 4));
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
                    window.alert('La geolocalización de la ciudad ha fallado. Introduce una ciudad válida. '+status);
                }
            });
        }
    } else if (typeQuery == 2){
        //INSERTAR LOADING
        var userPos = GeoMarker.getPosition();
        //CODIGO PARA BUSQUEDAS POR CERCANIA
        $.post(url+'di_placeQuerys.php', {
            tipoQuery: typeQuery,
            radio: document.getElementById('B2In').value,
            lat: userPos.lat,
            lng: userPos.lng,
            tipo: document.getElementById("B2Type").options[document.getElementById("B2Type").selectedIndex].value
        }, function(data, status) {
            cleanMarkers();
            window.location.href = '#mapPage';
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
        });
    } else if (typeQuery == 3){
        if(!document.getElementById('B3City').value){
            window.alert('Por favor, inserta una ciudad para realizar la busqueda.');
        }else{
            var city;
            if(document.getElementById('B3City').value.indexOf(',') !== -1){
                city = document.getElementById('B3City').value.substr(0, document.getElementById('B3City').value.indexOf(','));
            }else if(document.getElementById('B3City').value.indexOf(' ') !== -1){
                city = document.getElementById('B3City').value.substr(0, document.getElementById('B3City').value.indexOf(' '));
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
                    //$("#cityInfoCollapsible").collapsible();
                    for (var k in mdata){
                        if (mdata.hasOwnProperty(k)) {
                            $("#cityInfoCollapsible").append("<div data-role='collapsible' class='animateCollapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'><h3>"+k+"</h3>"+mdata[k]+"</div>").trigger('create');
                        }
                    }
                    window.location.href = '#cityInfoPage';
                    //city=city.charAt(0).toUpperCase() + string.city(1)
                    $('#cityInfoPage').children('div').children('h1').text(capitalizeFirstLetter(city));
                }else window.alert('¡No se han encontrado resultados!');
            });  
        }
    }
    setTimeout(function(){
        $.mobile.loading('hide');
    },300);  
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/*Metodo para sacar lugares de interes en busqueda cercana. hay que implementar
    alert('sumergise hijo de puta');
        service.nearbySearch({
            location: userPos,         
            radius: document.getElementById('B2In').value,
            //keyword: "POI",
            types: document.getElementById("B2Type").options[document.getElementById("B2Type").selectedIndex].value
        }, function (results, status) {
            window.alert(status);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                window.alert('hemos hecho busqueda');
                cleanMarkers();
                window.location.href = '#mapPage';
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
$(function() {
	$("[data-role='navbar']").navbar();
	$("[data-role='footer']").toolbar({theme: "d"});
});

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
$('#cleanMarkersIcon').click(function() {
    cleanMarkers();
});
$('#cleanRouteIcon').click(function() {
    directionsDisplay.setDirections({routes: []});
    document.getElementById('cleanRouteIcon').style.display = 'none';
});
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
//Sacar foto de galerí
function importPicture(source) {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 1,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}
//SECCION RUTAS
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
google.maps.event.addDomListener(window, "load", initMap);
google.maps.event.addDomListener(window, "load", initRouteMap);
getRoutes();

