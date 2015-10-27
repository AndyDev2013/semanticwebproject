# semanticwebproject

Semantic Web Project for Year 4 of Software Development in GMIT by Andrew Sweeney

# Contents

* Project Outline
* Choosen Datasets
* Integration plan

# Project Outline

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

Links to resources
* [Node.js](https://nodejs.org/en/)
* [Sqlite3](https://www.npmjs.com/package/sqlite3)
* [BootStrap Template](http://startbootstrap.com/template-overviews/sb-admin/)
* [Google Maps](https://developers.google.com/maps/?hl=en)




