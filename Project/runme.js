var express = require('express');

var app = express();

var todos = [
  'Clean dog.'
  , 'Buy Groceries.'
  , 'Send letter.'
];

app.get('/', function(req, res) {
    res.json({ message: 'It works!' });   
});

app.get('/todo', function(req, res) {
    res.json(todos);   
});

app.get('/todo/:id', function(req, res) {
    res.json(todos[req.params.id]);   
});

var server = app.listen(8000);