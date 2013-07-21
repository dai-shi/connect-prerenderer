connect-prerenderer
===================

Express/connect middleware to pre-render ajax page for non-ajax browsers, especially using angular.js

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

* targetGenerator: a name or a function to generate a new one for HTTP request.
  * "default" --- check "/PRERENDER-" prefix which will be removed, and replace "HASH-" to "#/" and all "-"s to "/"s to make a target URL. (see the source code for more options.)
  * "googlebot" --- follow <https://developers.google.com/webmasters/ajax-crawling/docs/getting-started>
  * a function that returns a target URL for prerendering or null.
* timeout: an integer in milliseconds to specify how long it watis to prerender.
* cookieDomain: a domain name to allow passing cookies.


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

* `style` attributes are not preserved by jsdom (use `class` only).

AngularJS only limitations:

* `ng-repeat` workaround only works with `ng-repeat` attributes.

TODOs
-----

* more complex examples.
