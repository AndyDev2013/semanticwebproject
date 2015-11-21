// 29/10/2015 
// Custom Javascript to display
// GoogleMaps geolocations
// Written by Andrew Sweeney for 4th Year Semantic Web

function Galway_Scenic()
{
	var map;

	map = new google.maps.Map(document.getElementById('googlemap'), {
		center: {lat: 53.270668, lng: -9.056790500000034},
		zoom: 10
	});

	map.data.loadGeoJson('data/Galway_Scenic.geojson');
}

function Galway_Attractions()
{
	var map;

	map = new google.maps.Map(document.getElementById('googlemap'), {
		center: {lat: 53.270668, lng: -9.056790500000034},
		zoom: 10
	});

	map.data.loadGeoJson('data/Galway_Attractions.geojson');
}

function Galway_Parks()
{
	var map;

	map = new google.maps.Map(document.getElementById('googlemap'), {
		center: {lat: 53.270668, lng: -9.056790500000034},
		zoom: 10
	});

	map.data.loadGeoJson('data/Galway_Parks.geojson');
}

function Galway_Structures()
{
	var map;

	map = new google.maps.Map(document.getElementById('googlemap'), {
		center: {lat: 53.270668, lng: -9.056790500000034},
		zoom: 10
	});

	map.data.loadGeoJson('data/Galway_Structures.geojson');
}

function Galway_Recreation()
{
	var map;

	map = new google.maps.Map(document.getElementById('googlemap'), {
		center: {lat: 53.270668, lng: -9.056790500000034},
		zoom: 10
	});

	map.data.loadGeoJson('data/Galway_Recreation.geojson');
}