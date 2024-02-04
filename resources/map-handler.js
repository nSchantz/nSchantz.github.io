  // Initialize Leaflet Map
  function init_map() {
    /* Display basemap tiles -- see others at https://leaflet-extras.github.io/leaflet-providers/preview/ */
    var baseLayer = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        ext: 'png'
    });

    /* Set up the initial map center and zoom level */
    var map = L.map('map', {
      center: [37.090240, -95.712891],
      zoom: 4,
      scrollWheelZoom: true,
      layers: [baseLayer]
    });

    return [map, baseLayer];
  }

  // Return icon depending on tag and file type
  function get_icon(tag, type) {
    var iurl = "/resources/icons/camera-black.svg";

    if (tag === "2023-Cross-Country-Trip") {
      if (type === "image") {
        iurl = "/resources/icons/camera-black.svg";
      } else if (type === "video") {
        iurl = "/resources/icons/video-black.svg";
      }
    } else if (tag === "2024-Iceland-Trip") {
      if (type === "image") {
        iurl = "/resources/icons/camera-blue.svg";
      } else if (type === "video") {
        iurl = "/resources/icons/video-blue.svg";
      }
    }

    var icon = L.icon({
      iconUrl: iurl,
      iconSize: [54, 54]
    });

    return icon;
  }

  // Initialize Leaflet Map
  function init_map_data(map, type, json, layerControl) {
    var popupOptions =
    {
      'maxWidth': 600,
      'width': 300,
      'className': 'popup',
      'autoPan': false
    }

    // Add Markers to Layers
    var markerGroup = [];
    for (const marker of json.markers) {
      if (type === "video") {
        var popupData = `Trip: ${marker.tag}<br>\
                         Estimated Position: [${marker.lat}, ${marker.long}]`;
        var popupVideo = `<iframe allowfullscreen width="600" height="450"\
                            src="${marker.url}">\
                          </iframe>`
        var popupId   = `ID: ${marker.id}`
        var popup = popupData + '<br>' + popupVideo + '<br>' + popupId;

        var currMarker = L.marker([marker.lat, marker.long], {icon: get_icon(marker.tag, type)}).bindPopup(popup, popupOptions);
        markerGroup.push(currMarker);
      } else if (type === "image") {
        var popupData = `Trip: ${marker.tag}<br>\
                         Exact Position: [${marker.lat}, ${marker.long}] `;
        var popupImg  = `<a href="${marker.url}">\
                         <img width="600" height="450"\
                            src="${marker.url}">\
                         </img>
                         </a>`
        var popupId   = `ID: ${marker.id}`
        var popup = popupData + '<br>' + popupImg + '<br>' + popupId;

        var currMarker = L.marker([marker.lat, (marker.long * -1)], {icon: get_icon(marker.tag, type)}).bindPopup(popup, popupOptions);
        markerGroup.push(currMarker);
      }
    }

    // Add groups of videos/images to respective layer group.
    var layer = L.layerGroup(markerGroup);

    // Add this group as an overlay to layer control.
    layerControl.addOverlay(layer, type);

    // Add the layer to the map so it defaults on when loading the page.
    layer.addTo(map)
  }

  // Create map
  var [map, baseLayer] = init_map()

  // Add base layer (Map)
  var baseLayers = {
    "Map": baseLayer
  };

  // Setup layer control
  var layerControl = L.control.layers(baseLayers).addTo(map);

  // Get Images from map-img.json
  fetch('/resources/map-img.json')
    .then((response) => response.json())
    .then((json) => init_map_data(map, "image", json, layerControl));

  // Get Videos from map-vid.json
  fetch('/resources/map-vid.json')
    .then((response) => response.json())
    .then((json) => init_map_data(map, "video", json, layerControl));
