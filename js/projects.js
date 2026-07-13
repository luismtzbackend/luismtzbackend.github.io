/**
 * projects.js
 * Stores project data and renders cards dynamically as
 * faux code-editor windows. Supports filtering by technology tag.
 */
(function () {
  'use strict';

  var PROJECTS = [
    {
      id: 1,
      icon: '🏦',
      file: 'PQRService.java',
      class: 'PQRService',
      title: 'Sistema PQR — Entidad Financiera',
      description:
        'Microservicios para la gestión de Peticiones, Quejas y Reclamos (PQR) de una entidad ' +
        'financiera. Seguridad con JWT y Spring Security, persistencia en PostgreSQL con caché ' +
        'de consultas en Redis, y despliegue en AWS mediante contenedores Docker.',
      tags: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
      github: '#',
    },
    {
      id: 2,
      icon: '🏠',
      file: 'PropertyRentalService.java',
      class: 'PropertyRentalService',
      title: 'Administración y Alquiler de Propiedades',
      description:
        'Suite de microservicios para la administración y alquiler de propiedades: gestión de ' +
        'inmuebles, reservas y disponibilidad en tiempo real. Despliegue en la nube orquestado ' +
        'con Kubernetes y Docker sobre AWS.',
      tags: ['Java', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'MySQL'],
      github: '#',
    },
    {
      id: 3,
      icon: '📅',
      file: 'BookingApiService.java',
      class: 'BookingApiService',
      title: 'Plataforma de Reservas',
      description:
        'Diseño e implementación de APIs REST para una plataforma de reservas, con integración ' +
        'de bases de datos y colaboración estrecha con el equipo frontend en React para exponer ' +
        'los datos consumidos por la interfaz.',
      tags: ['Java', 'Spring Boot', 'REST', 'MySQL', 'React'],
      github: '#',
    },
    {
      id: 4,
      icon: '📱',
      file: 'ImeiRegistrySupport.java',
      class: 'ImeiRegistrySupport',
      title: 'Base de Datos Nacional de IMEIs',
      description:
        'Mantenimiento y soporte de aplicaciones Java sobre servidores Linux para la base de ' +
        'datos nacional de IMEIs de Colombia. Consultas SQL avanzadas, resolución de incidencias ' +
        'y optimización de procesos en producción.',
      tags: ['Java', 'SQL', 'Linux'],
      github: '#',
    },
  ];

  /* ---- GitHub icon SVG (shared) ---- */
  var GH_ICON =
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387' +
    '.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416' +
    '-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729' +
    ' 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997' +
    '.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931' +
    ' 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0' +
    ' 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404' +
    ' 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23' +
    '.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221' +
    ' 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293' +
    'c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386' +
    ' 0-6.627-5.373-12-12-12z"/></svg>';

  /** One "line" of the faux source file: a line-number + highlighted content */
  function codeLine(num, innerHTML, extraClass) {
    return (
      '<div class="project-card__line' + (extraClass ? ' ' + extraClass : '') + '">' +
        '<span class="project-card__lineno">' + num + '</span>' +
        '<span class="project-card__code-text">' + innerHTML + '</span>' +
      '</div>'
    );
  }

  /** Build a project card element styled as a code-editor window */
  function createCard(project, delayIndex) {
    var card = document.createElement('article');
    card.className = 'project-card';
    card.style.transitionDelay = (delayIndex * 0.08) + 's';
    card.dataset.tags = project.tags.join(',').toLowerCase();

    var tagsHTML = project.tags
      .map(function (t) { return '<span class="tok-string">"' + escHtml(t) + '"</span>'; })
      .join('<span class="tok-punct">, </span>');

    var linkHTML = (project.github && project.github !== '#')
      ? '<a href="' + project.github + '" target="_blank" rel="noopener noreferrer"' +
          ' class="project-card__link" aria-label="Ver ' + escHtml(project.title) + ' en GitHub">' +
          GH_ICON +
        '</a>'
      : '<span class="project-card__private">privado</span>';

    var lines =
      codeLine(1,
        '<span class="tok-comment">// ' + project.icon + ' ' + escHtml(project.title) + '</span>') +
      codeLine(2,
        '<span class="tok-kw">public class</span> <span class="tok-class">' + escHtml(project.class) +
        '</span> <span class="tok-kw">implements</span> <span class="tok-class">Project</span> <span class="tok-punct">{</span>') +
      codeLine(3,
        '<span class="tok-comment">/** ' + escHtml(project.description) + ' */</span>',
        'project-card__line--desc') +
      codeLine(4,
        '&nbsp;&nbsp;<span class="tok-annotation">@Stack</span><span class="tok-punct">(</span>' + tagsHTML + '<span class="tok-punct">)</span>') +
      codeLine(5, '<span class="tok-punct">}</span>');

    card.innerHTML =
      '<div class="project-card__titlebar">' +
        '<span class="terminal-dot terminal-dot--r"></span>' +
        '<span class="terminal-dot terminal-dot--y"></span>' +
        '<span class="terminal-dot terminal-dot--g"></span>' +
        '<span class="project-card__filename">' + escHtml(project.file) + '</span>' +
        '<div class="project-card__links">' + linkHTML + '</div>' +
      '</div>' +
      '<div class="project-card__code">' + lines + '</div>';

    return card;
  }

  /** Render (or re-render) the projects grid, optionally filtered */
  function renderProjects(filter) {
    var grid = document.getElementById('projectsGrid');
    if (!grid) return;

    var list = filter === 'all'
      ? PROJECTS
      : PROJECTS.filter(function (p) {
          return p.tags.some(function (t) {
            return t.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
          });
        });

    /* Clear previous content */
    grid.innerHTML = '';

    if (list.length === 0) {
      var msg = document.createElement('p');
      msg.className = 'no-projects';
      msg.textContent = 'No hay proyectos con ese filtro.';
      grid.appendChild(msg);
      return;
    }

    list.forEach(function (project, idx) {
      var card = createCard(project, idx);
      grid.appendChild(card);
      /* Trigger animation after paint */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          card.classList.add('visible');
        });
      });
    });
  }

  /** Wire up filter buttons */
  function initFilters() {
    var bar = document.getElementById('filterBar');
    if (!bar) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;

      bar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  }

  /** Minimal HTML-escape to prevent XSS in injected content */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderProjects('all');
    initFilters();
  });
})();
