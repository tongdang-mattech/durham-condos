var map;
var whitby = new google.maps.LatLng(43.899966,-78.682022);
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

   
    //Clarington 

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.904231, -78.706162),
        map: map,
        title: 'Aspen Springs',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/aspensprings.html', '_parent');
    });
	
	    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.905561, -78.704617),
        map: map,
        title: '80-84 Aspen Springs',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/80_aspen.html', '_parent');
    });	
	
	var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.918003, -78.580318),
        map: map,
        title: '21 Brookhouse Drive',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/21_brookhouse.html', '_parent');
    });


    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.907131, -78.706162),
        map: map,
        title: '61 Clarington Blvd',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/61_clarington.html', '_parent');
    });
	
	 var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.890143, -78.804830),
        map: map,
        title: '1430 Gord Vinson Ave',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/1430_gordvinson.html', '_parent');
    });
	
		    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.931147, -78.690160),
        map: map,
        title: '290 Liberty Street N',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/290_liberty.html', '_parent');
    });
	
	 var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.897313, -78.580602),
        map: map,
        title: '70 and 80 Shipway Ave',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/70_shipway.html', '_parent');
    });
	
		 var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.89596, -78.58381),
        map: map,
        title: '305-365 Lakebreeze Ave',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/345_lakebreeze.html', '_parent');
    });


    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.913986, -78.687934),
        map: map,
        title: '95 Wellington Street',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/95_wellington.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.911745, -78.691174),
        map: map,
        title: '144 Queen Street',
        clickable: true,
        icon: image
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/144_queen.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.897104, -78.583124),
        map: map,
        title: '75 Shipway Avenue',
        clickable: true,
        icon: 'img/condo.png'
    });
	
    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/75_shipway.html', '_parent');
    });
	
			    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.901611, -78.709142),
        map: map,
        title: 'Sidney Lane',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/1_sidney.html', '_parent');
    });


    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.89611, -78.586037),
        map: map,
        title: '375-395 Lakebreeze Drive',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/375_lakebreeze.html', '_parent');
    });

    var image = 'img/condo.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.913507, -78.788302),
        map: map,
        title: 'Nash Road',
        clickable: true,
        icon: 'img/condo.png'
    });

    new google.maps.event.addListener(marker, 'click', function() {
        window.open('clarington/condos/nashroad.html', '_parent');
    });

    
  
    
})();
