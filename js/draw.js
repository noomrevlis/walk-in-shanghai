/*
 Todo:
 https://www.mapbox.com/mapbox.js/example/v1.0.0/scroll-driven-navigation/
 https://www.mapbox.com/mapbox.js/example/v1.0.0/reorder-listing-based-on-marker-proximity/
 https://www.mapbox.com/mapbox.js/example/v1.0.0/marker-tooltip-tab-groups/
 mustache template
*/

/*
 Reference

 maki icons
 https://www.mapbox.com/maki-icons/

 map events
 http://leafletjs.com/reference-1.0.0.html#map-event

 geojson
 http://geojson.org/geojson-spec.html

 async js
 https://github.com/caolan/async/blob/v1.5.2/README.md

 underscore js
 http://underscorejs.org/#collections

 mustache
 https://github.com/janl/mustache.js

*/


L.mapbox.accessToken = 'pk.eyJ1Ijoibm9vbXJldmxpcyIsImEiOiJjaW91Nm1hem8wMG83dW9tOHoycTdtbnRsIn0.ubjVj1rxUJ9rDVv_xppzHA';
var map = L.mapbox.map('map')
    .setView([31.21, 121.435], 16);

/*
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
    .addTo(map)
    .on('load', finishedLoading);
*/

L.mapbox.tileLayer('mapbox.streets')
    .addTo(map)
    .on('load', finishedLoading);

var markerList = document.getElementById('marker-list');
var isGeoJsonLoaded = false;

function generateNavBar(site, pathData) {
    var item = markerList.appendChild(document.createElement('li'));
    item.innerHTML = site.properties.title;
    var latlng = site.geometry.coordinates;
    var pos = new L.LatLng(latlng[1], latlng[0]);
    var marker = L.marker(pos, {
        icon: L.mapbox.marker.icon(site.properties),
        title: site.properties.title
    });
    marker.bindPopup(site.properties.title);
    var layer = marker.addTo(map);
    var path = L.polyline([]).addTo(map);
    item.onclick = function() {
        map.setView(pos, 16);
        var latlngs = path.getLatLngs()
        // avoid repeat draw path
        if (latlngs.length == 0) {
            var coordinates = pathData.geometry.coordinates;
            var points = 0
            add();
            function add() {
                var entry = coordinates[points]
                path.addLatLng(L.latLng(entry[1], entry[0]));
                if (++points < coordinates.length) window.setTimeout(add, 300);
            }
        }
        layer.openPopup();
    };
};

function generateSpotCluster(spots) {
    var markers = new L.MarkerClusterGroup();
    for (var i = 0; i < spots.length; i++) {
        var spot = spots[i];
        var latlng = spot.geometry.coordinates;
        var marker = L.marker(new L.LatLng(latlng[1], latlng[0]), {
            icon: L.mapbox.marker.icon(spot.properties),
            title: spot.properties.title
        });

        var images = spot.properties.images;
        var slideshowContent = '';
        for(var j = 0; j < images.length; j++) {
            var img = images[j];

            slideshowContent += '<div class="image' + (j === 0 ? ' active' : '') + '">' +
                                    '<img src="' + img[0] + '" />' +
                                    '<div class="caption">' + img[1] + '</div>' +
                                '</div>';
        }

        // Create custom popup content
        var popupContent = '<div id="' + spot.properties.id + '" class="popup">' +
                                '<h2>' + spot.properties.title + '</h2>' +
                                '<div class="slideshow">' +
                                    slideshowContent +
                                '</div>' +
                                '<div class="cycle">' +
                                    '<a href="#" class="prev">&laquo; Previous</a>' +
                                    '<a href="#" class="next">Next &raquo;</a>' +
                                '</div>'
                            '</div>';
        marker.bindPopup(popupContent, {
            closeButton: true,
            minWidth: 320
        });
        markers.addLayer(marker);
        /*
        markers.on('contextmenu', function(e) {
            e.layer.openPopup();
        });
        markers.on('click', function(e) {
            e.layer.closePopup();
        });
        */
    }
    map.addLayer(markers);
};


function processData(error, results) {
    for (var i = 0; i < results.length; i++) {
        var features = results[i].features;
        var spots = [];
        var site, pathData;
        for (var j = 0; j<features.length; j++) {
            var feature = features[j];
            if (feature.type == "Site") {
                site = feature;
            }
            if (feature.type == "Spot") {
                spots.push(feature)
            }
            if (feature.type == "Sign") {
                var latlng = feature.geometry.coordinates;
                var marker = L.marker(new L.LatLng(latlng[1], latlng[0]), {
                    icon: L.mapbox.marker.icon(feature.properties),
                    title: feature.properties.title
                });
                //marker.bindPopup("content");
                marker.addTo(map);
            }
            if (feature.type == "Path") {
                pathData = feature;
            }
        }
        generateNavBar(site, pathData);
        generateSpotCluster(spots);
    }
};

function finishedLoading() {
    if (!isGeoJsonLoaded) {
        (function fetchData() {
            // Todo change getfiles in server side
            var dataFetchers = _.map(['wukangroad.json'], function (fileName) {
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
        isGeoJsonLoaded = true;
    }
};

$('#map').on('click', '.popup .cycle a', function() {
    var $slideshow = $('.slideshow'),
        $newSlide;

    if ($(this).hasClass('prev')) {
        var $newSlide = $slideshow.find('.active').prev();
        if ($newSlide.index() < 0) {
            $newSlide = $('.image').last();
        }
    } else {
        $newSlide = $slideshow.find('.active').next();
        if ($newSlide.index() < 0) {
            $newSlide = $('.image').first();
        }
    }

    $slideshow.find('.active').removeClass('active').hide();
    $newSlide.addClass('active').show();
    return false;
});
