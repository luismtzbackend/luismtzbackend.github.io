/**
 * projects.js
 * Stores project data and renders cards dynamically.
 * Supports filtering by technology tag.
 */
(function () {
  'use strict';

  var PROJECTS = [
    {
      id: 1,
      icon: '🏢',
      title: 'ERP Microservices Suite',
      description:
        'Evolución de sistema monolítico a arquitectura de microservicios para gestión empresarial. ' +
        'Incluye servicios independientes de inventario, facturación y cartera con comunicación ' +
        'asíncrona mediante Apache Kafka y caching distribuido con Redis.',
      tags: ['Java 17', 'Spring Boot', 'Docker', 'MySQL', 'Redis', 'Kafka', 'JUnit'],
      github: '#',
    },
    {
      id: 2,
      icon: '🔀',
      title: 'REST API Gateway',
      description:
        'API Gateway implementado con Spring Cloud Gateway para enrutar y balancear solicitudes ' +
        'hacia microservicios internos. Incluye autenticación JWT centralizada, rate limiting, ' +
        'circuit breaker y registro dinámico de servicios con Eureka Discovery.',
      tags: ['Spring Boot', 'Spring Cloud', 'JWT', 'Eureka', 'Redis', 'Docker'],
      github: '#',
    },
    {
      id: 3,
      icon: '📦',
      title: 'Inventory Management System',
      description:
        'API REST completa para gestión de inventario con autenticación JWT, caché de consultas ' +
        'frecuentes con Redis y despliegue automatizado con Docker Compose. ' +
        'Incluye CRUD completo, paginación, búsqueda avanzada y reportes exportables en PDF.',
      tags: ['Java 17', 'Spring Boot', 'MySQL', 'Redis', 'Docker', 'JWT', 'JUnit'],
      github: '#',
    },
  ];

  /* ---- GitHub icon SVG (shared) ---- */
  var GH_ICON =
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">' +
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

  /** Build a project card element */
  function createCard(project, delayIndex) {
    var card = document.createElement('article');
    card.className = 'project-card';
    card.style.transitionDelay = (delayIndex * 0.08) + 's';
    card.dataset.tags = project.tags.join(',').toLowerCase();

    var tagsHTML = project.tags
      .map(function (t) { return '<span class="project-tag">' + escHtml(t) + '</span>'; })
      .join('');

    card.innerHTML =
      '<div class="project-card__header">' +
        '<span class="project-card__icon" aria-hidden="true">' + project.icon + '</span>' +
        '<div class="project-card__links">' +
          '<a href="' + project.github + '" target="_blank" rel="noopener noreferrer"' +
            ' class="project-card__link" aria-label="Ver ' + escHtml(project.title) + ' en GitHub">' +
            GH_ICON +
          '</a>' +
        '</div>' +
      '</div>' +
      '<h3 class="project-card__title">' + escHtml(project.title) + '</h3>' +
      '<p class="project-card__desc">' + escHtml(project.description) + '</p>' +
      '<div class="project-card__tags">' + tagsHTML + '</div>';

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