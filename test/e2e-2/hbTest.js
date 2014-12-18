/* jshint undef: true, unused: true, latedef: true */
/* jshint quotmark: single, eqeqeq: true, camelcase: true */

/* global describe, it, expect, browser, element */

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

  it('should pass the example in #15', function() {
    browser().navigateTo('/hbtest02.html?_escaped_fragment--ms--');
    expect(element('body').text()).toContain('hello');
  });


});
