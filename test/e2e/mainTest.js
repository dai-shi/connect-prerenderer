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
    expect(element('div[id="id001"]').text()).toContain('simple1');
  });

  it('should get /simplejs.html', function() {
    browser().navigateTo('/simplejs.html');
    expect(element('div[id="id002"]').text()).toContain('simple2');
  });

  it('should get prerendered /simpledom.html', function() {
    browser().navigateTo('/PRERENDER/simpledom.htmlHASH');
    expect(element('div[id="id001"]').text()).toContain('simple1');
  });

  it('should get prerendered /simplejs.html', function() {
    browser().navigateTo('/PRERENDER-simplejs.htmlHASH');
    expect(element('div[id="id002"]').text()).toContain('simple2');
  });



});
