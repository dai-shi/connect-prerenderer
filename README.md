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

Options
-------

* urlChecker: a function to check if a url should be prerendered.
* targetGenerator: a function to generate a new one for HTTP request.
  * targetPrefix: an internal string used in the default targetGenerator.
  * targetReplacer: an internal function used in the default targetGenerator.
* timeout: an integer in milliseconds to specify how long it watis to prerender.

Coding conventions (client-side)
--------------------------------

* If an html is prerendered, the body is like: `<body data-prerendered="true">`
* When JavaScript code finishes prerendering, it should call: `document.onprerendered()`

Limitations
-----------

* Cookies are only passed to 127.0.0.1.

TODOs
-----

(No more ongoing issues. Please file it if you have one.)
