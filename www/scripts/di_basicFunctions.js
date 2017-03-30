document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    //intel.xdk.device.setRotateOrientation('portrait');
    window.StatusBar.show();
    window.StatusBar.backgroundColorByHexString('#000000');
    window.StatusBar.overlaysWebView(false);
}
var map, marker, mousedUp = false;
var geocoder = new google.maps.Geocoder;
var infowindow = new google.maps.InfoWindow;
var GeoMarker = new GeolocationMarker();
var markerArray = [];
//MAPA
function initMap() {
    map = new google.maps.Map(document.getElementById('mapa_div'), {
        center: {
            lat: -34.397,
            lng: 150.644
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
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            //infoWindow.close();
            GeoMarker.setCircleOptions({fillColor: '#808080'});
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
    /*map.addListener(marker, "dragstart", function (event) {
        marker.setAnimation(3); 
    });
    map.addListener(marker, "dragend", function (event) {
        marker.setAnimation(4); 
    });
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
function placeMarker(position){
    if(markerArray[0]){
        markerArray[0].setMap(null);
        markerArray.length=0;
    }
    markerArray[0] = new google.maps.Marker({
            position: position,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            raiseOnDrag: true
        });
}
function setInfo(position) {
    geocoder.geocode({'location': position}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        str = JSON.stringify(results[1], null, 4); // (Optional) beautiful indented output.
        //alert(str); // Displays output using window.alert()
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, markerArray[0]);
      } else {
        infowindow.setContent('No hay información sobre este lugar.');
        infowindow.open(map, markerArray[0]);
      }
    } else {
      window.alert('El geocoder falló debido a: ' + status);
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: El servicio geolocalizador falló.' : 'Error: Tu dispositivo no tiene geolocalización.');
}
$('#locationIcon').click(function(){
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.setCenter(pos);
    });
});
//FOTOS
function onSuccess(imageURI){
    getFileContentAsBase64(imageURI,function(base64Image){
        $.post('http://192.168.1.41/DiscoverIt/www/php/di_serverCamera.php', {imagen:base64Image}, function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
});
    
}
function onFail(message){
   console.log("Picture failure: " + message);
}
//Hacer foto con cámara
function takePicture(){
    navigator.camera.getPicture(onSuccess, onFail, { quality: 100, destinationType: destinationType.FILE_URI, saveToPhotoAlbum: false });
} 
//Sacar foto de galería
function importPicture(source){
    navigator.camera.getPicture(onSuccess, onFail, { quality: 100, destinationType: destinationType.FILE_URI, sourceType: source });
}
function getFileContentAsBase64(path,callback){
    window.resolveLocalFileSystemURL(path, gotFile, fail);
            
    function fail(e) {
          alert('Cannot found requested file');
    }

    function gotFile(fileEntry) {
           fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                   var content = this.result;
                   callback(content);
              };
              // The most important point, use the readAsDatURL Method from the file plugin
              reader.readAsDataURL(file);
           });
    }
}

initMap();