var express = require('express');
var http = require('http');
var app = express();

var httpServer = http.Server(app);

app.use(express.static(__dirname));


app.get('/', function(req, res) {
    //res.json({ message: 'It works!' });   

	res.sendfile(__dirname + '/index.html');
});

app.get('/todo', function(req, res) {
    res.json(todos);   
});

app.get('/todo/:id', function(req, res) {
    res.json(todos[req.params.id]);   
});

var server = app.listen(8000);