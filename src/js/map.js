function onMapClick(e) {
    console.log(geoposition(e));
}

var Searcher = L.esri.Geocoding.geocodeService().reverse();
function geoposition(e) {
    Searcher.latlng(e.latlng).run(function (error, result) {
        if (error) {
            return "Error";
        }
        window.obtained_map_result = result;
    }, this);
    return window.obtained_map_result.address.ShortLabel;
}

var mymap = L.map('map-picture').setView([50.4547, 30.5238], 12);

var map_picture = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
});

var esri_attribution = L.esri.basemapLayer('Topographic');

mymap.on('click', onMapClick);
map_picture.addTo(mymap);
esri_attribution.addTo(mymap);