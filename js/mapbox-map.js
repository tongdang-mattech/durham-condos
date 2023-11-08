let ajaxModule = (function ($, window) {
    let _apiBase = "http://durhamcondos.ca/feed.php";

    function _get(url, callback, error_callback){
        $.ajax({
            'url': url,
            'type': 'GET',
            'success': callback,
            'error': error_callback,
            'dataType': "json"
        });     
    }   

    return {
        get: _get
    };
})($, window);

let controlModule = (function ($, window) {
  let _domAssets = {};
  let _templates = {};
  let _queryVars = {
    "min": 0,
    "max": 250000,
    "city": ""
  };

  function _init(){
    _cacheDom();
    _cacheTemplates();
    _registerEvents();
    _loadCondoRequest(_queryVars.min, _queryVars.max);
  }
  function _cacheDom(){
    _domAssets.propResultsList = $("#properties-results-list");
    _domAssets.locationsList = $("#locations-list");
    _domAssets.slider = $(".range-slider").slider({});
  }
  function _cacheTemplates(){
    _templates.condoCard = $("#tpl-condo-card").html();
    _templates.locationOptions = $("#tpl-location-options").html();
  }
  function _registerEvents(){
    
    ajaxModule.get("http://durhamcondos.ca/feed.php?min=" + _queryVars.min + "&max=" + _queryVars.max, function(data){   
      let locations = [];
      let fee_from = [];
      let fee_to = [];
      if(typeof data.features != "undefined"){
        for(i=0;i<data.features.length;i++){
          if(locations.indexOf(data.features[i].properties.location) == -1){
            locations.push(data.features[i].properties.location);
          }
          if(fee_from.indexOf(parseFloat(data.features[i].properties.fee_from)) == -1){
            fee_from.push(parseFloat(data.features[i].properties.fee_from));
          }
          if(fee_to.indexOf(parseFloat(data.features[i].properties.fee_to)) == -1){
            fee_to.push(parseFloat(data.features[i].properties.fee_to));
          }                    
        }
        _domAssets.locationsList.html(Mustache.render(_templates.locationOptions, {"locations": locations}));

        _domAssets.locationsList.on("change", function(){
          _queryVars.city = $(this).val();
          _loadCondoRequest(_queryVars.min, _queryVars.max, _queryVars.city);
        });

        _queryVars.min = Math.min.apply(Math, fee_from);
        _queryVars.max = Math.max.apply(Math, fee_to);
        _domAssets.slider.slider('setValue', [_queryVars.min, _queryVars.max]);
      }
    });

    _domAssets.slider.on("slideStop", function(sliderObj){
      _queryVars.min = sliderObj.value[0];
      _queryVars.max = sliderObj.value[1];
      
      //Perform filtering
      _loadCondoRequest(_queryVars.min, _queryVars.max, _queryVars.city);
    });
  }
  function _loadCondoRequest(priceMin = undefined, priceMax = undefined, city = undefined){
    let queryStringValuesArr = [
      (typeof priceMin != "undefined") ? ("min=" + priceMin) : undefined,
      (typeof priceMax != "undefined") ? ("max=" + priceMax) : undefined,
      (typeof city != "undefined" && city != "") ? ("city=" + city) : undefined, 
    ];

    let filteredStringValuesArr = queryStringValuesArr.filter(function(element){
      return (typeof element != "undefined");
    });

    //console.clear();
    //console.log(filteredStringValuesArr);

    let queryString = "http://durhamcondos.ca/feed.php?" + filteredStringValuesArr.join("&");

    console.log(queryString);

    ajaxModule.get(queryString, function(data){
      console.log(data);
      //Display data on the map
      //Update sidebar results
      mapModule.updateMap(data);
      _updateResults(data);
    }, function(){})
  }

  function _updateResults(data){
    console.log("Deleting old results...");
    
    //_domAssets.propResultsList.html('');

    $("#properties-results-list").html("");

    let results = [];
    for(i=0;i<data.features.length;i++){
      results.push($.extend(true, {}, data.features[i].properties, {"lat": data.features[i].geometry.coordinates[1], "lng": data.features[i].geometry.coordinates[0]}));
    }
    _domAssets.propResultsList.html(Mustache.render(_templates.condoCard, {"condos": results}));
    _domAssets.propResultsList
      .find(".map-link")
      .off()
      .on("click", function(e){
        e.preventDefault();
        console.log(results);
      });
  }

  return {
    initialize: _init
  };
})($, window);

let mapModule = (function ($, mgl) {
  const _token = "pk.eyJ1IjoibWlrZWJvdW1hIiwiYSI6ImNpZmljeW9qcWJranpzdWtudzYzamUxeTAifQ.i-GTa9JmWdv7OqfuxNCiRw";
  let _assets = {};

  // We'll expose all these functions to the user
  function _init(mapID, lat, lng, z, p, b) {
    _cacheDom();
    _startMap(mapID, lat, lng, z, p, b);
  }

  function _cacheDom(){

  }

  function _cacheTemplates(){

  }

  function _updateMap(newGeojson){
    let source = _assets.map.getSource("condos");
    source.setData(newGeojson);
    let bounds = new mapboxgl.LngLatBounds();
    for(i=0;i<newGeojson.features.length;i++){
      if(newGeojson.features[i].geometry.coordinates[0] != 0 && newGeojson.features[i].geometry.coordinates[1] != 0){
        bounds.extend(newGeojson.features[i].geometry.coordinates);
      }
    }
    _assets.map.fitBounds(bounds, {
      padding: {"top": 20, "bottom": 20, "right": 20, "left": 20}
    });    
  }

  function _startMap(containerID, lat, lng, z, pitch, bearing){
    mgl.accessToken = _token;
    _assets.map = new mgl.Map({
      container: containerID,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: z,
      pitch: pitch,
      bearing: bearing
    });
    
    _assets.map.on('load', function() {
      
        _assets.map.addSource('condos', {
          "type": "geojson",
          "data": {"type": "FeatureCollection", "features": []}
        });
        _assets.map.loadImage("http://durhamcondos.ca/img/condo.png", function(error0, image0) {
          _assets.map.addImage("condo", image0);
          _assets.map.addLayer({
            'id': 'condo-markers',
            'type': 'symbol',
            'source': 'condos',
            'layout': {
              'icon-image': 'condo',
              'icon-allow-overlap': true
            }
          });

          _assets.map.on('click', 'condo-markers', function(e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML('<a href="'+e.features[0].properties.url+'" target="_blank">' + e.features[0].properties["meta_placename"] + '</a>')
              .addTo(_assets.map);
          }); 

          _assets.map.on('mouseenter', 'condo-markers', function() {
            _assets.map.getCanvas().style.cursor = 'pointer';
          });
           
          _assets.map.on('mouseleave', 'condo-markers', function() {
            _assets.map.getCanvas().style.cursor = '';
          });

        });

        controlModule.initialize();

    });
    
  }

  return {
    initialize: _init,
    updateMap: _updateMap
  }
})(jQuery, mapboxgl);