var map;
var whitby = new google.maps.LatLng(43.904006,-78.863726);
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
        zoom: 12,
        center: whitby,
		tilt: 45,
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

     //*Oshawa*/
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.925872, -78.855486),
        map: map,
        title: '700 and 900 Wilson Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/700_wilson.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.900304, -78.862395),
        map: map,
        title: '50 Richmond Street and 55 William Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/50_richmond.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.899006, -78.863726),
        map: map,
        title: '44 Bond Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/44_bond.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.897583, -78.860679),
        map: map,
        title: '80 Athol Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/80_athol.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.907169, -78.901191),
        map: map,
        title: '600 Thornton Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/600_thornton.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.933351, -78.875184),
        map: map,
        title: '131 Taunton Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/131_taunton.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.933228, -78.876300),
        map: map,
        title: '43 and 53 Taunton Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/43_taunton.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.902021, -78.870721),
        map: map,
        title: '120 Elgin Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/120_elgin.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.906581, -78.867116),
        map: map,
        title: '337 Simcoe Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/337_simcoe.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.907169, -78.867438),
        map: map,
        title: '363 Simcoe Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/363_simcoe.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.888839, -78.863082),
        map: map,
        title: '454 Centre Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/454_centre.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.873024, -78.856215),
        map: map,
        title: '936 Glen Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('oshawa/condos/936_glen.html', '_parent');
    });

    

    
   
   
})();
