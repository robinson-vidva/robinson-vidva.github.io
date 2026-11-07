/*!
 * globe.js for robinsonvidva.com
 * A slowly turning globe of the site's work: areas, methods, papers, talks, patents, projects, tools, articles.
 * Reads GLOBE_DATA (scripts/globe-data.js). SVG only, no library. Honors prefers-reduced-motion.
 */
function drawGlobe(svg, D, opts) {
  'use strict';
  var N = 'http://www.w3.org/2000/svg';
  var W = opts.width, H = opts.height, R = opts.radius, CX = opts.cx || W / 2, CY = opts.cy || H / 2, KEEP = opts.keepOut || 0;
  var NAVY = '#083868', INK = '#0f2545', SKY = '#35c0ed', EDGE = '#5b7a9c';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var compact = !!opts.compact;
  var token = svg._globeToken = (svg._globeToken || 0) + 1;

  /* ----- place everything on the unit sphere ----- */
  function v(lat, lon) { return { x: Math.cos(lat) * Math.cos(lon), y: Math.sin(lat), z: Math.cos(lat) * Math.sin(lon) }; }
  function norm(p) { var l = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z) || 1; return { x: p.x / l, y: p.y / l, z: p.z / l }; }
  function add(a, b) { return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }; }
  function scale(a, s) { return { x: a.x * s, y: a.y * s, z: a.z * s }; }
  var centres = [v(0.5, 0.0), v(-0.45, 1.05), v(0.5, 2.1), v(-0.45, 3.15), v(0.5, 4.2), v(-0.45, 5.25)];
  var nodes = [], byId = {};
  function push(n) { n.i = nodes.length; nodes.push(n); byId[n.id] = n; return n; }
  D.areas.forEach(function (a, k) { push({ id: a.id, kind: 'area', label: a.label, href: a.href, p: centres[k % centres.length] }); });
  var count = {}, seen = {};
  D.items.forEach(function (it) { count[it.area] = (count[it.area] || 0) + 1; });
  D.items.forEach(function (it, j) {
    var c = byId[it.area].p, k = seen[it.area] = (seen[it.area] || 0) + 1, n = count[it.area];
    var ang = k * 2.39996, rad = 0.16 + 0.42 * Math.sqrt(k / n);
    var up = Math.abs(c.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
    var t1 = norm({ x: up.y * c.z - up.z * c.y, y: up.z * c.x - up.x * c.z, z: up.x * c.y - up.y * c.x });
    var t2 = { x: c.y * t1.z - c.z * t1.y, y: c.z * t1.x - c.x * t1.z, z: c.x * t1.y - c.y * t1.x };
    var p = norm(add(c, add(scale(t1, Math.cos(ang) * rad), scale(t2, Math.sin(ang) * rad))));
    var href = it.href || (it.q ? 'research.html?q=' + encodeURIComponent(it.q) : 'research.html');
    push({ id: 'it' + j, kind: it.type, label: it.label, href: href, area: it.area, also: it.also || [], methods: it.methods || [], p: p });
  });
  D.methods.forEach(function (m) {
    var p = { x: 0, y: 0, z: 0 }; m.near.forEach(function (a) { p = add(p, byId[a].p); });
    p = norm(p); if (m.near.length === 1) { p = norm(add(p, { x: 0.35, y: -0.3, z: 0.2 })); }
    push({ id: m.id, kind: 'method', label: m.label, href: m.href || 'projects.html', p: p });
  });
  var edges = [];
  nodes.forEach(function (n) {
    if (!n.area) return;
    edges.push([byId[n.area].i, n.i, 1]);
    n.also.forEach(function (a) { if (byId[a]) edges.push([byId[a].i, n.i, 0.7]); });
    n.methods.forEach(function (m) { if (byId[m]) edges.push([n.i, byId[m].i, 0.6]); });
  });
  for (var a = 0; a < nodes.length; a++) for (var b = a + 1; b < nodes.length; b++) {
    var A = nodes[a], B = nodes[b];
    if (A.kind === 'area' && B.kind === 'area') edges.push([a, b, 0.35]);
    else if (A.kind !== 'area' && B.kind !== 'area') { var d = A.p.x * B.p.x + A.p.y * B.p.y + A.p.z * B.p.z; if (d > 0.955) edges.push([a, b, 0.25]); }
  }

  /* ----- svg ----- */
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  var defs = document.createElementNS(N, 'defs');
  defs.innerHTML = '<radialGradient id="g-glow"><stop offset="0" stop-color="' + SKY + '" stop-opacity="0.9"/><stop offset="0.5" stop-color="' + SKY + '" stop-opacity="0.25"/><stop offset="1" stop-color="' + SKY + '" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="g-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + SKY + '" stop-opacity="0"/><stop offset="0.5" stop-color="' + SKY + '" stop-opacity="0.22"/><stop offset="1" stop-color="' + SKY + '" stop-opacity="0"/></linearGradient>';
  svg.appendChild(defs);
  var waves = [];
  for (var w = 0; w < 3; w++) { var pth = document.createElementNS(N, 'path'); pth.setAttribute('fill', 'url(#g-wave)'); pth.setAttribute('opacity', (0.9 - w * 0.25).toFixed(2)); svg.appendChild(pth); waves.push(pth); }
  var seed = 3; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var sparks = [];
  for (var s = 0; s < (compact ? 30 : 70); s++) {
    var c = document.createElementNS(N, 'circle'); c.setAttribute('fill', 'url(#g-glow)');
    var bx = KEEP + rnd() * (W - KEEP - 20), by = 20 + rnd() * (H - 40);
    var dx = bx - CX, dy = by - CY; if (Math.sqrt(dx * dx + dy * dy) < R * 1.05) { bx += (dx > 0 ? 1 : -1) * R * 1.1; }
    sparks.push({ el: c, x: bx, y: by, r: 3 + rnd() * 5, ph: rnd() * 6.28, sp: 0.3 + rnd() * 0.6 }); svg.appendChild(c);
  }
  var gE = document.createElementNS(N, 'g'), gN = document.createElementNS(N, 'g'); svg.appendChild(gE); svg.appendChild(gN);
  var lineEls = edges.map(function () { var l = document.createElementNS(N, 'line'); l.setAttribute('stroke', EDGE); gE.appendChild(l); return l; });
  var hover = -1;
  var els = nodes.map(function (n) {
    var g = document.createElementNS(N, 'g'); var a = document.createElementNS(N, 'a'); a.setAttribute('href', n.href);
    if (/^https?:/.test(n.href)) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
    var halo = document.createElementNS(N, 'circle'); halo.setAttribute('fill', 'url(#g-glow)');
    var c = document.createElementNS(N, 'circle');
    var t = document.createElementNS(N, 'text'); t.setAttribute('font-family', 'Source Serif 4, Georgia, serif'); t.textContent = n.label;
    var title = document.createElementNS(N, 'title'); title.textContent = n.label; a.appendChild(title);
    if (n.kind === 'area') { t.setAttribute('font-weight', '600'); t.setAttribute('font-size', compact ? '17' : '15'); t.setAttribute('fill', INK); }
    else if (n.kind === 'method') { t.setAttribute('font-style', 'italic'); t.setAttribute('font-size', compact ? '14' : '12.5'); t.setAttribute('fill', '#355070'); }
    else { t.setAttribute('font-size', compact ? '13' : '11.5'); t.setAttribute('fill', '#3f5270'); }
    a.appendChild(halo); a.appendChild(c); a.appendChild(t); g.appendChild(a); g.style.cursor = 'pointer'; gN.appendChild(g);
    g.addEventListener('mouseenter', function () { hover = n.i; });
    g.addEventListener('mouseleave', function () { hover = -1; });
    a.addEventListener('focus', function () { hover = n.i; });
    a.addEventListener('blur', function () { hover = -1; });
    return { g: g, halo: halo, c: c, t: t };
  });

  /* ----- animation ----- */
  var rot = 0.6, tilt = 0.32, f = 3.2, t0 = performance.now(), last = t0;
  function project(p, rot) {
    var x = p.x * Math.cos(rot) + p.z * Math.sin(rot), z = -p.x * Math.sin(rot) + p.z * Math.cos(rot), y = p.y;
    var y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
    var sc = f / (f - z2);
    return { x: CX + x * R * sc, y: CY - y2 * R * sc, z: z2, s: sc };
  }
  function neighbours(i) { var k = {}; k[i] = 1; edges.forEach(function (e) { if (e[2] >= 0.6) { if (e[0] === i) k[e[1]] = 1; if (e[1] === i) k[e[0]] = 1; } }); return k; }
  var shown = [];
  function free(x, y, wdt) { for (var k = 0; k < shown.length; k++) { var o = shown[k]; if (Math.abs(o.y - y) < 15 && x < o.x + o.w && o.x < x + wdt) return false; } shown.push({ x: x, y: y, w: wdt }); return true; }
  function frame(now) {
    if (svg._globeToken !== token) return;
    var dt = Math.min(0.05, (now - last) / 1000); last = now; var t = (now - t0) / 1000;
    if (!reduce && hover < 0) rot += dt * 0.12;
    var P = nodes.map(function (n) { return project(n.p, rot); });
    var keep = hover >= 0 ? neighbours(hover) : null;
    edges.forEach(function (e, k) {
      var A = P[e[0]], B = P[e[1]], l = lineEls[k], depth = (A.z + B.z) / 2;
      var on = keep && (e[0] === hover || e[1] === hover);
      var base = e[2] * (0.18 + 0.45 * (depth + 1) / 2);
      l.setAttribute('x1', A.x); l.setAttribute('y1', A.y); l.setAttribute('x2', B.x); l.setAttribute('y2', B.y);
      l.setAttribute('stroke', on ? SKY : EDGE); l.setAttribute('stroke-width', on ? 1.8 : (e[2] >= 1 ? 0.9 : 0.6));
      l.setAttribute('opacity', keep ? (on ? 0.95 : base * 0.25) : base);
    });
    var order = nodes.map(function (n, i) { return i; }).sort(function (a, b) { return P[a].z - P[b].z; });
    order.forEach(function (i) { gN.appendChild(els[i].g); });
    shown.length = 0;
    var byDepth = order.slice().reverse();
    byDepth.forEach(function (i) {
      var n = nodes[i], q = P[i], e = els[i], front = (q.z + 1) / 2, big = n.kind === 'area', mid = n.kind === 'method';
      var r = (big ? 6.5 : mid ? 4 : 3) * q.s * (compact ? 1.3 : 1);
      e.c.setAttribute('cx', q.x); e.c.setAttribute('cy', q.y); e.c.setAttribute('r', r);
      var lit = keep && keep[i], open = n.kind === 'tool' || n.kind === 'article';
      e.c.setAttribute('fill', big ? NAVY : (lit ? SKY : (open ? '#ffffff' : INK)));
      e.c.setAttribute('stroke', big ? NAVY : (open ? SKY : INK)); e.c.setAttribute('stroke-width', '1.2');
      e.halo.setAttribute('cx', q.x); e.halo.setAttribute('cy', q.y);
      var pulse = 1 + 0.2 * Math.sin(t * 0.8 + i); e.halo.setAttribute('r', (big ? 22 : lit ? 14 : (n.kind === 'tool' ? 9 : 0)) * pulse);
      var op = keep ? (lit ? 1 : 0.12 + 0.2 * front) : (0.22 + 0.78 * front);
      e.g.setAttribute('opacity', op.toFixed(3));
      var right = q.x < CX, wdt = n.label.length * (big ? 8 : 6.4);
      var lx = q.x + (right ? -(r + 6) - wdt : r + 6);
      var want = big || lit || (!keep && !compact && q.z > (mid ? 0.55 : 0.72)) || (compact && mid && q.z > 0.6);
      var ok = want && ((lit || big) ? true : free(lx, q.y, wdt));
      if (big) free(lx, q.y, wdt);
      e.t.setAttribute('opacity', ok ? 1 : 0);
      e.t.setAttribute('text-anchor', right ? 'end' : 'start');
      e.t.setAttribute('x', q.x + (right ? -(r + 6) : r + 6)); e.t.setAttribute('y', q.y + 4);
    });
    sparks.forEach(function (s) { s.el.setAttribute('cx', s.x + Math.sin(t * s.sp + s.ph) * 10); s.el.setAttribute('cy', s.y + Math.cos(t * s.sp * 0.7 + s.ph) * 8); s.el.setAttribute('r', s.r * (1 + 0.3 * Math.sin(t * 1.3 + s.ph))); });
    waves.forEach(function (p, w) {
      var y0 = CY + R * (0.78 + w * 0.12), amp = 12 + w * 6, ph = t * 0.25 + w; var d = 'M0 ' + (y0 + 40);
      for (var x = 0; x <= W; x += 60) d += ' L' + x + ' ' + (y0 + Math.sin(x / 190 + ph) * amp);
      d += ' L' + W + ' ' + (y0 + 60) + ' Z'; p.setAttribute('d', d);
    });
    if (!reduce || hover >= 0) requestAnimationFrame(frame); else setTimeout(function () { requestAnimationFrame(frame); }, 250);
  }
  requestAnimationFrame(frame);
}

/* Lay the globe out for the screen: wide with text beside it, or tall on a phone. */
function mountGlobe(svg, D) {
  'use strict';
  var mode = null;
  function layout() {
    var narrow = window.innerWidth < 860;
    var next = narrow ? 'tall' : 'wide';
    if (next === mode) return;
    mode = next;
    document.body.classList.toggle('globe-tall', narrow);
    if (narrow) drawGlobe(svg, D, { width: 720, height: 700, radius: 250, cx: 360, cy: 330, keepOut: 0, compact: true });
    else drawGlobe(svg, D, { width: 1440, height: 620, radius: 225, cx: 900, cy: 310, keepOut: 560 });
  }
  layout();
  var timer; window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(layout, 200); });
}
