var express = require('express');
var prerenderer = require('../../connect-prerenderer.js');

var app = express();

app.configure('development', function() {
  app.use(express.logger());
});
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


app.listen(process.env.PORT || 5050);

//
//------------------------------------------------------------------
//

/*
 * another server for googlebot style
 */
var app2 = express();

app2.configure('development', function() {
  app2.use(express.logger());
});
app2.use(express.cookieParser());
app2.use(prerenderer({
  targetGenerator: 'googlebot'
}));
app2.use(express.static(__dirname + '/public'));

app2.get('/', function(req, res) {
  res.send('It works!');
});

app2.get('/data.json', function(req, res) {
  res.json({
    a: 12345,
    b: 22346,
    cookiex: req.cookies.x
  });
});


app2.listen(process.env.PORT2 || 5051);
