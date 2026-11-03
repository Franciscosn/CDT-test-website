/* CDT home page: neutron events in the wire chamber, product boxes, image changer, ring cursor. Plain JavaScript, no framework. */
(function () {
  var P = window.CDT_PRODUCTS;
  var NS = 72, NW = 15, PER = NS / 6, NSL = 5, BAND = 0.66, SW = 100 / NS;
  var G = '110,255,160', CORE = '#EEFFF3';
  var root = document.querySelector('.root');
  if (!root || !P) return;
  var $ = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

  var band = $('.kam .hs.band'), wire = $('.kam .hs.wh'), dot = $('.kam .hs.dot');
  var trk = $('.kam .trki'), trkWrap = trk.map(function (e) { return e.parentNode; });
  var nstrip = $('.cells .nx.nstrip'), nclip = $('.cells .nclip'), nspread = $('.cells .nspread');
  var cells = $('nav.cells a.cell');
  var box = root.querySelector('.imgbox');
  var prevLayer = box.children[0], prevImg = prevLayer.querySelector('img');
  var curLayer = box.querySelector('.imgw'), curImg = curLayer.querySelector('img');
  var capSpans = root.querySelector('figcaption.mcap').children;
  var ro = root.querySelector('.ro').children;
  var ring = root.querySelector('.ring');

  var st = { n: 0, last: Date.now() - 5400, lastImg: 0, ctr: [-1, -1, -1, -1, -1, -1], active: -1, imgIdx: 0, imgAnim: 'fadeA', focus: null };

  function pad(v, n) { v = String(v); while (v.length < n) v = '0' + v; return v; }
  function fit(a) { var f = a[1].split(' '); return { src: a[0], fit: f[0], pos: f.length > 1 ? f.slice(1).join(' ') : '50% 50%', bg: a[2] }; }
  function paint(layer, img, a) { var m = fit(a); layer.style.background = m.bg; img.src = m.src; img.style.objectFit = m.fit; img.style.objectPosition = m.pos; }
  function restart(el, name) { el.style.animationName = 'none'; void el.offsetWidth; el.style.animationName = name; }

  function showImage(cell, idx, prev) {
    var im = P[cell].imgs[idx];
    if (prev) paint(prevLayer, prevImg, P[prev.c].imgs[prev.i]);
    paint(curLayer, curImg, im);
    curImg.alt = im[3];
    st.imgAnim = st.imgAnim === 'fadeA' ? 'fadeB' : 'fadeA';
    restart(curLayer, st.imgAnim);
    capSpans[0].innerHTML = '<b></b> · ';
    capSpans[0].firstChild.textContent = P[cell].name;
    capSpans[0].appendChild(document.createTextNode(im[3]));
    capSpans[1].textContent = (idx + 1) + ' / ' + P[cell].imgs.length;
  }

  function setMode() { ro[0].textContent = 'LAST EVENT · ' + (st.focus !== null ? 'ONLY ' + P[st.focus].name.toUpperCase() : 'ALL PRODUCTS'); }

  function spawn() {
    var cell = st.focus;
    if (cell === null) { cell = Math.floor(Math.random() * (st.active < 0 ? 6 : 5)); if (st.active >= 0 && cell >= st.active) cell += 1; }
    var k = cell * PER + Math.floor(Math.random() * PER);
    var w = Math.floor(Math.random() * NW);
    var now = Date.now();
    st.last = now; st.n += 1;
    var j = st.n % NSL, ab = (st.n % (2 * NSL) < NSL) ? 'A' : 'B';
    var ang = Math.floor(Math.random() * 360), a = 36 + Math.floor(Math.random() * 18), b = 17 + Math.floor(Math.random() * 10);
    var left = (k * SW) + '%', width = (SW * BAND) + '%', cx = ((k + BAND / 2) * SW) + '%', top = (((w + 0.5) / NW) * 100) + '%';

    band[j].style.left = left; band[j].style.width = width; restart(band[j], 'hit' + ab);
    wire[j].style.top = top; restart(wire[j], 'hit' + ab);
    dot[j].style.left = cx; dot[j].style.top = top; restart(dot[j], 'hit' + ab);
    var tw = trkWrap[j];
    tw.style.left = cx; tw.style.top = top; tw.style.width = (a + b) + 'px'; tw.style.marginLeft = (-b) + 'px';
    tw.style.transform = 'rotate(' + ang + 'deg)'; tw.style.transformOrigin = b + 'px 50%';
    trk[j].style.transformOrigin = b + 'px 50%';
    trk[j].style.background = 'linear-gradient(90deg, rgba(' + G + ',0) 0px, rgba(' + G + ',.9) ' + (b - 2) + 'px, ' + CORE + ' ' + b + 'px, rgba(' + G + ',.9) ' + (b + 2) + 'px, rgba(' + G + ',0) ' + (a + b) + 'px)';
    restart(trk[j], 'trk' + ab);
    nstrip[j].style.left = left; nstrip[j].style.width = width; restart(nstrip[j], 'xb' + ab);
    nclip[j].style.left = (Math.floor(k / 12) * 100 / 6) + '%';
    nspread[j].style.left = (((k % 12) + BAND / 2) / 12 * 100) + '%'; restart(nspread[j], 'xa' + ab);

    ro[1].textContent = 'strip ' + pad(k + 1, 3) + ' · wire ' + pad(w + 1, 2) + ' · t = ' + (Math.random() * 70).toFixed(1) + ' µs';
    ro[2].innerHTML = '→ <span class="rop"></span>'; ro[2].lastChild.textContent = P[cell].name;

    if (cell !== st.active || now - st.lastImg >= 5700) {
      st.ctr[cell] = (st.ctr[cell] + 1) % P[cell].imgs.length;
      st.lastImg = now;
      var prev = st.active < 0 ? null : { c: st.active, i: st.imgIdx };
      st.active = cell; st.imgIdx = st.ctr[cell];
      showImage(cell, st.imgIdx, prev);
      cells.forEach(function (c, i) { c.classList.toggle('on', i === cell); });
    }
  }

  cells.forEach(function (c, i) {
    var enter = function () { if (st.focus === i) return; st.focus = i; st.last = 0; setMode(); };
    var leave = function () { st.focus = null; setMode(); };
    c.addEventListener('mouseenter', enter); c.addEventListener('focus', enter);
    c.addEventListener('mouseleave', leave); c.addEventListener('blur', leave);
  });

  setInterval(function () {
    var gap = st.focus === null ? 6000 : 1950;
    if (Date.now() - st.last >= gap) spawn();
  }, 150);

  // ring cursor and mouse light: moved directly, no re-rendering
  var kam = root.querySelector('.kam'), ks = root.querySelector('.kshine');
  var nav = root.querySelector('.cells'), ms = root.querySelector('.mshine');
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  root.addEventListener('mousemove', function (e) {
    var mx = e.clientX, my = e.clientY;
    var hv = !!(e.target && e.target.closest && e.target.closest('a,button'));
    if (fine && ring) {
      ring.style.display = 'block';
      ring.style.transform = 'translate(' + mx + 'px, ' + my + 'px) scale(' + (hv ? 1.7 : 1) + ')';
      ring.style.background = hv ? '#FF660033' : 'transparent';
    }
    if (kam && ks) { var r = kam.getBoundingClientRect(), kx = mx - r.left, ky = my - r.top, ink = kx >= 0 && ky >= 0 && kx <= r.width && ky <= r.height;
      ks.style.opacity = ink ? '1' : '0';
      if (ink) ks.style.background = 'radial-gradient(280px circle at ' + kx + 'px ' + ky + 'px, rgba(232,238,252,.32) 0%, rgba(232,238,252,.10) 45%, rgba(232,238,252,0) 72%)'; }
    if (nav && ms) { var q = nav.getBoundingClientRect(), nx = mx - q.left, ny = my - q.top, inn = nx >= 0 && ny >= 0 && nx <= q.width && ny <= q.height;
      ms.style.opacity = inn ? '1' : '0';
      if (inn) ms.style.background = 'radial-gradient(520px 190px at ' + nx + 'px ' + ny + 'px, rgba(225,235,255,.22) 0%, rgba(225,235,255,.07) 45%, rgba(225,235,255,0) 72%)'; }
  });
  root.addEventListener('mouseleave', function () { if (ring) ring.style.display = 'none'; if (ks) ks.style.opacity = '0'; if (ms) ms.style.opacity = '0'; });
  if (!fine) root.style.cursor = 'auto';
})();
