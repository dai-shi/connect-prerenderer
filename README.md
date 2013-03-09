connect-prerenderer
===================

An express/connect middleware to pre-render ajax page for non-ajax browsers, especially using angular.js

How to use
----------

    % npm install connect-prerenderer

In app.js:

    var express = require('express');
    var prerenderer = require('connect-prerenderer');
    var app = express();
    app.use(prerenderer());
    ...

TODOs
-----

* cookie support
* XHR support
