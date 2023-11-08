var map;
var whitby = new google.maps.LatLng(43.886483,-78.946618);
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
        zoom: 11,
        center: whitby,
		tilt: 45,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.SATELITTE, 'bestfromgoogle']
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

       //Whitby           

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.876516, -78.943162),
        map: map,
        title: '210 Gilbert Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/210_gilbert.html', '_parent');
    });
	
	 var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.851494, -78.941880),
        map: map,
        title: '650-680 Gordon Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/gordon.html', '_parent');
    });
	
		 var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.953071, -78.966114),
        map: map,
        title: '52 Harvey Johnston Way',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/52_harveyjohnston', '_parent');
    });
	
	 var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.953169, -78.964928),
        map: map,
        title: '54 Harvey Johnston Way',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/54_harveyjohnston', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.899856, -78.938044),
        map: map,
        title: '711 Rossland Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/711_rossland.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.900521, -78.938634),
        map: map,
        title: '712 Rossland Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/712_rossland.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.860772, -78.938549),
        map: map,
        title: '360 Watson Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/360_watson.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.859798, -78.937862),
        map: map,
        title: '340 Watson Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/340_watson.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.861468, -78.937105),
        map: map,
        title: '1600 Charles Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/1600_charles.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.903829, -78.948333),
        map: map,
        title: 'Petra Way',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('whitby/condos/petraway.html', '_parent');
    });


  
})();
