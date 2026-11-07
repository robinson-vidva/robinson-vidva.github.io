/*!
 * site.js for robinsonvidva.com
 * Menu toggle on small screens and show/hide sections. No framework.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  ready(function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-bs-toggle="collapse"]'), function (btn) {
      var sel = btn.getAttribute('data-bs-target') || btn.getAttribute('href');
      var target = sel ? document.querySelector(sel) : null;
      if (!target) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var open = target.classList.toggle('show');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var span = btn.querySelector('span');
        if (span) {
          var program = span.textContent.indexOf('program details') !== -1;
          span.textContent = open ? (program ? 'Hide program details & curriculum' : 'Hide details')
                                  : (program ? 'View program details & curriculum' : 'Show details');
        }
      });
    });
  });
})();
