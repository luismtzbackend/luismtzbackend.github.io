/**
 * interactions.js — Custom cursor, magnetic buttons, click ripple
 * and a touch of scroll parallax. Skipped entirely on touch devices
 * and when the user prefers reduced motion.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer   = window.matchMedia('(pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    /* ================= Custom cursor ================= */
    if (finePointer && !reduceMotion) {
      var dot  = document.getElementById('cursorDot');
      var glow = document.getElementById('cursorGlow');

      if (dot && glow) {
        document.documentElement.classList.add('has-custom-cursor');

        var mx = -100, my = -100;   /* actual mouse */
        var gx = -100, gy = -100;   /* lagging glow position */

        document.addEventListener('mousemove', function (e) {
          mx = e.clientX;
          my = e.clientY;
          dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
        }, { passive: true });

        function lerp(a, b, t) { return a + (b - a) * t; }
        function tick() {
          gx = lerp(gx, mx, 0.16);
          gy = lerp(gy, my, 0.16);
          glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
          requestAnimationFrame(tick);
        }
        tick();

        var HOVER_SEL = 'a, button, .btn, input, textarea, .filter-btn, .theme-toggle, .robot-mascot, [role="button"]';
        document.addEventListener('mouseover', function (e) {
          if (e.target.closest && e.target.closest(HOVER_SEL)) {
            document.documentElement.classList.add('cursor-hover');
          }
        });
        document.addEventListener('mouseout', function (e) {
          if (e.target.closest && e.target.closest(HOVER_SEL)) {
            document.documentElement.classList.remove('cursor-hover');
          }
        });
        document.addEventListener('mousedown', function () { document.documentElement.classList.add('cursor-down'); });
        document.addEventListener('mouseup',   function () { document.documentElement.classList.remove('cursor-down'); });

        document.addEventListener('mouseleave', function () {
          dot.style.opacity = '0';
          glow.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
          dot.style.opacity = '';
          glow.style.opacity = '';
        });
      }
    }

    /* ================= Magnetic buttons ================= */
    if (finePointer && !reduceMotion) {
      var magnets = document.querySelectorAll('.btn, .social-link, .filter-btn, .project-card__link');
      magnets.forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var relX = e.clientX - (r.left + r.width / 2);
          var relY = e.clientY - (r.top + r.height / 2);
          el.style.transform = 'translate(' + (relX * 0.28) + 'px,' + (relY * 0.28) + 'px)';
        });
        el.addEventListener('mouseleave', function () {
          el.style.transform = '';
        });
      });
    }

    /* ================= Click ripple on buttons ================= */
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.style.position = btn.style.position || 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', function (e) {
        var r = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.left = (e.clientX - r.left) + 'px';
        ripple.style.top  = (e.clientY - r.top) + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', function () { ripple.remove(); });
      });
    });

    /* ================= Hero scroll parallax ================= */
    if (!reduceMotion) {
      var heroImage = document.querySelector('.hero__image');
      var hero = document.getElementById('hero');
      if (heroImage && hero) {
        var ticking = false;
        window.addEventListener('scroll', function () {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(function () {
            var rect = hero.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              var progress = -rect.top / (rect.height || 1);
              heroImage.style.transform = 'translateY(' + (progress * 46) + 'px)';
            }
            ticking = false;
          });
        }, { passive: true });
      }
    }

  });
})();
