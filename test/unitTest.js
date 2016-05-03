/* eslint-env mocha */

var path = require('path');
var assert = require('assert');

process.env.NODE_ENV = 'unit-test';
var prerenderer = require('../connect-prerenderer.js');

var spawn = require('child_process').spawn;

describe('unit test for prerenderer', function() {
  var server = null;
  before(function() {
    server = spawn(process.argv[0], [path.join(__dirname, '/server/app.js')], {stdio: 'inherit'});
  });
  after(function() {
    server.kill('SIGKILL');
  });

  it('should get target url without options', function() {
    assert.equal(prerenderer.getTargetURL({
      url: '/PRERENDER/abc/HASH/def',
      headers: {
        host: '1.2.3.4:5678'
      }
    }), 'http://1.2.3.4:5678/abc/#/def');

    assert.equal(prerenderer.getTargetURL({
      url: '/PRERENDER/abcHASHdef',
      headers: {
        host: '1.2.3.4:5678'
      }
    }), 'http://1.2.3.4:5678/abc#def');

    assert.equal(prerenderer.getTargetURL({
      url: '/PRERENDER/HASH/abc',
      headers: {
        host: '1.2.3.4:5678'
      }
    }), 'http://1.2.3.4:5678/#/abc');

    assert.equal(prerenderer.getTargetURL({
      url: '/PRERENDER-abcHASHdef',
      headers: {
        host: '1.2.3.4:5678'
      }
    }), 'http://1.2.3.4:5678/abc#def');

    assert.equal(prerenderer.getTargetURL({
      url: '/PRERENDER-HASH/abc',
      headers: {
        host: '1.2.3.4:5678'
      }
    }), 'http://1.2.3.4:5678/#/abc');

    assert.equal(prerenderer.getTargetURL({
      url: '/PRERENDER/abc',
      headers: {
        host: '1.2.3.4:5678'
      }
    }), 'http://1.2.3.4:5678/abc');

    assert.equal(prerenderer.getTargetURL({
      url: '/PRERENDER-abc',
      headers: {
        host: '1.2.3.4:5678'
      }
    }), 'http://1.2.3.4:5678/abc');

    assert.equal(prerenderer.getTargetURL({
      url: '/PRERENDER-abcHASH-def',
      headers: {
        host: '1.2.3.4:5678'
      }
    }), 'http://1.2.3.4:5678/abc#/def');

  });

  it('should render google.com', function(done) {
    prerenderer.renderURL('http://www.google.com/', {}, {timeout: 1000}, function(err, content) {
      assert.ok(content.indexOf('google.com') >= 0);
      done();
    });
  });

  if (process.env.RENDERER_USE_SUBPROCESS) return;

  it('should accept attachConsole option', function(done) {
    var oldErr = console.error;
    var text = '';
    console.error = function() {
      text += [].slice.call(arguments).join(' ') + '\n';
    };
    prerenderer.renderURL('http://localhost:5050/console.html', {}, {attachConsole: true, timeout: 1000}, function(err /* , content */) {
      console.error = oldErr;
      assert.ok(text.indexOf('prerenderer[out]: test') >= 0);
      done(err);
    });
  });

});
