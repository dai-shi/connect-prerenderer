/* global browser: false */
/* global element: false */

describe('main e2e hashbang test for prerenderer', function() {

  it('should get default name', function() {
    browser().navigateTo('/hbtest01.html');
    expect(element('body').text()).toContain('hello world');
  });

  it('should get specified name', function() {
    browser().navigateTo('/hbtest01.html#!alice');
    expect(element('body').text()).toContain('hello alice user');
  });

  it('should get specified name prerendered', function() {
    browser().navigateTo('/hbtest01.html?_escaped_fragment_=alice');
    expect(element('body').text()).toContain('hello alice user');
  });

  it('should get empty name', function() {
    browser().navigateTo('/hbtest01.html#!');
    expect(element('body').text()).toContain('hello  user');
  });

  it('should get empty name prerendered', function() {
    browser().navigateTo('/hbtest01.html?_escaped_fragment_=');
    expect(element('body').text()).toContain('hello  user');
  });


});
