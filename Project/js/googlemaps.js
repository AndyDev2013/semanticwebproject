// 29/10/2015 
// Custom Javascript to display
// GoogleMaps geolocations
// Written by Andrew Sweeney for 4th Year Semantic Web

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('googlemap'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

