var express = require('express');
var fs = require('fs');
var http = require('http');
var PouchDB = require('pouchdb');

var app = express();
var httpServer = http.Server(app);
app.use(express.static(__dirname));

var masterAlldata;
var db;

// Initizing server

InitServer();

// My init method for setting up the db

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

// Original Data

app.get('/GET_originaldata_galway_attactions', function(req, res) {
	res.json(JSON.parse(fs.readFileSync('data/Galway_Attractions.geojson')));
});

app.get('/GET_originaldata_galway_parks', function(req, res) {
	res.json(JSON.parse(fs.readFileSync('data/Galway_Parks.geojson')));
});

app.get('/GET_originaldata_galway_scenic', function(req, res) {
	res.json(JSON.parse(fs.readFileSync('data/Galway_Scenic.geojson')));
});

// API Methods

app.get('/GET_allData', function(req, res) {
    res.json(JSON.stringify(masterAlldata));   
});

app.get('/DELETE_allData', function(req, res) {

	var dbWarning = {"warning_message":"Database HAS been cleared"};
	var dbOtherWarning = {"warning_message":"Database has ALREADY been cleared"};

	if(db != null)
	{
		db.destroy().then(function ()
		{}).catch(function(err){})

		masterAlldata = null;
		db = null;

		res.json(dbWarning);  
	}
	else
		res.json(dbOtherWarning);  
});

/*
app.get('/todo/:id', function(req, res) {
    res.json(todos[req.params.id]);   
});
*/

// Server Listening on port 8000

var server = app.listen(8000);

// This function loads the 3 files into the database
// to display the ability to store the geojson data
// using pouchdb. The data is then retrieved for the
// server to use. 

function InitServer()
{
	console.log("");
	console.log("---------------------------");
	console.log("Initializing node.js Server");
	console.log("---------------------------");

	db = new PouchDB('semantic_pouchDB');
	
	console.log("\nReading in data files...");

	var data_Galway_Attra = JSON.parse(fs.readFileSync('data/Galway_Attractions.geojson', 'utf8'));
	var data_Galway_Parks =	JSON.parse(fs.readFileSync('data/Galway_Parks.geojson',       'utf8'));
	var data_Galway_Scene = JSON.parse(fs.readFileSync('data/Galway_Scenic.geojson',      'utf8'));

	console.log("-- data/Galway_Attractions.geojson : Records [" + data_Galway_Attra.features.length + "]");
	console.log("-- data/Galway_Parks.geojson       : Records [" + data_Galway_Parks.features.length + "]");
	console.log("-- data/Galway_Scenic.geojson      : Records [" + data_Galway_Scene.features.length + "]");

	console.log("\nCommitting files to database...");

	for (var i = 0; i < data_Galway_Attra.features.length; i++) 
	{
		var temp = JSON.stringify(data_Galway_Attra.features[i]);

		db.post(temp, function(error, result){})
	}

	for (var i = 0; i < data_Galway_Parks.features.length; i++) 
	{
		var temp = JSON.stringify(data_Galway_Parks.features[i]);

		db.post(temp, function(error, result){})
	}

	for (var i = 0; i < data_Galway_Scene.features.length; i++) 
	{
		var temp = JSON.stringify(data_Galway_Scene.features[i]);

		db.post(temp, function(error, result){})
	}

	console.log("-- Commit to database successful");
	
	console.log("\nTesting DB...");

	db.allDocs({include_docs: true}, function(error, result) 
	{	   
  		masterAlldata = result.rows;

		console.log("-- Data returned: [" + result.rows.length + "]");

		/*
		for (var i = 0; i < result.rows.length; i++)
		{
			var str = JSON.stringify(result.rows[i].doc._id);
			console.log(str);		
		}

		// Used for debugging and checking data

		*/
  	
		console.log("\n-----------------------");
		console.log("Queries and connections");
		console.log("-----------------------\n");
  	});


}

