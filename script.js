/* ============================================================
   ÁUREA — script.js
   Interacciones: menú, animaciones, contadores, FAQ, formulario
   ============================================================ */
(function () {
  "use strict";

  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Año del footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header con scroll ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById("navToggle");
  var menu = document.getElementById("menu");

  function closeMenu() {
    body.classList.remove("menu-open");
    header.classList.remove("menu-mobile-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  }
  function openMenu() {
    body.classList.add("menu-open");
    header.classList.add("menu-mobile-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Cerrar menú");
  }
  navToggle.addEventListener("click", function () {
    body.classList.contains("menu-open") ? closeMenu() : openMenu();
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 840) closeMenu();
  });

  /* ---------- Animación de aparición (reveal) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Contadores de estadísticas ---------- */
  var counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var duration = 1800;
    var start = null;

    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    function tick(now) {
      if (!start) start = now;
      var progress = Math.min((now - start) / duration, 1);
      // Curva ease-out-expo
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countIO.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ---------- Resaltado del enlace activo ---------- */
  var menuLinks = menu.querySelectorAll('.menu-list a[href^="#"]');
  var sections = Array.prototype.map.call(menuLinks, function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spyIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          menuLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach(function (sec) { spyIO.observe(sec); });
  }

  /* ---------- FAQ (acordeón) ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-question");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      // Cerrar los demás para un acordeón limpio
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Formulario de contacto ---------- */
  var form = document.getElementById("contactForm");
  var success = document.getElementById("formSuccess");
  var error = document.getElementById("formError");
  var resetBtn = document.getElementById("formReset");

  function markInvalid(field, invalid) {
    field.closest(".field").classList.toggle("has-error", invalid);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nombre = form.elements.nombre;
    var email = form.elements.email;
    var mensaje = form.elements.mensaje;
    var valid = true;

    [nombre, email, mensaje].forEach(function (field) {
      var invalid;
      if (field.type === "email") {
        invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      } else {
        invalid = field.value.trim().length < 2;
      }
      markInvalid(field, invalid);
      if (invalid) valid = false;
    });

    error.hidden = valid;
    if (!valid) return;

    // Simulación de envío (no hay backend en este demo)
    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    setTimeout(function () {
      form.hidden = true;
      success.hidden = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar mensaje <span aria-hidden="true">↗</span>';
    }, 900);
  });

  // Quitar el estado de error al escribir
  form.addEventListener("input", function (e) {
    if (e.target.matches("input, textarea")) markInvalid(e.target, false);
  });

  resetBtn.addEventListener("click", function () {
    form.reset();
    success.hidden = true;
    form.hidden = false;
  });
})();
