/**
 * code-rain.js — Matrix-style falling code backdrop.
 * Sits behind the neural network canvas; adds a programming-glyph
 * rain (binary, brackets, keywords) that theme-adapts and respects
 * prefers-reduced-motion.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('codeRainCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  var ctx = canvas.getContext('2d');
  var W, H;
  var columns = [];
  var animId;
  var paused = false;

  var GLYPHS = '01{}<>/;=+-*#$%&()[]λ'.split('');
  var FONT_SIZE = 15;
  var COL_WIDTH = 16;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }
  function palette() {
    return isDark()
      ? { glyph: '56,189,248', head: '224,242,254', fade: '10,15,30' }
      : { glyph: '29,78,216',  head: '15,23,42',    fade: '232,240,254' };
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    var count = Math.ceil(W / COL_WIDTH);
    columns = [];
    for (var i = 0; i < count; i++) {
      columns.push({
        y: Math.random() * -H,
        speed: 0.6 + Math.random() * 1.6,
        next: Math.random() * 40,
      });
    }
  }

  function randomGlyph() {
    return GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }

  function frame() {
    if (paused) return;
    animId = requestAnimationFrame(frame);

    var pal = palette();

    /* Trailing fade — translucent rect over previous frame */
    ctx.fillStyle = 'rgba(' + pal.fade + ',0.16)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = FONT_SIZE + 'px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';

    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      var x = i * COL_WIDTH;

      /* Leading (bright) glyph */
      ctx.fillStyle = 'rgba(' + pal.head + ',0.85)';
      ctx.fillText(randomGlyph(), x, col.y);

      /* Trailing glyphs, fainter with distance */
      for (var t = 1; t <= 4; t++) {
        var alpha = 0.45 - t * 0.09;
        if (alpha <= 0) break;
        ctx.fillStyle = 'rgba(' + pal.glyph + ',' + alpha + ')';
        ctx.fillText(randomGlyph(), x, col.y - t * FONT_SIZE);
      }

      col.y += col.speed;
      if (col.y > H + FONT_SIZE * 5) {
        col.y = Math.random() * -200;
        col.speed = 0.6 + Math.random() * 1.6;
      }
    }
  }

  function init() {
    resize();
    /* Prime the canvas with an opaque base so the first trailing-fade pass looks right */
    var pal = palette();
    ctx.fillStyle = 'rgba(' + pal.fade + ',1)';
    ctx.fillRect(0, 0, W, H);
    cancelAnimationFrame(animId);
    frame();
  }

  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  window.addEventListener('resize', debounce(init, 220), { passive: true });

  document.addEventListener('visibilitychange', function () {
    paused = document.hidden;
    if (!paused) frame();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
