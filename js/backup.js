var map;
let center = new google.maps.LatLng(43.886483, -78.879618);
var infoWindow = new google.maps.InfoWindow();
let bounds = new google.maps.LatLngBounds();
let zoom = 11;
let search = null;

const _pickering = document.getElementById("pickering");
const _ajax = document.getElementById("ajax");
const _whitby = document.getElementById("whitby");
const _oshawa = document.getElementById("oshawa");
const _clarington = document.getElementById("clarington");
const _durham = document.getElementById("durham");

const arrToggleList = [
  _pickering,
  _ajax,
  _whitby,
  _oshawa,
  _clarington,
  _durham,
];

$().ready(function () {
  const _search = $("#search");
  _search.on("keyup", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      search = _search.val();
      if (search == "") search = null;
      initMap();
    }
  });
});
async function fetchData() {
  let filter = $(".filter-item.active")[0].id;
  if (filter.includes("durham")) filter = null;
  let pages = await axios
    .get("https://durhamcondos.ca/Map/api-map.php", {
      params: {
        city: filter,
        search: search,
      },
    })
    .then((res) => res.data);
  pages = pages.filter((x) => x.meta_position);
  return pages;
}

let markers = [];

async function initMap() {
  let pages = await fetchData();

  markers.forEach((marker) => {
    marker.setMap(null);
  });

  markers = [];

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

  let name = $(".filter-item.active")[0].id;

  var styledMapOptions = {
    name: name.charAt(0).toUpperCase() + name.slice(1) + " Condos",
  };

  var jayzMapType = new google.maps.StyledMapType(stylez, styledMapOptions);

  map.mapTypes.set("bestfromgoogle", jayzMapType);
  map.setMapTypeId("bestfromgoogle");

  for (const key in pages) {
    page = pages[key];
    const title = page.title_address;
    const image = "img/condo.png";
    let position = page.meta_position;
    position = position.split(";");
    position = position.map((x) => Number(x));
    const path = page.path;

    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(position[0], position[1]),
      map: map,
      // title: title,
      clickable: true,
      icon: image,
    });

    markers.push(marker);

    const bg_img_url = `${page.bg_image_url}`;

    let content_html = `<img src=${bg_img_url}
                width = 250
                style = "width: 250px; height: 150px;
                         border-top-left-radius: 8px;
                         border-top-right-radius: 8px;
                         margin-bottom: 4px">`;

    content_html +=
      // `<div class='px-2' style="font-size:12px; max-width: 250px; word-wrap: break-word;">${page.title}</div>` +
      `<div class='px-2 pt-4' style="font-size:14px; font-weight:700; max-width: 250px; word-wrap: break-word;"><span style='font-weight: 400; color: gray'>Address:</span> ${title}</div>` +
      `<div class='px-2' style="font-size:14px; max-width: 250px; word-wrap: break-word;"><span style='color: gray'>Buiding name:</span> ${page.building_name}</div>` +
      `<div class='px-2' style="font-size:14px; max-width: 250px; word-wrap: break-word;"><span style='color: gray'>Built:</span> ${page.built_years}</div>` +
      `<div class='px-2' style="font-size:14px; max-width: 250px; word-wrap: break-word;"><span style='color: gray'>Floors:</span> ${page.floors}</div>` +
      // `<div class='px-2' style="font-size:14px; max-width: 250px; word-wrap: break-word;"><span style='color: gray'>Including garden:</span> ${
      //   page.is_garden_included == 0 ? "no" : "yes"
      // }</div>` +
      // `<div class='px-2' style="font-size:14px; max-width: 250px; word-wrap: break-word;"><span style='color: gray'>Including heating:</span> ${
      //   page.is_heating_included == 0 ? "no" : "yes"
      // }</div>` +
      `<div class='px-2' style="font-size:14px; max-width: 250px; word-wrap: break-word;"><span style='color: gray'>Pets permitted:</span> ${
        page.is_pets_permitted == 0 ? "no" : "yes"
      }</div>` +
      `<div class='px-2' style="font-size:14px; max-width: 250px; word-wrap: break-word;"><span style='color: gray'>Fee:</span> $${page.fee_from} - $${page.fee_to}</div>`;
    // "<div style='height: 4px'></div>";

    let infoBubble = new InfoBubble({
      map: map,
      content: content_html,
      position: new google.maps.LatLng(-35, 151),
      shadowStyle: 1,
      backgroundColor: "#fff",
      borderRadius: 8,
      borderWidth: 0,
      borderColor: "#2c2c2c",
      disableAutoPan: true,
      hideCloseButton: true,
      minWidth: 250,
      maxWidth: 250,
      // minHeight: 175,
      padding: 0,
      zIndex: 1,
      disableAnimation: true,
    });

    markers[key].addListener("mouseover", function () {
      infoBubble.open(map, this);
    });

    markers[key].addListener("mouseout", function () {
      infoBubble.close();
    });

    new google.maps.event.addListener(markers[key], "click", function () {
      window.open(path, "_parent");
    });
  }
}

initMap();

arrToggleList.forEach((el) => {
  el.addEventListener("click", toggleFilter);
});

async function toggleFilter(event) {
  arrToggleList.forEach((item) => {
    item.classList.remove("active");
  });
  event.currentTarget.classList.add("active");
  const city = $(".filter-item.active")[0].id;
  let title_content = $("#title-content");
  switch (city) {
    case "durham":
      center = new google.maps.LatLng(43.886483, -78.879618);
      zoom = 11;
      title_content.html("Condos in Durham Region");
      break;
    case "pickering":
      center = new google.maps.LatLng(43.836155, -79.090002);
      zoom = 14;
      title_content.html("Condos in Pickering, Ontario");
      break;
    case "ajax":
      center = new google.maps.LatLng(43.841925, -79.027157);
      zoom = 13;
      title_content.html("Condos in Ajax, Ontario");
      break;
    case "whitby":
      center = new google.maps.LatLng(43.886483, -78.946618);
      zoom = 11;
      title_content.html("Condos in Whitby and Brooklin, Ontario");
      break;
    case "oshawa":
      center = new google.maps.LatLng(43.904006, -78.863726);
      zoom = 12;
      title_content.html("Condos in Oshawa, Ontario");
      break;
    case "clarington":
      center = new google.maps.LatLng(43.899966, -78.682022);
      zoom = 12;
      title_content.html(
        "Condos in Courtice, Bowmanville and Newcastle, Ontario"
      );
      break;
    default:
      break;
  }
  bounds = new google.maps.LatLngBounds();
  initMap();
}

const _btn = $("#hehe").on("click", test);

function test() {
  console.log(1);
  markers.forEach((marker) => {
    marker.setMap(null);
  });
}
