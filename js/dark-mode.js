/**
 * dark-mode.js
 * Handles the dark/light theme toggle and persists the choice in localStorage.
 * The initial theme is set by an inline <script> in <head> to avoid FOUC.
 */
(function () {
  'use strict';

  var btn = document.getElementById('themeToggle');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var root    = document.documentElement;
    var current = root.getAttribute('data-theme');
    var next    = current === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    btn.setAttribute(
      'aria-label',
      next === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
  });

  // Set initial aria-label
  var initial = document.documentElement.getAttribute('data-theme') || 'dark';
  btn.setAttribute(
    'aria-label',
    initial === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  );
})();
