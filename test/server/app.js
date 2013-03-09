var express = require('express');
var prerenderer = require('../../connect-prerenderer.js');

var app = express();

app.use(express.logger());
app.use(prerenderer());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.send('It works!');
});

app.listen(5050);
