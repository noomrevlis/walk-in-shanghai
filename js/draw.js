// Todo:

// marker with slideshow https://www.mapbox.com/mapbox.js/example/v1.0.0/markers-with-image-slideshow/
// marker hover effective https://www.mapbox.com/mapbox.js/example/v1.0.0/show-tooltips-on-hover/
// geojson file structure, set a filter of different marker

L.mapbox.accessToken = 'pk.eyJ1Ijoibm9vbXJldmxpcyIsImEiOiJjaW91Nm1hem8wMG83dW9tOHoycTdtbnRsIn0.ubjVj1rxUJ9rDVv_xppzHA';
var map = L.mapbox.map('map')
    .setView([31.21, 121.435], 16);

// use openstreet tile layer
/*
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
    .addTo(map)
    .on('load', finishedLoading);
*/

// use mapbox.streets
L.mapbox.tileLayer('mapbox.streets')
    .addTo(map)
    .on('load', finishedLoading);

// Todo: support load paths
var path = L.polyline([]).addTo(map);

function finishedLoading() {
    // avoid redraw ployline when zooming map
    var latlngs = path.getLatLngs();
    if (latlngs.length == 0) {
        var processData = function (error, results) {
            // Start drawing the path.
            var paths = results[0].features;
            var coordinates = paths[0].geometry.coordinates;
            var points = 0
            add();
            function add() {
                var entry = coordinates[points]
                path.addLatLng(L.latLng(entry[1], entry[0]));
                if (++points < coordinates.length) window.setTimeout(add, 300);
            }

            // start drawing the markers
            var spots = results[1].features;
            var markers = new L.MarkerClusterGroup();

            for (var i = 0; i < spots.length; i++) {
                var spot = spots[i];
                var latlng = spot.geometry.coordinates;
                var marker = L.marker(new L.LatLng(latlng[1], latlng[0]), {
                    icon: L.mapbox.marker.icon(spot.properties),
                    title: spot.properties.title
                });
                marker.bindPopup(spot.properties.description);
                markers.addLayer(marker);
            }
            map.addLayer(markers);
        };

        (function fetchData() {
            var dataFetchers = _(['paths.json', 'markers.json']).map(function (fileName) {
                return function (callback) {
                $.getJSON('data/' + fileName, function (data) {
                    callback(null, data);
                });
                };
            });
            async.parallel(dataFetchers, processData);
        }());

        var coordinates = document.getElementById('coordinates');
        var marker = L.marker([31.210947924347657,121.43598318099974], {
            icon: L.mapbox.marker.icon({'marker-color': '#f86767'}),
            title: "locator",
            draggable: true
        });
        marker.bindPopup("定位器，用来查找坐标");
        marker.addTo(map);

        // every time the marker is dragged, update the coordinates container
        marker.on('dragend', ondragend);
        // Set the initial marker coordinate on load.
        ondragend();
        function ondragend() {
            var m = marker.getLatLng();
            coordinates.innerHTML = 'Latitude: ' + m.lat + '<br />Longitude: ' + m.lng;
        }
    }

}

