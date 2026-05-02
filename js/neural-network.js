/**
 * neural-network.js  —  Full-page animated particle network
 *
 * Features:
 *  · Fixed canvas covering the entire viewport (always visible while scrolling)
 *  · Glowing nodes with pulsing radial-gradient effect
 *  · Gradient connection lines (opacity by distance)
 *  · Mouse/touch attraction: particles near cursor drift toward it
 *  · Click burst: particles near click get a speed boost
 *  · Two-color accent system (blue + cyan) that respects dark/light theme
 *  · Pauses when tab is hidden (saves CPU)
 *  · Respects prefers-reduced-motion
 */
(function () {
  'use strict';

  /* ── Guard: no canvas or reduced motion ── */
  var canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  var ctx = canvas.getContext('2d');
  var W, H;
  var particles = [];
  var animId;
  var paused = false;

  var mouse = { x: -9999, y: -9999, radius: 160 };

  /* ── Config ── */
  var CFG = {
    baseCount:   110,   /* particles at 1920px width — scales with viewport */
    minSpeed:    0.18,
    maxSpeed:    0.52,
    minR:        1.4,
    maxR:        3.0,
    linkDist:    160,   /* max distance to draw a line */
    attract:     0.028, /* mouse attraction strength */
    maxV:        1.3,   /* max velocity after mouse influence */
    friction:    0.985, /* velocity dampening each frame */
  };

  /* ── Colour helpers ── */
  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }
  function palette() {
    return isDark()
      ? { r1: '59,130,246', r2: '34,211,238', bg: '10,15,30' }   /* blue + cyan / dark */
      : { r1: '29,78,216',  r2: '6,182,212',  bg: '232,240,254' };/* blue + cyan / light */
  }

  /* ── Resize ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Particle ── */
  function Particle(i) {
    this.id = i;
    this.spawn(true);
  }

  Particle.prototype.spawn = function (random) {
    this.x  = Math.random() * W;
    this.y  = random ? Math.random() * H : -8;
    this.vx = (Math.random() - 0.5) * (CFG.maxSpeed - CFG.minSpeed) * 2;
    this.vy = (Math.random() - 0.5) * (CFG.maxSpeed - CFG.minSpeed) * 2;
    /* enforce minimum speed */
    if (Math.abs(this.vx) < CFG.minSpeed) this.vx = CFG.minSpeed * (this.vx < 0 ? -1 : 1);
    if (Math.abs(this.vy) < CFG.minSpeed) this.vy = CFG.minSpeed * (this.vy < 0 ? -1 : 1);
    this.r     = CFG.minR + Math.random() * (CFG.maxR - CFG.minR);
    this.phase = Math.random() * Math.PI * 2;   /* pulse phase offset */
    this.speed = CFG.minSpeed + Math.random() * (CFG.maxSpeed - CFG.minSpeed);
    /* 70% primary colour, 30% secondary */
    this.col   = Math.random() < 0.7 ? 'r1' : 'r2';
    this.alpha = 0.5 + Math.random() * 0.4;
  };

  Particle.prototype.update = function (t) {
    /* Pulse radius */
    this.phase += 0.022;
    var pulse = Math.sin(this.phase) * 0.6;   /* ±0.6 px breathing */

    /* Mouse attraction */
    var dx   = mouse.x - this.x;
    var dy   = mouse.y - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius && dist > 1) {
      var force = (1 - dist / mouse.radius) * CFG.attract;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    /* Friction */
    this.vx *= CFG.friction;
    this.vy *= CFG.friction;

    /* Speed cap */
    var spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > CFG.maxV) {
      this.vx = (this.vx / spd) * CFG.maxV;
      this.vy = (this.vy / spd) * CFG.maxV;
    }
    /* Minimum drift */
    if (spd < CFG.minSpeed * 0.5) {
      this.vx += (Math.random() - 0.5) * 0.04;
      this.vy += (Math.random() - 0.5) * 0.04;
    }

    this.x += this.vx;
    this.y += this.vy;

    /* Wrap edges with small margin */
    var M = 20;
    if (this.x < -M) this.x = W + M;
    if (this.x > W + M) this.x = -M;
    if (this.y < -M) this.y = H + M;
    if (this.y > H + M) this.y = -M;

    this._drawR = this.r + pulse;   /* actual draw radius this frame */
  };

  Particle.prototype.draw = function (pal) {
    var rgb = pal[this.col];
    var r   = this._drawR;

    /* Outer glow (large soft gradient) */
    var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 5);
    grd.addColorStop(0,   'rgba(' + rgb + ',' + (this.alpha * 0.45) + ')');
    grd.addColorStop(0.4, 'rgba(' + rgb + ',' + (this.alpha * 0.18) + ')');
    grd.addColorStop(1,   'rgba(' + rgb + ',0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    /* Core bright dot */
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + rgb + ',' + this.alpha + ')';
    ctx.fill();
  };

  /* ── Draw connection line between two particles ── */
  function drawLine(a, b, pal) {
    var dx   = a.x - b.x;
    var dy   = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= CFG.linkDist) return;

    var alpha = Math.pow(1 - dist / CFG.linkDist, 1.6) * 0.55;

    /* Gradient line from particle A colour to particle B colour */
    var grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, 'rgba(' + pal[a.col] + ',' + alpha + ')');
    grad.addColorStop(1, 'rgba(' + pal[b.col] + ',' + alpha + ')');

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 0.9;
    ctx.stroke();
  }

  /* ── Main animation loop ── */
  function frame(t) {
    if (paused) return;
    animId = requestAnimationFrame(frame);

    ctx.clearRect(0, 0, W, H);

    var pal = palette();
    var n   = particles.length;

    /* Update + draw lines (O(n²) — manageable for ≤120 particles) */
    for (var i = 0; i < n; i++) {
      particles[i].update(t);
      for (var j = i + 1; j < n; j++) {
        drawLine(particles[i], particles[j], pal);
      }
    }

    /* Draw nodes on top of lines */
    for (var k = 0; k < n; k++) {
      particles[k].draw(pal);
    }
  }

  /* ── Init / rebuild particles ── */
  function init() {
    resize();
    /* Scale count proportionally to screen area vs reference 1920×1080 */
    var scale = Math.sqrt((W * H) / (1920 * 1080));
    var count = Math.round(CFG.baseCount * Math.max(0.5, Math.min(scale, 1.5)));
    particles  = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle(i));
    }
    cancelAnimationFrame(animId);
    frame(0);
  }

  /* ── Events ── */
  window.addEventListener('resize', debounce(function () {
    resize();
    particles.forEach(function (p, i) {
      /* Re-randomise position within new bounds */
      p.x = Math.random() * W;
      p.y = Math.random() * H;
    });
  }, 200), { passive: true });

  /* Mouse move (track relative to canvas = viewport) */
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  /* Touch */
  window.addEventListener('touchmove', function (e) {
    var t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  }, { passive: true });

  window.addEventListener('touchend', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  /* Click: burst — boost velocity of nearby particles */
  window.addEventListener('click', function (e) {
    particles.forEach(function (p) {
      var dx = p.x - e.clientX;
      var dy = p.y - e.clientY;
      var d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 180 && d > 0.5) {
        var force = (1 - d / 180) * 2.5;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }
    });
  }, { passive: true });

  /* Pause when tab is hidden */
  document.addEventListener('visibilitychange', function () {
    paused = document.hidden;
    if (!paused) frame(0);
  });

  /* ── Utility: debounce ── */
  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  /* ── Kick off ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
