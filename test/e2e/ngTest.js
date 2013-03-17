/* global browser: false */
/* global element: false */
/* global sleep: false */

describe('main e2e test for prerenderer', function() {

  it('should get /ngtest01.html', function() {
    browser().navigateTo('/ngtest01.html');
    sleep(1);
    expect(element('div[id="ngtestid"]').text()).toBe('22346');
  });

  it('should get prerendered /ngtest01.html', function() {
    browser().navigateTo('/PRERENDER-ngtest01.html');
    expect(element('div[id="ngtestid"]').text()).toBe('22346');
  });

  it('should get /ngtest02.html', function() {
    browser().navigateTo('/ngtest02.html');
    expect(element('div[id="ngtestid"]').css('display')).toBe('block');
    element('button').click();
    expect(element('div[id="ngtestid"]').css('display')).toBe('none');
  });

  it('should get prerendered /ngtest02.html', function() {
    browser().navigateTo('/PRERENDER-ngtest02.html');
    expect(element('div[id="ngtestid"]').css('display')).toBe('block');
    element('button').click();
    expect(element('div[id="ngtestid"]').css('display')).toBe('none');
  });

  it('should get /ngtest03.html', function() {
    browser().navigateTo('/ngtest03.html');
    expect(element('div[id="ngtestid"]').text()).toBe('foo=');
    element('button').click();
    expect(element('div[id="ngtestid"]').text()).toBe('foo=foo');
    element('button').click();
    expect(element('div[id="ngtestid"]').text()).toBe('foo=foofoo');
  });

  it('should get prerendered /ngtest03.html', function() {
    browser().navigateTo('/PRERENDER-ngtest03.html');
    expect(element('div[id="ngtestid"]').text()).toBe('foo=');
    element('button').click();
    expect(element('div[id="ngtestid"]').text()).toBe('foo=foo');
    element('button').click();
    expect(element('div[id="ngtestid"]').text()).toBe('foo=foofoo');
  });

  it('should get /ngtest04.html', function() {
    browser().navigateTo('/ngtest04.html');
    expect(element('div[id="ngtestid"]').attr('href')).toBe('a.txt#');
    element('button').click();
    expect(element('div[id="ngtestid"]').attr('href')).toBe('a.txt#blue');
  });

  it('should get prerendered /ngtest04.html', function() {
    browser().navigateTo('/PRERENDER-ngtest04.html');
    expect(element('div[id="ngtestid"]').attr('href')).toBe('a.txt#');
    element('button').click();
    expect(element('div[id="ngtestid"]').attr('href')).toBe('a.txt#blue');
  });

});
