#!/usr/bin/env node

'use strict';

var path = require('path');
var urlLib = require('url');
var request = require('request');
var jsdom = require('jsdom');
var spawn = require('child_process').spawn;

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
    if (res.statusCode !== 200) {
      callback(res.statusCode);
      return;
    }
    var document;
    var timer = null;
    var done = function() {
      if (!timer) return;

      clearTimeout(timer);
      timer = null;
      var content;
      try {
        document.body.setAttribute('data-prerendered', 'true');
        content = jsdom.serializeDocument(document);
      } catch (err) {
        return callback(err);
      }
      callback(null, content, res.headers);
    };

    timer = setTimeout(function() {
      console.error('prerenderer[err]: Timouted after ' + timeout + 'ms…');
      done();
    }, timeout);
    try {
      document = jsdom.jsdom(body, {
        url: url,
        cookie: headers.cookie,
        cookieDomain: cookieDomain,
        features: {
          FetchExternalResources: ['script'],
          ProcessExternalResources: ['script']
        },
        created: function(err, window) {
          if (err) return;
          if (options && options.attachConsole) {
            window.console.log = function() {
              Array.prototype.unshift.call(arguments, 'prerenderer[out]:');
              console.error.apply(console, arguments);
            };
            window.console.error = function() {
              Array.prototype.unshift.call(arguments, 'prerenderer[err]:');
              console.error.apply(console, arguments);
            };
          }
        },
        done: done
      });
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

module.exports.renderURL = renderURL;
module.exports.subprocessRenderURL = function subprocessRenderURL(url, headers, options, callback) {
  var renderer = spawn(process.argv[0], [path.join(__dirname, 'urlRenderer.js'), JSON.stringify([url, headers, options])], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  renderer.stderr.pipe(process.stderr);

  var allData = new Buffer('');
  renderer.stdout.on('data', function(data) {
    allData = Buffer.concat([allData, data]);
  });

  var timeout = (options && options.timeout ? options.timeout : 5000) + 1000;
  var timer = null;

  function done(err) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    renderer.kill('SIGKILL');

    var args;
    try {
      args = JSON.parse(allData);
    } catch (e) {
      args = [e];
    }

    if (args[0] && !(args[0] instanceof Error)) {
      args[0] = new Error(args[0]);
    } else if (err) {
      args[0] = err;
    }

    callback.apply(null, args);
  }

  timer = setTimeout(function() {
    console.log('Timouted after ' + timeout + ' ms');
    done();
  }, timeout);

  renderer.stdout.on('end', done);

  renderer.stdout.on('error', function(err) {
    renderer.kill('SIGKILL');
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    callback(err);
  });
};

if (module.parent) {
  return;
}

var args = [];

try {
  args = JSON.parse(process.argv[2] || '[]');
} catch (e) {
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
