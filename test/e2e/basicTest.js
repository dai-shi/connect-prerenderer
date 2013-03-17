/* global browser: false */
/* global element: false */
/* global sleep: false */

describe('main e2e test for prerenderer', function() {

  it('should get /', function() {
    browser().navigateTo('/');
    expect(element('body').text()).toEqual('It works!');
  });

  it('should get /hello.html', function() {
    browser().navigateTo('/hello.html');
    expect(element('body').text()).toContain('hello');
  });

  it('should get /simpledom.html', function() {
    browser().navigateTo('/simpledom.html');
    expect(element('div[id="id001"]').text()).toBe('simple1');
  });

  it('should get /simplejs.html', function() {
    browser().navigateTo('/simplejs.html');
    expect(element('div[id="id002"]').text()).toBe('simple2');
  });

  it('should get prerendered /simpledom.html', function() {
    browser().navigateTo('/PRERENDER/simpledom.html');
    expect(element('div[id="id001"]').text()).toBe('simple1');
  });

  it('should get prerendered /simplejs.html', function() {
    browser().navigateTo('/PRERENDER-simplejs.html');
    expect(element('div[id="id002"]').text()).toBe('simple2');
  });

  it('should get /simplexhr.html', function() {
    browser().navigateTo('/simplexhr.html');
    sleep(1);
    expect(element('div[id="id003"]').text()).toBe('12345');
  });

  it('should get prerendered /simplexhr.html', function() {
    browser().navigateTo('/PRERENDER-simplexhr.html');
    expect(element('div[id="id003"]').text()).toBe('12345');
  });

  it('should get /simplecookie.html', function() {
    browser().navigateTo('/simplecookie.html');
    sleep(1);
    expect(element('div[id="id004"]').text()).toBe('7890');
  });

  it('should get prerendered /simplecookie.html', function() {
    browser().navigateTo('/PRERENDER-simplecookie.html');
    expect(element('div[id="id004"]').text()).toBe('7890');
  });

  it('should get /testonprerendered.html', function() {
    browser().navigateTo('/testonprerendered.html');
    sleep(1);
    expect(element('div[id="id005"]').text()).toBe('simple5');
  });

  it('should get prerendered /testonprerendered.html', function() {
    browser().navigateTo('/PRERENDER-testonprerendered.html');
    expect(element('div[id="id005"]').text()).toBe('simple5');
  });

});
