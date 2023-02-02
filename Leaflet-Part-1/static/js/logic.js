// Read in GeoJSON for significant earthquakes for last 30 days and store as variable 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Create the map with our layers.
var map = L.map("map", {
    center: [
      37.091, -95.713
    ],
    zoom: 2,
  });

// Initialize all the LayerGroups that we'll use.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// create object for the magnitude
function markerSize(magnitude) {
    return magnitude * 123
  }

// create object for the color 
function circleColor(depth) {
    if (depth <= 70) return '#D4F906'
    else if (depth <= 300) return '#F9A406'
    else return '#F91206'
}

// read in earthquake data 
d3.json(url).then(function(data) {

    // use the geoJson function to draw map
    L.geoJson(data, {

        // passing in mapStyle for styling
        pointToLayer: function (feature, latlng) {

            // style each feature based on conditionals above
            return new L.circleMarker(latlng, {
                radius: 5,
                color: circleColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                weight: 1.2
              });
        },

        // Give each feature a popup that describes the earthquake.
        onEachFeature: function(feature,layer) {
            // add popup for borough and neighborhood
            layer.bindPopup(`<h2>${feature.properties.place}</h2><hr>
            <h3>Magnitude: ${feature.properties.mag}, Depth: ${feature.geometry.coordinates[2]} </h3><hr>
            <p>${new Date(feature.properties.time)}</p>`).addTo(map)
        }
    })
});

// create legend
var legend = L.control({ 
    position: 'bottomright' 
  });

// function to add legend info
legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');

    // create magnitude scale
    var scale = [0,70, 300,];

    // create corresponding color scale 
    var colors = ['#D4F906', '#F9A406', '#F91206'];

    // for loop to match scale and colors 
    for (var i = 0; i < scale.length; i++) {

        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + scale[i] + (scale[i + 1] ? "&ndash;" + scale[i + 1] + "<br>" : "+");
    }

    return div;
  };

//   add legend to map 
  legend.addTo(map);