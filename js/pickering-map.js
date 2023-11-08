var map;
var whitby = new google.maps.LatLng(43.836155,-79.090002);
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
        zoom: 14,
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

    //Pickering       

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.841584, -79.072809),
        map: map,
        title: '1655 and 1665 Pickering Parkway',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('pickering/condos/1655_pickering.html', '_parent');
    });
	
	 var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.839169, -79.072052),
        map: map,
        title: '1625 Pickering Parkway',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('pickering/condos/1625_pickering.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.837282, -79.078066),
        map: map,
        title: '1530 and 1540 Pickering Parkway',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('pickering/condos/1530_pickering.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.838489, -79.078538),
        map: map,
        title: '1525 Diefenbaker Court',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('pickering/condos/1525_diefenbaker.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.839480, -79.082422),
        map: map,
        title: '1880 and 1890 Valley Farm Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('pickering/condos/1880_valleyfarm.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.839371, -79.084654),
        map: map,
        title: '1000 and 1200 The Esplanade',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('pickering/condos/theesplanade.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.827252, -79.090812),
        map: map,
        title: '1235 Bayly Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('pickering/condos/1235_bayly.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.825765, -79.090769),
        map: map,
        title: '1210 Radom Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('pickering/condos/1210_radom.html', '_parent');
    });


    
    
})();
