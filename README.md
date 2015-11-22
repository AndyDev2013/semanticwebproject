# semanticwebproject

Semantic Web Project for Year 4 of Software Development in GMIT by Andrew Sweeney

![Screenshot](http://puu.sh/lutuj/505553cf32.png)

# Contents

## The Project

* Project Outline
* Choosen Datasets
* Integration plan
* Things that changed and reflection

## Installation and Use

* Installation and About the code
* Api Use
* Summary
* References

# The Project

# Project Outline

The project was assigned as part of the Semantic Web Module for Dr Ian Mc'Loughlin in GMIT. This is a fourth year project showcasing use of Node.js, Javascript, Googlemaps and HTML skills.

I chose to focus this project on the Galway county and use datasets relating to possible tourist activities. My aim was to highlight the areas in Galway that could potentially be used to create excursions and other touristic activites. This is why I chose to deal specifically with geojson data.

* Create a GitHub repo (this one) with Readme file using MarkDown format. 
* Find two open datasets,describe the datasets, their use and upload them to the repo for reference.
* Create a set of urls for querying these data sets, make sure to account for the type of actions that will be carried out on this dataset, enable http requests other then GET and document all of this.
* Decide on the best way to store the information (what kind of database)
* Describe each function of the api and the type of data returned.
* Comment on all of the code clearly

# Chosen Datasets

Choosing from both of these datasets 

* [DataGov Link](https://data.gov.ie/data)
* [CSO](http://www.cso.ie/)

After checking over them all I decided to use the following three datasets

* [Galway County Scenic Routes](https://data.gov.ie/dataset/galway-county-scenic-routesf5940)
* [Public Visitor Attractions Open Data](https://data.gov.ie/dataset/galway-city-public-visitor-attractions)
* [Galway City Parks](http://opendata.galwaycity.opendata.arcgis.com/datasets/683ff500430447c985f4775a6b5dd112_0)
* [Galway Structures](http://opendata.galwaycity.opendata.arcgis.com/datasets/5aeadf7112614f11b712734f9f47dab6_0.geojson)
* [Recreation Data](http://data.galwaycoco.opendata.arcgis.com/datasets/35907ebb169c4ce8960fc4731c3d16ff_0.geojson)

The goal of combining these three datasets is to point out if public visitor attractions and Galway parks are close to each other. This kind of information can be used for

* Creating walking tours
* Creating bus tours around galway
* Guiding the flow of tourists through the cities

# Integration Plan

I plan on developing the api using Node.JS using the chosen data sets. To give the user a quick way of accessing all of the functions I'm adding to the API I wish to develop a webpage using a prebuilt bootstrap template but heavily editing it for my needs. 

Seeing the project will be using Node.js and be heavily reliant on Javascript I have chosen the Google Maps API for representing the data. Google Maps will let me overlay the GeoJSON polygon shape information on top of the map.

All of this information will be stored in an Sqlite3 database to store all of the information required for the API.

The user should be able to 

* View the different contrasts between the three datasets
* View information about the highlighted areas on the map
* Return json information on a selected area defined by the user
* Add their own points of interest

# Things that changed and reflection

After playing around with alot of different databases that Node.js could be implemented with I soon found Sqlite3 not to be ideal for what I was doing and pouchdb would be the better. It was easier to store geojson in pouchdb. There was very few geojson datasets out there for Galway so I took all that I could relating to tourism and ended up with the 5 mentioned. This resulted in a small dataset and this was another big reason for choosing pouchdb. 

# Installation and Use

For any missing or required please run the command

```npm install```

in the appropriate folder location.

To start the Node.js server run the command

```node runme```

runme.js is responsible for all of the function the application.

In the command console after running these commands you should see something like this

![Console Screenshot](http://puu.sh/luuwq/5e8c218155.png)

The most important scripts to this project are the 

* js/runme.js (Responsible for running the server and all of the routing and information handling)
* js/googlemaps.js (Responsible for displaying googlemaps on every page)
* package.json (Responsible for installing all of the dependencies)
* data/* (Holds a local copy of all of the geojson data)
* css/custom.css (Responsible for some of the minor custom styling)

# Api Use

Once you start the server open up your browser and enter ```http://127.0.0.1:8000/``` into the url bar.
This will navigate you to the API help and information page where you can view the browse to

* Sample url requests
* See the original geojson information on a custom googlemap
* View all of the current ids from records currently stored in the pouchdb database

Please note if you delete the database and local copy of it by using the api make sure that you restart the server to create the instance of the database and server again other wise you won't have anything return to you other then this error message.

[Warning] If you've deleted the database using the API you'll recieve the following json object message

```
"{\"message\":\"No database exists, you may have called the delete api function. Please reboot the server to rebuild the server.\"}"
```

If you wish to delete a data entry or update a data entry you will require either or both the 

* ID
* REV 

To get these check the administrator console where the ID and REV for the first entry is printed out. 
(See the screenshot above of the administrator console)

| Request        | Description           | Example  | Example Parameters |
| ------------- |:-------------:| -----:| -----:|
|GET| Get the original Galway Attractions Data from FILE  | /GET_originaldata_galway_attractions | None |
|GET| Get the original Galway parks Data from FILE | /GET_originaldata_galway_parks | None |
|GET| Get the original Galway scenic Data from FILE | /GET_originaldata_galway_scenic  | None |
|GET| Get the original Galway structures Data from FILE | /GET_originaldata_galway_structures  | None |
|GET| Get the original Galway recreation strategy Data from FILE | /GET_originaldata_galway_recreationstrat | None |
|GET| All geojson data entries from database | /GET_allData  | None |
|DELETE| Clears the entire database. You will have to restart the server again to re-populate the pouchdb | /DELETE_allData  | None |
|GET| All a count of all entries currently in the database | /GET_COUNT | None |
|POST| Add an entry to the database | /POST_addEntry | /myname/category/mystreet/5000/900 | 
|DELETE| Deletes an entry given the id | /DELETE_deleteEntry | /0 |
|GET| All the FIRST entry in the database | /GET_FIRST | None |
|GET| All LAST entry in the database | /GET_FIRST | None |
|GET| All FIRST available 10 entries in the database | /GET_HEAD| None |
|GET| All LAST available 10 entries in the database | /GET_TAIL | None |
|PATCH| Change a record in the database by a given id |  /PATCH_changeEntry | /012345/FFFF-FFFF-FFFF-FFFF/myname/category/mystreet/5000/900 |

A sample of the geojson data that's returned for one type of record.

```
"[{\"id\":\"0073DDBD-63FE-EC9D-8CE2-7F181E9448A5\",\"key\":\"0073DDBD-63FE-EC9D-8CE2-7F181E9448A5\",\"value\":{\"rev\":\"1-68a9dab891c9ce2307841523b0cf0aff\"},\"doc\":{\"type\":\"Feature\",\"properties\":{\"FID\":45,\"Category\":\"K3\",\"Ref\":\"RN23\",\"name\":\"Carrick-on-Shannon Rowing Club\",\"descriptio\":\"Kayaking Club\",\"long\":\"-8.096004\",\"lat\":\"53.944486\",\"Email\":\"carrickrc@gmail.com\",\"Web\":\"www.carrickrc.com\",\"Phone\":\"086 8377868\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[-8.096004,53.944486]},\"_id\":\"0073DDBD-63FE-EC9D-8CE2-7F181E9448A5\",\"_rev\":\"1-68a9dab891c9ce2307841523b0cf0aff\"}}]"
```

A sample of the count data returned 

``` "{\"count\":0}" ```

# Extending the Api

If you wish to extend the api please do so in the section marked "Extended API". Around ```Line 440```

Here is a sample of the basic type of request you can do to return data given NO passed parameters

``` 
app.get('/ROUTE_NAME', function(req, res) // Put your custom route here
{
    res.set('Content-Type', 'text/json'); // Content Header
    res.status(200); // HTTP Status Code
    res.send("Successful reply from server"); // sending back data
    //res.json(); // To return json data you would use the following
    reportConnect(req); // Printing the ip that requested the information and the route to the servers console to keep track of requests and frequency
});
```

To pass parameters to the api you would use code that looks like the following

```
app.get('/ROUTE_NAME/:firstParam/:secondParam/', function(req, res) // Pass your parameters up here
{
  var firstParam = req.params.firstParam; // Taking the data from the request object and storing in a variable called firstParam
  var secondParam = req.params.secondParam; // Taking the data from the request object and storing in a variable called secondParam
  res.set('Content-Type', 'text/json');  
  res.status(200);
  res.send("First parameter was: " + firstParam + " - Second parameter was: " + secondParam); // sending back data
  reportConnect(req); 
});
```

# Summary

Node.js was quite enjoyable and easy to pick up and use. There is plenty of plugins out there to help you rapidly create your content. There was alot of Javascript and documents to read in the process of creating this API. I also found when dealing with a small amount of entries it's best to stick to a database suited for data that size instead of something potentially far bigger and un-needed.

The geojson around Galway wasn't as numerous as I thought it would be even though Galway has far more points of interest compared to the amount in the datasets supplied by the open data websites.

This kind of development is alot more different then creating something using PHP and a MySQL database in the background. Pouchdb and the other databases I experimented allowed for storing more then fields, they allowed for storing full json and even geojson objects.

Andrew Sweeney was the sole contributor on this project.

![Contributor](https://avatars1.githubusercontent.com/u/6676433?v=3&s=96)

# References

Links to resources
* [Node.js](https://nodejs.org/en/)
* [Sqlite3](https://www.npmjs.com/package/sqlite3)
* [Neo4j](https://www.npmjs.com/package/neo4j)
* [BootStrap Template](http://startbootstrap.com/template-overviews/sb-admin/)
* [Google Maps](https://developers.google.com/maps/?hl=en)
* [Pouchdb](http://pouchdb.com/learn.html)
* [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#tables)
* [DataGov](https://data.gov.ie/data)
* [Apps4Gaps](http://apps4gaps.ie/)




