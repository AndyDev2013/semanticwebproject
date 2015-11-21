var express = require('express');
var fs = require('fs');
var http = require('http');
var PouchDB = require('pouchdb');
var GeoJSON = require('geojson');

// All modules required for this project

var app = express();
var httpServer = http.Server(app);
app.use(express.static(__dirname));

// setting up the app object/http server object

var masterAlldata;
var db;

// The two main variables of this server, the master all data holds
// the database locally and the db variable is the pouch database

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

app.get('/structures', function(req, res) {
	res.sendFile(__dirname + '/original_galwayStructures.html');
});

app.get('/recreation', function(req, res) {
	res.sendFile(__dirname + '/original_galwayRecreation.html');
});

// All of the above routing urls are used to link to the help and data pages on the api site

app.get('/database', function(req, res) {

	var datastuff = [];

	for(var i = 0;i < masterAlldata.length;i++) // Foreach entry in the local version of the database
	{
		var temp = masterAlldata[i].id; // Store each id

		datastuff.push(temp); // Add each id to an object
	}

	res.json(JSON.stringify(datastuff)); // Return the entire object of database ids in json format

	reportConnect(req); // Log the connection in the Node.js administrator console.
});

// Displays one large Json object containing all of the ID's of entries currently in the database

app.get('/GET_originaldata_galway_attactions', function(req, res) {

	res.set('Content-Type', 'text/json'); // Setting the content type
	res.status(200); // Setting the return status
	res.json(JSON.parse(fs.readFileSync('data/Galway_Attractions.geojson')));

	// returning the raw file in the data folder as a json object to display the original data

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

app.get('/GET_originaldata_galway_structures', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);
	res.json(JSON.parse(fs.readFileSync('data/Galway_Structures.geojson')));

	reportConnect(req);
});

app.get('/GET_originaldata_galway_recreationstrat', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);
	res.json(JSON.parse(fs.readFileSync('data/Galway_Recreation.geojson')));

	reportConnect(req);
});

// The above methods return all of the geojson information from the FILES sitting in the data folder.
// This is mainly for referencing the orginal data and shows off the data nicely using google maps api

app.get('/GET_allData', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);
    res.json(JSON.stringify(masterAlldata));   // Return the entire local version of the database as one large json object

    reportConnect(req);
});

// This returns a dump of all of the combined data store in the local copy of the pouch database

app.get('/DELETE_allData', function(req, res) {

	var dbWarning = {"warning_message":"Database HAS been cleared"};
	var dbOtherWarning = {"warning_message":"Database has ALREADY been cleared"};

	// Declaring two warning messages

	if(db != null) // If the database is not null .. then delete it
	{
		db.destroy().then(function () // Deleting the database
		{}).catch(function(err){})

		masterAlldata = null;	// Clearing the variable with the local version of the data
		db = null; // Clearing the database object for pouchdb

		res.status(200).send('OK');
		res.type('json');

		res.json(dbWarning);  // Return the successful warning
	}
	else
		res.json(dbOtherWarning); // Return the unsuccessful warning 

	reportConnect(req);
});

// This lets you delete the pouchdb and clears the local copy of it also

app.get('/POST_addEntry/:name/:category/:street/:lat/:lng', function(req, res)
{
	recordCount(); // Print the current amount of entries before adding an entry (so we know it added later..)

	var geoOb =
	[{
		name : req.params.name,
		category : req.params.category,
		street : req.params.street,
		lat : req.params.lat,
		lng : req.params.lng
	}];

	// Creating a json object using the parameters passed through routing
	
	var geoOb = GeoJSON.parse(geoOb, {Point: ['lat', 'lng']});

	// Using the GeoJSON plugin to create a GeoJSON format entry.

	db.post(geoOb, function(error, result) // Posting the created geojson formatted object to the database
	{
		updateLocalDatabase(); // When the database is updated update the local version of it

		/*
		if(error != null)
			console.log(error);
		else
			console.log(result);
		*/

	})

	reportConnect(req);

	res.json(JSON.stringify(geoOb)); // Print out the geojson version of the object to show its format
});

// This lets you create entries in the pouch database and updates the local copy

app.get('/DELETE_deleteEntry/:id', function(req, res) {

	var dbWarning = {"warning_message":"Entry HAS been deleted"};
	var dbOtherWarning = {"warning_message":"Database has NOT been deleted"};

	// Declaring good and bad warning messages

	db.get(req.params.id).then(function(doc)  // Find the entry in the database using the id passed
	{
	   db.remove(doc);	// if the entry is found remove it
	   updateLocalDatabase(); // Update the local copy of the database
	   res.json(dbWarning); // Return the good warning

	}).catch(function (err) 
	{
  		res.json(dbOtherWarning); // Return the bad warning
	});
});

// Lets you delete an entry from the database and updates the local database provided
// You supply an id that currently exists inside the pouchdb

app.get('/GET_HEAD', function(req, res) {

	var MAX = 10;

	res.set('Content-Type', 'text/json');
	res.status(200);

	var count = masterAlldata.length; // Get the amount of entries in the local version of the database

	var data = []; // Create an array

	if(count > MAX) // If the amount of database entries is greater then 10...
	{
		for(var i = 0;i < MAX;i++) // for 10 entries
		{
			data.push(masterAlldata[i]); // add them to the array
		}
	}
	else // There is less the 10 entries so just print them all...even if its less then 10
	{
		for(var i = 0;i < masterAlldata.length;i++)
		{
			data.push(masterAlldata[i]);
		}
	}

    res.json(JSON.stringify(data)); // Return the 10 of less entries

    reportConnect(req);
});

// Simple call the gets the first 10 entries in the local copy of the database
// If there isn't 10 available it will return the whole dataset upto the first 10 entries

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

// Simple call the gets the last 10 entries in the local copy of the database
// If there isn't 10 available it will return the whole dataset upto the last 10 entries

app.get('/GET_FIRST', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);

	var data = [];

	if(masterAlldata.length > 0) // If at least one entry exists
		data.push(masterAlldata[i]); // Add the one entry	

    res.json(JSON.stringify(data));   // return the one entry

    reportConnect(req);
});

// Simply returns the first database entry

app.get('/GET_LAST', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);

	var data = [];

	if(masterAlldata.length > 0) // If at least one entry exists
		data.push(masterAlldata[masterAlldata.length - 1]);	// Add the last entry	

    res.json(JSON.stringify(data));  // return the one entry   

    reportConnect(req);
});

// Simply returns the last database entry

app.get('/GET_COUNT', function(req, res) {

	res.set('Content-Type', 'text/json');
	res.status(200);

    res.json(JSON.stringify(masterAlldata.length));  // Get the amount of entries stored in the local version of the db and return it

    reportConnect(req);
});

// Returns a count of all of the entries in the local database

app.get('/PATCH_changeEntry/:id/:name/:category/:street/:lat/:lng', function(req, res) 
{
	recordCount();

	var geoOb =
	[{
		id : req.params.id;
		name : req.params.name,
		category : req.params.category,
		street : req.params.street,
		lat : req.params.lat,
		lng : req.params.lng
	}];
	
	// 

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

// This function loads the 5 geojson files from the data folder into the database
// to display the ability to store the geojson data using pouchdb.
// The data is then retrieved for the server to use. 

function InitServer()
{
	console.log("");
	console.log("---------------------------");
	console.log("Initializing node.js Server");
	console.log("---------------------------");

	console.log("Deleting old database if it exists...");

	db = new PouchDB('semantic_pouchDB');

	// Creating/Opening the pouchdb

	db.destroy().then(function () // Deleting any existing version of the database so we have a clean instance
	{
		db = new PouchDB('semantic_pouchDB'); // Creating a fresh database

		console.log("\nReading in data files...");

		var data_Galway_Attra = JSON.parse(fs.readFileSync('data/Galway_Attractions.geojson', 'utf8'));
		var data_Galway_Parks =	JSON.parse(fs.readFileSync('data/Galway_Parks.geojson',       'utf8'));
		var data_Galway_Scene = JSON.parse(fs.readFileSync('data/Galway_Scenic.geojson',      'utf8'));
		var data_Galway_Structures = JSON.parse(fs.readFileSync('data/Galway_Structures.geojson',      'utf8'));
		var data_Galway_Recreation = JSON.parse(fs.readFileSync('data/Galway_Recreation.geojson',      'utf8'));

		// Reading all 5 geojson files into memory

		console.log("-- data/Galway_Attractions.geojson          : Records [" + data_Galway_Attra.features.length + "]");
		console.log("-- data/Galway_Parks.geojson                : Records [" + data_Galway_Parks.features.length + "]");
		console.log("-- data/Galway_Scenic.geojson               : Records [" + data_Galway_Scene.features.length + "]");
		console.log("-- data/Galway_Structures.geojson           : Records [" + data_Galway_Structures.features.length + "]");
		console.log("-- data/Galway_Recreation.geojson           : Records [" + data_Galway_Recreation.features.length + "]");

		// Outputting the amount of entries from each of these files to the administrator console

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

		for (var i = 0; i < data_Galway_Structures.features.length; i++) 
		{
			var temp = /*JSON.stringify*/(data_Galway_Structures.features[i]);

			db.post(temp, function(error, result)
			{
				if(error != null)
					console.log(error);
			})
		}

		for (var i = 0; i < data_Galway_Recreation.features.length; i++) 
		{
			var temp = /*JSON.stringify*/(data_Galway_Recreation.features[i]);

			db.post(temp, function(error, result)
			{
				if(error != null)
					console.log(error);
			})
		}

		// For each of the 5 datafiles stored in memory, parse them entry by entry and add them to the pouchdb

		console.log("-- Commit to database successful");
		
		console.log("\nTesting DB...");

		db.allDocs({include_docs: true}, function(error, result) // Reading the entries as a whole object back from the pouchdb
		{	   
	  		masterAlldata = result.rows; 

	  		// Storing the pouchdb records in a local object

			console.log("-- Data returned: [" + result.rows.length + "]\n");

			// Outputting the amount of entries return from the pouchdb

			for(var i = 0;i < 1;i++)
			{
				var str = JSON.stringify(result.rows[i].doc._id);
				console.log("Sample ID that you can use for Updating/Deleting an entry" + str);
			}

			// Outputting the first entry as a sample for use

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

	}).catch(function(err){ console.log(err);}) // If something bad happens creating/opening the pouchdb
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

// Returns console message for how many entries exist in the pouchdb and the localdb

function reportConnect(req)
{
	console.log("IP: " + req.ip + " ----- Query: " +  req.route.path);
}

// This function is used alot to show what ip connects to the api and what query/route they chose.
// Because this api is stored locally for showcasing and not online anymore the calls will be local
// therefore you should see 127.0.0.1 (loopback) ip as the one making the connections.

function updateLocalDatabase()
{
	db.allDocs({include_docs: true}, function(error, result) 
	{	   
  		masterAlldata = result.rows;

		recordCount();
  	})
}

// Gets all data from the pouchdb and puts it into a local variable for manipulation.