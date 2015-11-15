var express = require('express');
var fs = require('fs');
var http = require('http');
var PouchDB = require('pouchdb');

var app = express();
var httpServer = http.Server(app);
app.use(express.static(__dirname));

// Initizing server

InitServer();

// My init method for setting up the db

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.get('/todo', function(req, res) {
    res.json(todos);   
});

app.get('/todo/:id', function(req, res) {
    res.json(todos[req.params.id]);   
});


// Server Listening on port 8000

var server = app.listen(8000);

function InitServer()
{
	console.log("");
	console.log("---------------------------");
	console.log("Initializing node.js Server");
	console.log("---------------------------");

	var db = new PouchDB('semantic_pouchDB');
	
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
		console.log("-- Data returned: [" + result.rows.length + "]");

		/*
		for (var i = 0; i < result.rows.length; i++)
		{
			var str = JSON.stringify(result.rows[i].doc._id);
			console.log(str);		
		}
		*/
  	
		console.log("\n-----------------------");
		console.log("Queries and connections");
		console.log("-----------------------\n");
  	});
}

