/*
  Copyright (C) 2013 Daishi Kato <daishi@axlight.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jshint es5:true */

var jsdom = require('jsdom');

function prerenderer(options) {
  return function(req, res, next) {
    var url = getTargetURL(req, options);
    if (url) {
      renderURL(url, function(err, content) {
        if (err) {
          console.log('renderURL failed: ', err);
          next();
        } else {
          //TODO deal with all those headers
          res.end(content);
        }
      });
    } else {
      next();
    }
  }
}

var prerenderURLRegex = new RegExp('^/PRERENDER[-/](.*)HASH(.*)');

function getTargetURL(req, options) {
  options = options || {};
  var urlChecker = options['urlChecker'] || function(url) {
      return prerenderURLRegex.test(url);
    };
  var targetGenerator = options['targetGenerator'] || function(url) {
      var prefix = options['targetPrefix'] || 'http://' + req.headers.host;
      var replacer = options['targetReplacer'] || function(url) {
          return url.replace(prerenderURLRegex, '/$1#$2');
        };
      return prefix + replacer(url);
    };

  return urlChecker(req.url) && targetGenerator(req.url);
}

//TODO support cookies, xhr
function renderURL(url, callback) {
  jsdom.env(url, {
    features: {
      FetchExternalResources: ['script'],
      ProcessExternalResources: ['script']
    }
  }, function(err, window) {
    if (err) {
      callback(err);
      return;
    }
    var content = window.document.innerHTML;
    callback(err, content);
  });
}



if (process.env.NODE_ENV === 'unit-test') {
  exports.prerenderer = prerenderer;
  exports.getTargetURL = getTargetURL;
  exports.renderURL = renderURL;
} else {
  module.exports = prerenderer;
}
