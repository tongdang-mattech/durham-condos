var map;
let center = new google.maps.LatLng(43.886483, -78.879618);
let bounds = new google.maps.LatLngBounds();
var infoBubble;
var image;
let zoom = 11;
let search = null;
let markers = [];
var stylez = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        invert_lightness: false,
      },
    ],
  },
];

const _search = $("#search");
_search.on("keyup", function (e) {
  if (e.key === "Enter" || e.keyCode === 13) {
    search = _search.val();
    if (search == "") search = null;
    configMap(map);
  }
});
const _remove = $("#search-remove");
_remove.on("click", function () {
  if (!!_search.val()) {
    _search.val("");
    search = null;
    configMap(map);
  }
});
const _city = $("#city-filter");
_city.on("change", function () {
  configMap(map);
});
const _town = $("#town-filter");
_town.on("change", function () {
  configMap(map);
});
let utilities = [];

$("input:checkbox[name=utilities]").each((key, el) => {
  el.addEventListener("change", function () {
    if (el.checked && !utilities.includes(el.value)) utilities.push(el.value);
    else if (!el.checked && utilities.includes(el.value)) {
      const idx = utilities.indexOf(el.value);
      utilities.splice(idx, 1);
    }
    configMap(map);
  });
});

let amenities = [];
$("input:checkbox[name=amenities]").each((key, el) => {
  el.addEventListener("change", function () {
    if (el.checked && !amenities.includes(el.value)) amenities.push(el.value);
    else if (!el.checked && amenities.includes(el.value)) {
      const idx = amenities.indexOf(el.value);
      amenities.splice(idx, 1);
    }
    configMap(map);
  });
});

async function fetchData() {
  let city = $("#city-filter").val();
  let town = $("#town-filter").val();
  let pages = await axios
    .get("https://durhamcondos.ca/Map/api-map.php", {
      params: {
        city: city,
        search: search,
        town: town,
        utillities: utilities,
        amenities: amenities,
      },
    })
    .then((res) => res.data);
  pages = pages.filter((x) => x.meta_position);
  return pages;
}

(async function () {
  let pages = await fetchData();

  var stylez = [
    {
      featureType: "all",
      elementType: "all",
      stylers: [],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          invert_lightness: false,
        },
      ],
    },
  ];

  var mapOptions = {
    zoom: zoom,
    tilt: 45,
    center: center,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.SATELLITE, "bestfromgoogle"],
    },
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  infoBubble = new InfoBubble({
    map: map,
    shadowStyle: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#2c2c2c",
    disableAutoPan: true,
    hideCloseButton: true,
    minWidth: 250,
    maxWidth: 250,
    padding: 0,
    zIndex: 1,
    disableAnimation: true,
  });

  var styledMapOptions = {
    name: "Durham Condos",
  };

  var jayzMapType = new google.maps.StyledMapType(stylez, styledMapOptions);

  map.mapTypes.set("bestfromgoogle", jayzMapType);
  map.setMapTypeId("bestfromgoogle");

  for (const key in pages) {
    const page = pages[key];
    const title = page.title_address;
    if (page.path.includes("condos")) image = "img/condo.png";
    else image = "img/townhome.png";
    let position = page.meta_position;
    position = position.split(";");
    position = position.map((x) => Number(x));
    const path = page.path;

    const latLng = new google.maps.LatLng(position[0], position[1]);

    markers[key] = new google.maps.Marker({
      position: latLng,
      map: map,
      clickable: true,
      icon: image,
    });

    const bg_img_url = `${page.bg_image_url}`;

    let content_html = `<img src=${bg_img_url} onerror="this.style.backgroundColor='#c4c4c4'; this.src='img/camera-slash.svg'; "
                style = "width: 250px; height: 150px"; position:"absolute";
                         border-top-left-radius: 8px;
                         border-top-right-radius: 8px;
                         margin-bottom: 4px">`;
    content_html += `<div class='px-2 py-2' style="font-size:14px; 
                            font-weight: 700; 
                            max-width: 250px;
                            word-wrap: break-word;
                            white-space: normal;">
                        ${title}
                    </div>`;

    infoBubble.setPosition(latLng);
    markers[key].addListener("mouseover", function () {
      infoBubble.setContent(content_html);
      infoBubble.open(map, this);
    });

    markers[key].addListener("mouseout", function () {
      infoBubble.close();
    });

    new google.maps.event.addListener(markers[key], "click", function () {
      window.open(path, "_parent");
    });
  }
})();

function getPrice(price) {
  return (price * 1000).toLocaleString("en-US");
}

async function configMap(map) {
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];

  let pages = await fetchData();

  bounds = new google.maps.LatLngBounds();
  for (const key in pages) {
    const page = pages[key];
    const title = page.title_address;
    if (page.path.includes("condos")) image = "img/condo.png";
    else image = "img/townhome.png";
    let position = page.meta_position;
    position = position.split(";");
    position = position.map((x) => Number(x));
    const path = page.path;

    const latLng = new google.maps.LatLng(position[0], position[1]);
    bounds.extend(latLng);

    markers[key] = new google.maps.Marker({
      position: latLng,
      map: map,
      clickable: true,
      icon: image,
    });

    const bg_img_url = `${page.bg_image_url}`;

    let content_html = `<img src=${bg_img_url} onerror="this.style.backgroundColor='#c4c4c4'; this.src='img/camera-slash.svg'; "
                style = "width: 250px; height: 150px"; position:"absolute";
                         border-top-left-radius: 8px;
                         border-top-right-radius: 8px;
                         margin-bottom: 4px">`;
    content_html += `<div class='px-2 py-2' style="font-size:14px; 
                            font-weight: 700; 
                            max-width: 250px;
                            word-wrap: break-word;
                            white-space: normal;">
                        ${title}
                    </div>`;

    infoBubble.setPosition(latLng);
    markers[key].addListener("mouseover", function () {
      infoBubble.setContent(content_html);
      infoBubble.open(map, this);
    });

    markers[key].addListener("mouseout", function () {
      infoBubble.close();
    });

    new google.maps.event.addListener(markers[key], "click", function () {
      window.open(path, "_parent");
    });
  }
  map.fitBounds(bounds);
}
