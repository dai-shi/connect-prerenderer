#!/usr/bin/env node

'use strict';

var urlLib = require('url');
var request = require('request');
var jsdom = require('jsdom');

function filterHeaders(headers) {
  var newHeaders = {};
  for (var key in headers) {
    if (key === 'host' || key === 'cookie' ||
      (key.lastIndexOf('accept', 0) === 0 && key !== 'accept-encoding')) {
      newHeaders[key] = headers[key];
    }
  }
  return newHeaders;
}

function renderURL(url, headers, options, callback) {
  var timeout = (options && options.timeout ? options.timeout : 5000);
  var cookieDomain = options && options.cookieDomain;
  request({
    uri: urlLib.parse(url),
    headers: filterHeaders(headers)
  }, function(err, res, body) {
    if (err) {
      callback(err);
      return;
    }
    if (res.statusCode != 200) {
      callback(res.statusCode);
      return;
    }
    var document;
    var timer = null;
    var done = function() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        var content;
        try {
          document.body.setAttribute('data-prerendered', 'true');
          content = [document.doctype, document.innerHTML]
            .filter(function (val) { return val; }).join();
        }
        catch (err) {
          return callback(err);
        }
        callback(null, content, res.headers);
      }
    };

    timer = setTimeout(function() {
      if (options && options.attachConsole)
        console.error('prerenderer[err]: Timouted after ' + timeout + 'ms…');
      done();
    }, timeout);
    try {
      document = jsdom.jsdom(body, null, {
        url: url,
        cookie: headers.cookie,
        cookieDomain: cookieDomain,
        features: {
          FetchExternalResources: ['script'],
          ProcessExternalResources: ['script']
        }
      });
      if (options && options.attachConsole) {
        document.parentWindow.console.log = function() {
          Array.prototype.unshift.call(arguments, 'prerenderer[out]:');
          console.error.apply(console, arguments);
        };
        document.parentWindow.console.error = function() {
          Array.prototype.unshift.call(arguments, 'prerenderer[err]:');
          console.error.apply(console, arguments);
        };
      }
      document.onprerendered = done;
    } catch (err) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      callback(err);
      return;
    }
  });
}

var args = [];

try {
  args = JSON.parse(process.argv[2] || '[]');
}
catch (e) {
  console.log(JSON.stringify([e.stack]));
  process.exit(1);
}

if (args.length !== 3) {
  console.log('["Bad argument"]');
  process.exit(1);
}

args.push(function(err, content, headers) {
  console.log(JSON.stringify([err && err.stack, content, headers]));
  process.exit(0);
});

renderURL.apply(null, args);
