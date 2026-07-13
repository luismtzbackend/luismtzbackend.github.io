/**
 * terminal.js — Typewriter effect for the hero terminal window.
 * Purely decorative (aria-hidden); the same info exists as real
 * text elsewhere in the page for screen readers.
 */
(function () {
  'use strict';

  var out = document.getElementById('terminalOutput');
  if (!out) return;

  var PROMPT = 'luis@backend:~$ ';

  var SCRIPT = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'result', text: 'Luis Gustavo Martínez Herrera · Backend Developer' },
    { type: 'cmd',    text: 'cat stack.txt' },
    { type: 'result', text: 'Java 8/11/17/21 · Spring Boot · Microservicios · AWS · Docker' },
    { type: 'cmd',    text: 'status --check' },
    { type: 'ok',     text: '[OK] 3+ años de experiencia backend' },
    { type: 'ok',     text: '[OK] APIs REST en producción' },
    { type: 'ok',     text: '[OK] Disponible para nuevos proyectos' },
  ];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderStatic() {
    out.textContent = SCRIPT.map(function (line) {
      return (line.type === 'cmd' ? PROMPT : '') + line.text;
    }).join('\n');
  }

  if (reduceMotion) {
    renderStatic();
    return;
  }

  var TYPE_SPEED  = 34;  /* ms per character */
  var LINE_PAUSE  = 260; /* ms between lines */
  var LOOP_PAUSE  = 3400;/* ms after the full script finishes, before retyping */

  function makeLineEl(line) {
    var span = document.createElement('span');
    span.className = 'term-line term-line--' + line.type;
    return span;
  }

  function typeLine(line, done) {
    var el = makeLineEl(line);
    out.appendChild(el);

    var prefix = line.type === 'cmd' ? PROMPT : '';
    var full = prefix + line.text;
    var i = 0;

    var cursor = document.createElement('span');
    cursor.className = 'term-cursor';

    (function step() {
      if (i <= full.length) {
        el.textContent = full.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(step, TYPE_SPEED);
      } else {
        cursor.remove();
        setTimeout(done, LINE_PAUSE);
      }
    })();
  }

  function typeScript(index) {
    if (index >= SCRIPT.length) {
      setTimeout(function () {
        out.textContent = '';
        typeScript(0);
      }, LOOP_PAUSE);
      return;
    }
    typeLine(SCRIPT[index], function () { typeScript(index + 1); });
  }

  /* Only run the animation while the terminal is in view */
  if ('IntersectionObserver' in window) {
    var started = false;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !started) {
          started = true;
          typeScript(0);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(out);
  } else {
    typeScript(0);
  }
})();
