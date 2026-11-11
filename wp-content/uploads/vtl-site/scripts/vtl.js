(function () {
  'use strict';
  var t = document.querySelector('.v-nav__toggle'), n = document.getElementById('v-nav');
  if (t && n) t.addEventListener('click', function () {
    var open = n.classList.toggle('is-open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.v-tabs').forEach(function (box) {
    var tabs = box.querySelectorAll('[role=tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (x) {
          var on = x === tab;
          x.setAttribute('aria-selected', on ? 'true' : 'false');
          x.tabIndex = on ? 0 : -1;
          var p = document.getElementById(x.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
      });
      tab.addEventListener('keydown', function (e) {
        var i = Array.prototype.indexOf.call(tabs, tab);
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          var j = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          tabs[j].focus(); tabs[j].click(); e.preventDefault();
        }
      });
    });
  });
  document.querySelectorAll('[data-v-gallery]').forEach(function (g) {
    var main = g.querySelector('[data-v-main]');
    g.querySelectorAll('[data-v-thumb]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (main) main.src = b.getAttribute('data-v-thumb');
        g.querySelectorAll('[data-v-thumb]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      });
    });
  });
  document.querySelectorAll('[data-v-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.getAttribute('data-v-toggle'));
      if (!el) return;
      var open = el.classList.toggle('is-open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.querySelectorAll('form[data-v-autosubmit]').forEach(function (f) {
    f.addEventListener('change', function (e) { if (e.target.type !== 'search') f.submit(); });
  });
})();
