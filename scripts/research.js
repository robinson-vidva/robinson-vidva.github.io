/*!
 * research.js for robinsonvidva.com
 * Filter by type and area, search, sort and page the research list.
 * Reads ?type=, ?area= and ?q= from the URL so other pages can link into a filtered list.
 */
(function () {
  'use strict';
  var state = { type: 'all', area: 'all', sort: 'newest', page: 1, q: '' };
  var PER_PAGE = 10;

  function items() { return Array.prototype.slice.call(document.querySelectorAll('.research-item')); }

  function filtered() {
    return items().filter(function (el) {
      var okType = state.type === 'all' || el.dataset.type === state.type;
      var okArea = state.area === 'all' || el.dataset.area === state.area;
      var okQ = !state.q || el.textContent.toLowerCase().indexOf(state.q) !== -1;
      return okType && okArea && okQ;
    }).sort(function (a, b) {
      var da = new Date(a.dataset.date), db = new Date(b.dataset.date);
      return state.sort === 'newest' ? db - da : da - db;
    });
  }

  function setPressed(group, value) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-filter="' + group + '"] .btn'), function (btn) {
      var on = btn.getAttribute('data-value') === value;
      btn.classList.toggle('btn-primary', on);
      btn.classList.toggle('btn-outline-primary', !on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function render() {
    var list = filtered(), total = list.length, pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;
    var start = (state.page - 1) * PER_PAGE, end = Math.min(start + PER_PAGE, total);
    var ul = document.querySelector('#research-list ul');
    list.forEach(function (el) { ul.appendChild(el); });
    items().forEach(function (el) { el.classList.add('hidden'); });
    list.slice(start, end).forEach(function (el) { el.classList.remove('hidden'); });
    var info = document.getElementById('showing-info');
    if (info) {
      info.textContent = total === 0 ? 'No items match.' : 'Showing ' + (start + 1) + '-' + end + ' of ' + total + ' items';
      info.style.visibility = 'visible';
    }
    pagination(pages);
  }

  function pagination(pages) {
    var box = document.getElementById('pagination-controls');
    if (!box) return;
    box.innerHTML = '';
    if (pages <= 1) return;
    function li(label, page, cls, aria) {
      var el = document.createElement('li');
      el.className = 'page-item ' + (cls || '');
      var a = document.createElement('a'); a.className = 'page-link'; a.href = '#'; a.innerHTML = label;
      if (aria) a.setAttribute('aria-label', aria);
      a.addEventListener('click', function (e) { e.preventDefault(); if (page >= 1 && page <= pages) { state.page = page; render(); document.getElementById('research-list').scrollIntoView({ behavior: 'smooth' }); } });
      el.appendChild(a); box.appendChild(el);
    }
    li('&laquo;', state.page - 1, state.page === 1 ? 'disabled' : '', 'Previous');
    for (var i = 1; i <= pages; i++) li(String(i), i, i === state.page ? 'active' : '');
    li('&raquo;', state.page + 1, state.page === pages ? 'disabled' : '', 'Next');
  }

  function init() {
    var params = new URLSearchParams(window.location.search);
    var type = params.get('type'), area = params.get('area'), q = params.get('q');
    if (type && document.querySelector('[data-filter="type"] [data-value="' + type + '"]')) state.type = type;
    if (area && document.querySelector('[data-filter="area"] [data-value="' + area + '"]')) state.area = area;
    var search = document.getElementById('search-input');
    if (q && search) { search.value = q; state.q = q.toLowerCase().trim(); }
    setPressed('type', state.type); setPressed('area', state.area);

    Array.prototype.forEach.call(document.querySelectorAll('[data-filter] .btn'), function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.parentNode.getAttribute('data-filter');
        state[group] = btn.getAttribute('data-value'); state.page = 1;
        setPressed(group, state[group]); render();
      });
    });
    if (search) search.addEventListener('input', function () { state.q = search.value.toLowerCase().trim(); state.page = 1; render(); });
    var sort = document.getElementById('sort-order');
    if (sort) sort.addEventListener('change', function () { state.sort = sort.value; state.page = 1; render(); });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
