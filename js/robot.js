/**
 * robot.js — Animated robot mascot.
 * Eye tracking, section messages, speech bubble.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var robot   = document.getElementById('robotMascot');
    if (!robot) return;

    var pupilL  = document.getElementById('pupil-group-left');
    var pupilR  = document.getElementById('pupil-group-right');
    var bubble  = document.getElementById('robotBubble');
    var bubText = document.getElementById('robotBubbleText');
    var svgEl   = robot.querySelector('.robot-svg');

    if (!pupilL || !pupilR || !bubble || !svgEl) return;

    /* ---- Smooth eye tracking (lerp) ---- */
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var cx = mx, cy = my;

    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      cx = lerp(cx, mx, 0.09);
      cy = lerp(cy, my, 0.09);

      var rect  = robot.getBoundingClientRect();
      var scale = svgEl.clientWidth / 100;           /* viewBox width = 100 */

      /* Robotboy left-eye centre: SVG cx=37, cy=42 */
      var lx = rect.left + 37 * scale;
      var ly = rect.top  + 42 * scale;

      var dx = cx - lx;
      var dy = cy - ly;
      var d  = Math.sqrt(dx * dx + dy * dy);
      var a  = Math.atan2(dy, dx);
      var t  = Math.min(d / 260, 1);
      var ox = Math.cos(a) * 3.5 * t;
      var oy = Math.sin(a) * 3.5 * t;

      pupilL.style.transform = 'translate(' + ox + 'px,' + oy + 'px)';
      pupilR.style.transform = 'translate(' + ox + 'px,' + oy + 'px)';
      requestAnimationFrame(tick);
    }
    tick();

    /* ---- Speech bubble ---- */
    var MSGS = {
      hero:       '¡Hola! 👋',
      about:      'Encantado 🤝',
      skills:     'Tech stack 💻',
      projects:   '¡Mis proyectos! 🚀',
      experience: 'Trayectoria 📈',
      contact:    '¡Escríbeme! 📨',
    };
    var bubTimer;

    function showBubble(msg, ms) {
      clearTimeout(bubTimer);
      bubText.textContent = msg;
      bubble.classList.add('visible');
      bubTimer = setTimeout(function () {
        bubble.classList.remove('visible');
      }, ms || 2200);
    }

    /* Show bubble when a section enters viewport */
    if ('IntersectionObserver' in window) {
      var sObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var m = MSGS[e.target.id];
            if (m) showBubble(m, 2000);
          }
        });
      }, { threshold: 0.45 });
      document.querySelectorAll('section[id]').forEach(function (s) { sObs.observe(s); });
    }

    /* Click / hover on robot */
    robot.addEventListener('mouseenter', function () { showBubble('¡Hola! 🤖', 2800); });
    robot.addEventListener('click', function () {
      var msgs = ['¡Estoy aquí! 🤖', 'Backend rules 💪', 'Java is love ☕', '01001000 01001001'];
      showBubble(msgs[Math.floor(Math.random() * msgs.length)], 2500);
    });

    /* Reduce motion support */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      robot.classList.add('no-motion');
    }
  });
})();
