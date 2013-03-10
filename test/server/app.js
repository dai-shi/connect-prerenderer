var express = require('express');
var prerenderer = require('../../connect-prerenderer.js');

var app = express();

app.use(express.logger());
app.use(express.cookieParser());
app.use(prerenderer());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.send('It works!');
});

app.get('/data.json', function(req, res) {
  res.json({
    a: 12345,
    b: 22346,
    cookiex: req.cookies.x
  });
});


app.listen(5050);
