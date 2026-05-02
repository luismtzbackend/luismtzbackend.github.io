/**
 * main.js
 * Handles: navbar scroll/active-link, hamburger menu,
 * IntersectionObserver scroll animations, back-to-top,
 * contact form submission, and footer year.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- Footer year ---- */
    var yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- Navbar: scroll shadow + active link ---- */
    var navbar   = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');

    function onScroll() {
      /* Shadow when scrolled */
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      /* Highlight current section in nav */
      var current = '';
      sections.forEach(function (sec) {
        if (window.scrollY >= sec.offsetTop - 90) {
          current = sec.id;
        }
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });

      /* Back-to-top visibility */
      var btt = document.getElementById('backToTop');
      if (btt) btt.classList.toggle('visible', window.scrollY > 380);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* run once on load */

    /* ---- Hamburger menu ---- */
    var hamburger       = document.getElementById('hamburger');
    var navLinksWrapper = document.getElementById('navLinks');

    if (hamburger && navLinksWrapper) {
      hamburger.addEventListener('click', function () {
        var isOpen = hamburger.classList.toggle('open');
        navLinksWrapper.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
      });

      /* Close on link click (mobile) */
      navLinksWrapper.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('open');
          navLinksWrapper.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* ---- Intersection Observer: scroll-triggered fade-ins ---- */
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
      );

      document.querySelectorAll('.fade-in').forEach(function (el) {
        observer.observe(el);
      });

      /* Also observe project cards injected after DOMContentLoaded */
      var projectsGrid = document.getElementById('projectsGrid');
      if (projectsGrid) {
        var mutObs = new MutationObserver(function (mutations) {
          mutations.forEach(function (m) {
            m.addedNodes.forEach(function (node) {
              if (node.nodeType === 1 && node.classList.contains('project-card')) {
                observer.observe(node);
              }
            });
          });
        });
        mutObs.observe(projectsGrid, { childList: true });
      }
    } else {
      /* Fallback: show everything immediately */
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
    }

    /* ---- Contact form (Formspree) ---- */
    var form       = document.getElementById('contactForm');
    var formStatus = document.getElementById('formStatus');
    var submitBtn  = document.getElementById('submitBtn');

    if (form && formStatus && submitBtn) {
      var originalBtnHTML = submitBtn.innerHTML;

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* Basic client-side validation */
        var inputs = form.querySelectorAll('[required]');
        var valid  = true;
        inputs.forEach(function (inp) {
          if (!inp.value.trim()) { valid = false; inp.focus(); }
        });
        if (!valid) {
          setStatus('Por favor, completa todos los campos.', 'error');
          return;
        }

        submitBtn.disabled   = true;
        submitBtn.textContent = 'Enviando…';
        setStatus('', '');

        fetch(form.action, {
          method:  'POST',
          body:    new FormData(form),
          headers: { 'Accept': 'application/json' },
        })
          .then(function (res) {
            if (res.ok) {
              setStatus('¡Mensaje enviado! Te responderé a la brevedad.', 'success');
              form.reset();
            } else {
              return res.json().then(function (data) {
                throw new Error(data.error || 'Error del servidor');
              });
            }
          })
          .catch(function () {
            setStatus(
              'Error al enviar. Escríbeme directamente a luisgmartinez.engineer@gmail.com',
              'error'
            );
          })
          .finally(function () {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          });
      });

      function setStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className   = 'form-status' + (type ? ' ' + type : '');
      }
    }

    /* ---- Smooth scroll for in-page anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

  }); /* end DOMContentLoaded */
})();
