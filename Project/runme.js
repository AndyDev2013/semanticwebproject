var express = require('express');
var fs = require('fs');
var http = require('http');
var PouchDB = require('pouchdb');
var GeoJSON = require('geojson');

var app = express();
var httpServer = http.Server(app);
app.use(express.static(__dirname));

var masterAlldata;
var db;

// Initizing server

InitServer();

// My init method for setting up the db

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/attractions', function(req, res) {
	res.sendFile(__dirname + '/original_galwayAttactions.html');
});

app.get('/parks', function(req, res) {
	res.sendFile(__dirname + '/original_galwayParks.html');
});

app.get('/scenic', function(req, res) {
	res.sendFile(__dirname + '/original_galwayScenic.html');
});

app.get('/database', function(req, res) {

	var datastuff = [];

	for(var i = 0;i < masterAlldata.length;i++)
	{
		var temp = masterAlldata[i].id;

		datastuff.push(temp);
	}

	res.json(JSON.stringify(datastuff));

});

// Original Data

app.get('/GET_originaldata_galway_attactions', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);
	res.json(JSON.parse(fs.readFileSync('data/Galway_Attractions.geojson')));

	reportConnect(req);
});

app.get('/GET_originaldata_galway_parks', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);
	res.json(JSON.parse(fs.readFileSync('data/Galway_Parks.geojson')));

	reportConnect(req);
});

app.get('/GET_originaldata_galway_scenic', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);
	res.json(JSON.parse(fs.readFileSync('data/Galway_Scenic.geojson')));

	reportConnect(req);
});

// API Methods

app.get('/GET_allData', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);
    res.json(JSON.stringify(masterAlldata));   

    reportConnect(req);
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

		res.status(200).send('OK');
		res.type('json');

		res.json(dbWarning);  
	}
	else
		res.json(dbOtherWarning);  

	reportConnect(req);
});

app.get('/POST_addEntry/:name/:category/:street/:lat/:lng', function(req, res) 
{
	recordCount();

	var geoOb =
	[{
		name : req.params.name,
		category : req.params.category,
		street : req.params.street,
		lat : req.params.lat,
		lng : req.params.lng
	}];
	
	var geoOb = GeoJSON.parse(geoOb, {Point: ['lat', 'lng']});

	db.post(geoOb, function(error, result)
	{
		updateLocalDatabase();

		/*
		if(error != null)
			console.log(error);
		else
			console.log(result);
		*/

	})

	reportConnect(req);

	res.json(JSON.stringify(geoOb));
});

app.get('/DELETE_deleteEntry/:id', function(req, res) {

	var dbWarning = {"warning_message":"Entry HAS been deleted"};
	var dbOtherWarning = {"warning_message":"Database has NOT been deleted"};

	db.get(req.params.id).then(function(doc) 
	{
	   db.remove(doc);
	   updateLocalDatabase();
	   res.json(dbWarning);  

	}).catch(function (err) 
	{
  		res.json(dbOtherWarning);
	});
});

app.get('/GET_HEAD', function(req, res) {

	var MAX = 10;

	res.set('Content-Type', 'text/json');
	res.status(200);

	var count = masterAlldata.length;

	var data = [];

	if(count > MAX)
	{
		for(var i = 0;i < MAX;i++)
		{
			data.push(masterAlldata[i]);
		}
	}
	else
	{

		for(var i = 0;i < masterAlldata.length;i++)
		{
			data.push(masterAlldata[i]);
		}
	}

    res.json(JSON.stringify(data));   

    reportConnect(req);
});

app.get('/GET_TAIL', function(req, res) {

	var MAX = 10;

	res.set('Content-Type', 'text/json');
	res.status(200);

	var count = masterAlldata.length;

	var data = [];

	if(count > MAX)
	{
		for(var i = count;i >= (count-MAX);i--)
		{
			data.push(masterAlldata[i]);
		}
	}
	else
	{

		for(var i = 0;i < masterAlldata.length;i++)
		{
			data.push(masterAlldata[i]);
		}
	}

    res.json(JSON.stringify(data));   

    reportConnect(req);
});

app.get('/GET_FIRST', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);

	var data = [];

	if(masterAlldata.length > 0)
		data.push(masterAlldata[i]);		

    res.json(JSON.stringify(data));   

    reportConnect(req);
});

app.get('/GET_LAST', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);

	var data = [];

	if(masterAlldata.length > 0)
		data.push(masterAlldata[masterAlldata.length - 1]);		

    res.json(JSON.stringify(data));   

    reportConnect(req);
});

app.get('/GET_COUNT', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);

    res.json(JSON.stringify(masterAlldata.length));   

    reportConnect(req);
});

app.get('/PATCH_changeEntry/:id/:name/:category/:street/:lat/:lng', function(req, res) 
{
	recordCount();

	var geoOb =
	[{
		name : req.params.name,
		category : req.params.category,
		street : req.params.street,
		lat : req.params.lat,
		lng : req.params.lng
	}];
	
	var geoOb = GeoJSON.parse(geoOb, {Point: ['lat', 'lng']});

	db.post(geoOb, function(error, result)
	{
		updateLocalDatabase();

		/*
		if(error != null)
			console.log(error);
		else
			console.log(result);
		*/

	})

	reportConnect(req);

	res.json(JSON.stringify(geoOb));
});

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

	console.log("Deleting old database if it exists...");

	db = new PouchDB('semantic_pouchDB');

	db.destroy().then(function ()
	{
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
			var temp = /*JSON.stringify*/(data_Galway_Attra.features[i]);

			db.post(temp, function(error, result)
			{
				if(error != null)
					console.log(error);
			})
		}

		for (var i = 0; i < data_Galway_Parks.features.length; i++) 
		{
			var temp = /*JSON.stringify*/(data_Galway_Parks.features[i]);

			db.post(temp, function(error, result)
			{
				if(error != null)
					console.log(error);
			})
		}

		for (var i = 0; i < data_Galway_Scene.features.length; i++) 
		{
			var temp = /*JSON.stringify*/(data_Galway_Scene.features[i]);

			db.post(temp, function(error, result)
			{
				if(error != null)
					console.log(error);
			})
		}

		console.log("-- Commit to database successful");
		
		console.log("\nTesting DB...");

		db.allDocs({include_docs: true}, function(error, result) 
		{	   
	  		masterAlldata = result.rows;

			console.log("-- Data returned: [" + result.rows.length + "]\n");

			for(var i = 0;i < 1;i++)
			{
				var str = JSON.stringify(result.rows[i].doc._id);
				console.log(str);
			}

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

	}).catch(function(err){})	
}

function recordCount()
{
	db.allDocs({include_docs: true}, function(error, result) 
	{	   
		console.log();
		if(result.rows.length != null)
  		console.log("Database count: " + result.rows.length);
  		if(masterAlldata != null)
  		console.log("LocalData count: " + masterAlldata.length);
  	});
}

function reportConnect(req)
{
	console.log("IP: " + req.ip + " ----- Query: " +  req.route.path);
}

function updateLocalDatabase()
{
	db.allDocs({include_docs: true}, function(error, result) 
	{	   
  		masterAlldata = result.rows;

		recordCount();
  	})
}