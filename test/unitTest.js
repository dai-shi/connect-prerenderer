var assert = require('assert');

process.env.NODE_ENV = 'unit-test';
var prerenderer = require('../connect-prerenderer.js');

describe('unit test for prerenderer', function() {

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

});
