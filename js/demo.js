var map;
let center = new google.maps.LatLng(43.886483, -78.879618);
var infoWindow = new google.maps.InfoWindow();
let bounds = new google.maps.LatLngBounds();
let zoom = 11;
let search = null;
const list_items = $("#list-items");
let markers = [];

$().ready(function () {
  const _search = $("#search");
  _search.on("keyup", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      search = _search.val();
      if (search == "") search = null;
      initMap();
    }
  });

  const _city = $("#city-filter");
  _city.on("change", function () {
    initMap();
  });

  const _price = $("#price-filter");
  _price.on("change", function () {
    initMap();
  });
});
async function fetchData() {
  let city = $("#city-filter").val();
  let price = $("#price-filter").val();
  let pages = await axios
    .get("https://durhamcondos.ca/Map/api-map.php", {
      params: {
        city: city,
        search: search,
        price: price,
      },
    })
    .then((res) => res.data);
  pages = pages.filter((x) => x.meta_position);
  return pages;
}

async function initMap() {
  markers.forEach((marker) => {
    marker.setMap(null);
    console.log(marker);
  });
  markers = [];

  list_items.empty();

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

  // let city = $("#city-filter").val();
  // switch (city) {
  //   case "pickering":
  //     center = new google.maps.LatLng(43.836155, -79.090002);
  //     zoom = 14;
  //     break;
  //   case "ajax":
  //     center = new google.maps.LatLng(43.841925, -79.027157);
  //     zoom = 13;
  //     break;
  //   case "whitby":
  //     center = new google.maps.LatLng(43.886483, -78.946618);
  //     zoom = 11;
  //     break;
  //   case "oshawa":
  //     center = new google.maps.LatLng(43.904006, -78.863726);
  //     zoom = 12;
  //     break;
  //   case "clarington":
  //     center = new google.maps.LatLng(43.899966, -78.682022);
  //     zoom = 12;
  //     break;
  //   default:
  //     center = new google.maps.LatLng(43.886483, -78.879618);
  //     zoom = 11;
  //     break;
  // }

  var mapOptions = {
    zoom: zoom,
    tilt: 45,
    center: center,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.SATELLITE, "bestfromgoogle"],
    },
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  // map.fitBounds(bounds);

  let name = $("#city-filter option:selected").text();
  if (name.toLowerCase() == "city") name = "Durham Condos";
  var styledMapOptions = {
    name: name.charAt(0).toUpperCase() + name.slice(1),
  };

  var jayzMapType = new google.maps.StyledMapType(stylez, styledMapOptions);

  map.mapTypes.set("bestfromgoogle", jayzMapType);
  map.setMapTypeId("bestfromgoogle");

  bounds = new google.maps.LatLngBounds();
  for (const key in pages) {
    const page = pages[key];
    const title = page.title_address;
    const image = "img/condo.png";
    let position = page.meta_position;
    position = position.split(";");
    position = position.map((x) => Number(x));
    const path = page.path;

    const latLng = new google.maps.LatLng(position[0], position[1]);
    bounds.extend(latLng);

    markers[key] = new google.maps.Marker({
      position: new google.maps.LatLng(position[0], position[1]),
      map: map,
      clickable: true,
      icon: image,
    });

    const bg_img_url = `${page.bg_image_url}`;

    // const item_content = `<div class="col-xs-9 pr-0 pb-4 pt-2">
    //   <div style="font-weight: 700">${page.meta_placename}</div>
    //   <div style="fonnt-weight: 600; color: gray">$${getPrice(
    //     page.fee_from
    //   )} - $${getPrice(page.fee_to)}</div>
    // </div>`;
    // const item_img =
    //   '<div class="col-xs-3 pt-2 px-0">' +
    //   `<img src=${bg_img_url}
    //             width = 50
    //             height = 50
    //             style = "width: 50px; height: 50px"
    //             onerror="if(this.src!='img/default.png') this.src='img/default.png'" >` +
    //   "</div>";

    // const item =
    //   `<div class='col-xs-12 pr-0 card' id="item-${page.id}" style='border-bottom: thin solid rgba(0,0,0,.12)!important;'>` +
    //   item_content +
    //   item_img +
    //   "</div>";
    // list_items.append(item);

    let content_html = `<img src=${bg_img_url} onerror="this.style.backgroundColor='#c4c4c4'; this.src='img/camera-slash.svg'; "
                style = "width: 250px; height: 150px"; position:"absolute";
                         border-top-left-radius: 8px;
                         border-top-right-radius: 8px;
                         margin-bottom: 4px">`;
    // content_html += `<div style="background-color: gray; width: 250px; height: 150px">
    // <i class="fa fa-camera-slash"></i>
    // </div>`;
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
      `<div class='px-2' style="font-size:14px; max-width: 250px; word-wrap: break-word;"><span style='color: gray'>Fee:</span> $${getPrice(
        page.fee_from
      )} - $${getPrice(page.fee_to)}</div>`;
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

    // const item_detail = document.getElementById(`item-${page.id}`);
    // item_detail.addEventListener("mouseover", function () {
    //   infoBubble.open(map, markers[key]);
    // });
    // item_detail.addEventListener("mouseout", function () {
    //   infoBubble.close();
    // });
  }

  map.fitBounds(bounds);
}

initMap();

function getPrice(price) {
  return (price * 1000).toLocaleString("en-US");
}
