/*!
 * enhance.js for robinsonvidva.com
 * Fills in page view counts from views.json (updated daily from GA).
 * Without JS the page renders exactly as before.
 */
(function () {
  'use strict';

  function setupViews() {
    var els = document.querySelectorAll('.page-views, .view-count');
    var totalEl = document.getElementById('total-site-views');
    if (!els.length && !totalEl) return;
    fetch('/views.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (data) {
      if (totalEl && data.totalViews > 0) totalEl.textContent = data.totalViews.toLocaleString();
      var pages = data.pages || {};
      Array.prototype.forEach.call(els, function (el) {
        var target = el.querySelector('.view-number') || el;
        var p = el.getAttribute('data-path') || window.location.pathname;
        var v = pages[p];
        if (v === undefined && p === '/') v = pages['/index.html'];
        if (v === undefined && p.charAt(p.length - 1) === '/') v = pages[p + 'index.html'];
        if (v === undefined && p.indexOf('.') === -1) v = pages[p + '.html'];
        if (v > 0) target.textContent = v.toLocaleString();
      });
    }).catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupViews);
  } else {
    setupViews();
  }
})();
