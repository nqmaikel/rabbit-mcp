/* Rabbit hero: ASCII spiral-hole scene with a rabbit silhouette + nav depth meter.
   Original artwork, procedurally generated. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.getElementById('hole');
  if (cv) {
    var ctx = cv.getContext('2d');
    var CW = 8.4, CH = 14, FS = 12;
    var RAMP = ' .\u00b7:-=+*#%@';
    var COLORS = ['#1c4a4c', '#56bfc2', '#9af0b0', '#ffd36b', '#c9d2cc'];
    var W = 0, H = 0, cols = 0, rows = 0, dpr = 1, mask = null, mouse = { x: 0, y: 0, tx: 0, ty: 0 }, ripples = [], t0 = performance.now(), visible = true, last = 0;

    function buildMask() {
      // draw a sitting rabbit (side view) into an offscreen canvas, sampled per cell
      var oc = document.createElement('canvas'); oc.width = cols; oc.height = rows;
      var o = oc.getContext('2d');
      var narrow = W < 860;
      var u = Math.min(H * 0.42, narrow ? W * 0.9 : H) / CH / 4; // rows per unit (rabbit is ~4 units tall)
      var ux = u * CH / CW; // columns per unit, keeps the aspect right
      var bx = narrow ? cols * 0.2 : cols * 0.57;
      var by = rows * (narrow ? 0.93 : 0.9);
      function el(cx, cy, rx, ry, deg) { o.beginPath(); o.ellipse(bx + cx * ux, by - cy * u, rx * ux, ry * u, -(deg || 0) * Math.PI / 180, 0, 7); o.fill(); }
      o.fillStyle = '#fff';
      el(-0.1, 1.0, 1.0, 0.75, 35);   // body
      el(-0.3, 0.75, 0.62, 0.62);     // haunch
      el(0.95, 2.0, 0.5, 0.42, -10);  // head
      el(1.4, 1.85, 0.22, 0.17);      // muzzle
      el(0.55, 3.05, 0.14, 0.8, 14);  // ear
      el(0.9, 3.1, 0.14, 0.8, -8);    // ear
      el(-1.0, 0.9, 0.22, 0.22);      // tail
      el(0.9, 0.55, 0.16, 0.55, 10);  // foreleg
      el(1.05, 0.08, 0.4, 0.1);       // paw
      el(0.0, 0.08, 0.8, 0.12);       // foot
      var d = o.getImageData(0, 0, cols, rows).data;
      mask = new Uint8Array(cols * rows);
      for (var i = 0; i < mask.length; i++) mask[i] = d[i * 4 + 3] > 110 ? 1 : 0;
    }

    function resize() {
      var r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cols = Math.ceil(W / CW); rows = Math.ceil(H / CH);
      buildMask();
      draw(performance.now());
    }

    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#07090b'; ctx.fillRect(0, 0, W, H);
      ctx.font = '500 ' + FS + 'px "Geist Mono", ui-monospace, monospace';
      ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      var narrow = W < 860;
      var cx = narrow ? W * 0.58 : W * 0.76, cy = narrow ? H * 0.46 : H * 0.38;
      var R = (narrow ? Math.min(W * 0.46, H * 0.4) : Math.min(H * 0.32, W * 0.2));
      mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
      var buckets = [];
      for (var k = 0; k < COLORS.length * RAMP.length; k++) buckets.push(null);
      var live = [];
      for (var q = 0; q < ripples.length; q++) { var age = t - ripples[q].t; if (age < 3.2) live.push(ripples[q]); }
      ripples = live;
      for (var j = 0; j < rows; j++) {
        var py = (j + 0.5) * CH;
        for (var i = 0; i < cols; i++) {
          var px = (i + 0.5) * CW, ci = 0, v = 0;
          if (mask[j * cols + i]) {
            var sh = 0.55 + 0.45 * Math.sin(i * 0.5 + j * 0.9 + t * 1.5);
            v = 0.75 + 0.2 * sh; ci = 4;
            var hh = Math.sin(i * 91.7 + j * 31.3) * 4375.5; hh -= Math.floor(hh); var gi = hh > 0.5 ? 10 : (hh > 0.15 ? 9 : 8);
            var key = ci * RAMP.length + gi; (buckets[key] || (buckets[key] = [])).push(px, py); continue;
          }
          var dx = px - cx, dy = py - cy;
          var r0 = Math.hypot(dx, dy), u0 = r0 / R;
          // parallax: the deeper, the more it follows the pointer
          var dpt = Math.max(0, 1 - u0);
          dx -= mouse.x * dpt * R * 0.28; dy -= mouse.y * dpt * R * 0.28;
          var r = Math.hypot(dx, dy), uu = r / R, th = Math.atan2(dy, dx);
          if (uu < 1.0) {
            var z = 1 / (uu + 0.09);
            var band = Math.pow(0.5 + 0.5 * Math.sin(z * 2.2 - t * 1.5 + th * 2), 3);
            var edge = Math.exp(-Math.pow((uu - 0.96) / 0.05, 2));
            v = Math.pow(uu, 0.7) * (0.08 + 0.8 * band) * 0.8 + edge * 0.55;
            ci = v > 0.55 ? 2 : (v > 0.25 ? 1 : 0);
            if (uu < 0.1) v *= 0.2;
          } else {
            var fall = Math.exp(-(uu - 1) * 2.6);
            var n = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; n -= Math.floor(n);
            var rings = 0.5 + 0.5 * Math.sin((r - t * 18) * 0.05);
            v = fall * (0.1 + 0.18 * rings) * (n > 0.3 ? 1 : 0.3);
            ci = 0; if (uu > 1 && uu < 1.12) { v += 0.35; ci = 2; }
          }
          for (var m = 0; m < ripples.length; m++) {
            var ag = t - ripples[m].t, rr = ag * 520, rd = Math.hypot(px - ripples[m].x, py - ripples[m].y);
            var g = Math.exp(-Math.pow((rd - rr) / 26, 2)) * (1 - ag / 3.2);
            if (g > 0.05) { v += g * 0.8; ci = 3; }
          }
          if (v < 0.07) continue;
          if (v > 1) v = 1;
          var gi2 = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          if (gi2 < 1) continue;
          var key2 = ci * RAMP.length + gi2; (buckets[key2] || (buckets[key2] = [])).push(px, py);
        }
      }
      for (var b = 0; b < buckets.length; b++) {
        var arr = buckets[b]; if (!arr) continue;
        var cidx = Math.floor(b / RAMP.length), gidx = b % RAMP.length;
        ctx.fillStyle = COLORS[cidx]; ctx.globalAlpha = cidx === 4 ? 0.95 : Math.min(0.85, 0.2 + gidx / RAMP.length * 0.7);
        var ch = RAMP.charAt(gidx);
        for (var p = 0; p < arr.length; p += 2) ctx.fillText(ch, arr[p], arr[p + 1]);
      }
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      requestAnimationFrame(loop);
      if (!visible || reduce) return;
      if (now - last < 33) return; last = now;
      draw(now);
    }
    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(cv); else window.addEventListener('resize', resize);
    if (window.IntersectionObserver) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(cv);
    cv.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.7) * 2.2; mouse.ty = ((e.clientY - r.top) / r.height - 0.4) * 2.2;
    });
    cv.addEventListener('pointerdown', function (e) {
      var r = cv.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: (performance.now() - t0) / 1000 });
      var s = document.getElementById('status'); if (s) s.textContent = 'ripple';
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
    resize();
    requestAnimationFrame(loop);
  }

  // nav depth meter: waveform that grows with scroll depth
  var ek = document.getElementById('ekg'), dv = document.getElementById('depth');
  if (ek) {
    var c = ek.getContext('2d'), tt = 0, depth = 0;
    function maxScroll() { return Math.max(1, document.documentElement.scrollHeight - innerHeight); }
    function tick() {
      requestAnimationFrame(tick);
      if (reduce && tt) return;
      tt += 0.04;
      var target = (scrollY / maxScroll()) * 12 + 0.4;
      depth += (target - depth) * 0.08;
      if (dv) dv.textContent = depth.toFixed(1);
      var w = ek.width, h = ek.height; c.clearRect(0, 0, w, h);
      c.lineWidth = 2; c.strokeStyle = '#9af0b0'; c.beginPath();
      var amp = 4 + depth * 1.2;
      for (var x = 0; x < w; x++) {
        var ph = x / w * 6.28 * 3 - tt * 3;
        var y = h / 2 + Math.sin(ph) * amp * (0.4 + 0.6 * Math.sin(x / w * 3.14)) + (Math.abs(((x + tt * 40) % 60) - 30) < 3 ? -10 : 0);
        x ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.stroke();
      c.fillStyle = '#ffd36b'; c.fillRect(w * Math.min(0.98, depth / 12.4), 6, 3, h - 12);
    }
    tick();
  }
})();
