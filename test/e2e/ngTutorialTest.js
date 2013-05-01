/* global browser: false */
/* global element: false */
/* global sleep: false */

describe('angular tutorial e2e test for prerenderer', function() {

  it('should get step02', function() {
    browser().navigateTo('/ngtutorial02.html');
    sleep(1);
    expect(element('ul li:nth-child(1)').text()).toContain('Nexus S');
    expect(element('ul li:nth-child(1)').text()).toContain('Fast just got faster with Nexus S.');
    expect(element('ul li:nth-child(2)').text()).toContain('Motorola XOOM');
    expect(element('ul li:nth-child(2)').text()).toContain('The Next, Next Generation tablet.');
    expect(element('ul li:nth-child(3)').text()).toContain('MOTOROLA XOOM');
    expect(element('ul li:nth-child(3)').text()).toContain('The Next, Next Generation tablet.');
  });

  it('should get prerendered /ngtutorial02.html', function() {
    browser().navigateTo('/PRERENDER-ngtutorial02.html');
    expect(element('ul li:nth-child(1)').text()).toContain('Nexus S');
    expect(element('ul li:nth-child(1)').text()).toContain('Fast just got faster with Nexus S.');
    expect(element('ul li:nth-child(2)').text()).toContain('Motorola XOOM');
    expect(element('ul li:nth-child(2)').text()).toContain('The Next, Next Generation tablet.');
    expect(element('ul li:nth-child(3)').text()).toContain('MOTOROLA XOOM');
    expect(element('ul li:nth-child(3)').text()).toContain('The Next, Next Generation tablet.');
  });


});
