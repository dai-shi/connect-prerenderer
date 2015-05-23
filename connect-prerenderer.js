/*
  Copyright (C) 2013, Daishi Kato <daishi@axlight.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
  HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* jshint evil: true */

var http = require('http');
var spawn = require('child_process').spawn;

var targetGeneratorMap = {

  'googlebot': function(url, options, req) {
    var prefix = options['targetPrefix'] || 'http://' + req.headers.host;
    var fragment = req.query['_escaped_fragment_'];
    if (!fragment && fragment !== '') {
      return null;
    }
    url = url.replace(/[?&]_escaped_fragment_=[^&]*/, '');
    return prefix + url + '#!' + fragment;
  },

  'default': (function() {
    var prerenderURLPrefix = '/PRERENDER';
    var prerenderURLPrefixLengthPlusOne = prerenderURLPrefix.length + 1;
    return function(url, options, req) {
      var prefix = options['targetPrefix'] || 'http://' + req.headers.host;
      var urlChecker = options['urlChecker'] || function(url) {
          return url.lastIndexOf(prerenderURLPrefix, 0) === 0 && url.length >= prerenderURLPrefixLengthPlusOne;
        };
      if (!urlChecker(req.url)) {
        return null;
      }
      var replacer = options['targetReplacer'] || function(url) {
          url = '/' + url.substring(prerenderURLPrefixLengthPlusOne);
          var match = url.match(/HASH([-_:;|*+])?/);
          if (match) {
            url = url.replace(/HASH/, '#');
            if (match[1]) {
              var hex = match[1].charCodeAt().toString(16);
              url = url.replace(new RegExp('\\x' + hex, 'g'), '/');
            }
          }
          return url;
        };
      url = replacer(url);
      return prefix + url;
    };
  })()

};

function getTargetURL(req, options) {
  options = options || {};

  var targetGenerator = options['targetGenerator'];
  if (typeof targetGenerator !== 'function') {
    targetGenerator = targetGeneratorMap[targetGenerator] || targetGeneratorMap['default'];
  }
  return targetGenerator(req.url, options, req);
}

function renderURL(url, headers, options, callback) {
  var renderer = spawn(process.argv[0], [__dirname + '/urlRenderer.js', JSON.stringify([url, headers, options])], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  renderer.stderr.pipe(process.stderr);

  var allData = new Buffer('');
  renderer.stdout.on('data', function(data) {
    allData = Buffer.concat([allData, data]);
  });
  renderer.stdout.on('end', function() {
    var args = JSON.parse(allData);

    if (args[0])
      args[0] = new Error(args[0]);

    callback.apply(null, args);
  });
  renderer.stdout.on('error', function(error) {
    renderer.kill('SIGKILL');
    callback(err);
  });
}

function prerenderer(options) {
  return function(req, res, next) {
    var url = getTargetURL(req, options);
    if (url) {
      //console.log('headers:', req.headers);
      renderURL(url, req.headers, options, function(err, content, headers) {
        if (typeof err === 'number') {
          res.statusCode = err;
          content = http.STATUS_CODES[err];
          res.setHeader('content-length', Buffer.byteLength(content));
          res.end(content);
        } else if (err) {
          console.log('renderURL failed: ', err.stack);
          next();
        } else {
          //console.log('prerendered:' , content);
          headers['content-length'] = Buffer.byteLength(content);
          res.writeHead(200, headers);
          res.end(content);
        }
      });
    } else {
      next();
    }
  };
}



if (process.env.NODE_ENV === 'unit-test') {
  exports.getTargetURL = getTargetURL;
  exports.renderURL = renderURL;
  exports.prerenderer = prerenderer;
} else {
  module.exports = prerenderer;
}
