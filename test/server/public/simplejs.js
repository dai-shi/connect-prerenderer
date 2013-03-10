window.addEventListener('load', function() {
  if (!document.body.getAttribute('data-prerendered')) {
    var ele = document.getElementById('id002');
    ele.innerHTML += 'simple2';
  }
});
