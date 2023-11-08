var map;
var whitby = new google.maps.LatLng(43.841925,-79.027157);
var infoWindow = new google.maps.InfoWindow;
var bounds = new google.maps.LatLngBounds();

(function(){
    var stylez = [{
            featureType: "all",
            elementType: "all",
            stylers: []
        }, 
        {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{
                invert_lightness: false
            }]
        }
    ];

    var mapOptions = {
        zoom: 13,
        tilt: 45,
		center: whitby,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.SATELLITE, 'bestfromgoogle']
        }
	    };
    
    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);

    var styledMapOptions = {
        name: "Durham Condos"
    }

    var jayzMapType = new google.maps.StyledMapType(
        stylez, styledMapOptions);

    map.mapTypes.set('bestfromgoogle', jayzMapType);
    map.setMapTypeId('bestfromgoogle');

    var image = 'img/condo.png';
    //*Function to Create Marker*/

    

    //Ajax

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.841430, -79.016933),
        map: map,
        title: '44 and 66 Falby Court',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('ajax/condos/44_falby.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.822259, -79.013511),
        map: map,
        title: '25, 45 and 70 Cumberland',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('ajax/condos/25_cumberland.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.824032, -79.035258),
        map: map,
        title: 'Lake Driveway',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('ajax/condos/189_lakedriveway.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.857925, -79.042726),
        map: map,
        title: '2 Westney Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('ajax/condos/2_westney.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.850560, -79.054753),
        map: map,
        title: '92 Church Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('ajax/condos/92_church.html', '_parent');
    });

})();
