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

By default, it will check "/PRERENDER-" prefix which will be removed,
and replace "HASH-" to "#/" and all "-"s to "/"s to make
a target URL.

Coding conventions (client-side)
--------------------------------

* If an html is prerendered, the body is like: `<body data-prerendered="true">`
* When JavaScript code finishes prerendering, it should call: `document.onprerendered()`

Notes for AngularJS
-------------------

The following snippet would help AngularJS to work:

    <script>
      angular.element(document).ready(function() {
        if (document.body.getAttribute('data-prerendered')) {
          document.addEventListener('click', function() {
            document.removeEventListener('click', arguments.callee, true);
            angular.bootstrap(document.body, []);
            return true;
          }, true);
        } else {
          angular.bootstrap(document.body, []);
        }
      });
    </script>

To keep templates for interpolation in a prerendered html,
use the modified version of `angular.js` located in test/server/public/.

Limitations
-----------

* Cookies are only passed to 127.0.0.1.
* `style` attributes are not preserved by jsdom (use `class` only).

AngularJS only limitations:

* `ng-repeat` doesn't work well if it is prerendered. (looking for a workaround)

TODOs
-----

* a workaround for `ng-repeat`
