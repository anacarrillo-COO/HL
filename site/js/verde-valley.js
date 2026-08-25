/* ==========================================================================
   VERDE VALLEY CLEANING SERVICES — SITE SCRIPT
   Paste this whole file into your builder's Custom Code / footer script area
   (load it at the end of the body, or with "defer"). Pairs with
   verde-valley.css. Every feature checks the element exists before binding,
   so it's safe to paste even if a page only has some of these sections.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.querySelector(".vv-root") || document;

  /* ---- small helpers ---- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }

  /* Fires a GA4 / Meta Pixel event if those libraries are present on the
     page. Safe no-op otherwise. Wire your buttons to this once you've
     added Google Analytics / Meta Pixel via your builder's integrations. */
  function vvTrack(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
      if (typeof window.fbq === "function") window.fbq("trackCustom", name, params || {});
    } catch (e) { /* tracking should never break the page */ }
  }
  window.vvTrackEvent = vvTrack;

  /* --------------------------------------------------------------------
     Sticky header shadow on scroll
     -------------------------------------------------------------------- */
  (function stickyHeader() {
    var header = $(".vv-header");
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }
    on(window, "scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* --------------------------------------------------------------------
     Mobile menu
     -------------------------------------------------------------------- */
  (function mobileMenu() {
    var toggle = $(".vv-nav-toggle");
    var menu = $(".vv-mobile-menu");
    if (!toggle || !menu) return;

    function close() {
      root.classList.remove("vv-menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
      root.classList.add("vv-menu-open");
      toggle.setAttribute("aria-expanded", "true");
    }
    on(toggle, "click", function () {
      root.classList.contains("vv-menu-open") ? close() : open();
    });
    $all("a", menu).forEach(function (a) { on(a, "click", close); });
    on(document, "keydown", function (e) { if (e.key === "Escape") close(); });
  })();

  /* --------------------------------------------------------------------
     Smooth scroll for on-page anchor links
     -------------------------------------------------------------------- */
  (function smoothScroll() {
    $all('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      on(a, "click", function (e) {
        var target = $(id);
        if (!target) return;
        e.preventDefault();
        var headerEl = $(".vv-header");
        var offset = headerEl ? headerEl.offsetHeight + 12 : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  })();

  /* --------------------------------------------------------------------
     Reveal-on-scroll
     -------------------------------------------------------------------- */
  (function reveal() {
    var items = $all(".vv-reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* --------------------------------------------------------------------
     FAQ accordion (single-open)
     -------------------------------------------------------------------- */
  (function faq() {
    var items = $all(".vv-faq-item");
    if (!items.length) return;
    items.forEach(function (item) {
      var q = $(".vv-faq-q", item);
      if (!q) return;
      on(q, "click", function () {
        var wasOpen = item.classList.contains("is-open");
        items.forEach(function (i) {
          i.classList.remove("is-open");
          var btn = $(".vv-faq-q", i);
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          item.classList.add("is-open");
          q.setAttribute("aria-expanded", "true");
        }
      });
    });
  })();

  /* --------------------------------------------------------------------
     Testimonials carousel — dots, arrows, autoplay, swipe
     -------------------------------------------------------------------- */
  (function testimonials() {
    var wrap = $(".vv-testimonials");
    if (!wrap) return;
    var track = $(".vv-testi-track", wrap);
    var slides = $all(".vv-testi-slide", wrap);
    var dotsWrap = $(".vv-testi-dots", wrap);
    var prevBtn = $(".vv-testi-prev", wrap);
    var nextBtn = $(".vv-testi-next", wrap);
    if (!track || slides.length < 2) return;

    var index = 0;
    var autoplayMs = 6000;
    var timer = null;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var d = document.createElement("button");
        d.className = "vv-testi-dot" + (i === 0 ? " is-active" : "");
        d.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        on(d, "click", function () { goTo(i); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restart();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(next, autoplayMs);
    }

    on(nextBtn, "click", next);
    on(prevBtn, "click", prev);
    on(wrap, "mouseenter", function () { clearInterval(timer); });
    on(wrap, "mouseleave", restart);

    /* touch swipe */
    var startX = null;
    on(track, "touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    on(track, "touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      startX = null;
    });

    render();
    restart();
  })();

  /* --------------------------------------------------------------------
     Before / After drag slider (component ready for real photo pairs)
     -------------------------------------------------------------------- */
  (function beforeAfter() {
    $all(".vv-ba").forEach(function (el) {
      var after = $(".vv-ba-after", el);
      var handle = $(".vv-ba-handle", el);
      if (!after || !handle) return;
      var dragging = false;

      function setPos(clientX) {
        var rect = el.getBoundingClientRect();
        var pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
        after.style.clipPath = "inset(0 0 0 " + pct + "%)";
        handle.style.left = pct + "%";
      }
      function move(e) {
        if (!dragging) return;
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        setPos(x);
      }
      function stop() { dragging = false; }

      on(el, "pointerdown", function (e) { dragging = true; setPos(e.clientX); });
      on(window, "pointermove", move);
      on(window, "pointerup", stop);
      on(el, "touchstart", function (e) { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
      on(window, "touchmove", move, { passive: true });
      on(window, "touchend", stop);
    });
  })();

  /* --------------------------------------------------------------------
     Gallery lightbox
     -------------------------------------------------------------------- */
  (function lightbox() {
    var triggers = $all("[data-vv-lightbox]");
    var box = $(".vv-lightbox");
    if (!triggers.length || !box) return;
    var img = $("img", box);
    var closeBtn = $(".vv-lightbox-close", box);
    var prevBtn = $(".vv-lightbox-prev", box);
    var nextBtn = $(".vv-lightbox-next", box);
    var sources = triggers.map(function (t) { return t.getAttribute("data-vv-lightbox") || $("img", t).src; });
    var current = 0;

    function show(i) {
      current = (i + sources.length) % sources.length;
      img.src = sources[current];
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
    }
    function close() {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
    }
    triggers.forEach(function (t, i) { on(t, "click", function () { show(i); }); });
    on(closeBtn, "click", close);
    on(box, "click", function (e) { if (e.target === box) close(); });
    on(prevBtn, "click", function () { show(current - 1); });
    on(nextBtn, "click", function () { show(current + 1); });
    on(document, "keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  })();

  /* --------------------------------------------------------------------
     Floating labels: keep <select> label state in sync (inputs/textareas
     use the CSS :placeholder-shown trick, selects need a JS assist)
     -------------------------------------------------------------------- */
  (function selectLabels() {
    $all(".vv-field select").forEach(function (sel) {
      function sync() { sel.classList.toggle("has-value", !!sel.value); }
      on(sel, "change", sync);
      sync();
    });
  })();

  /* --------------------------------------------------------------------
     Quote / contact form
     - Honeypot spam check
     - Basic required-field validation
     - Sends the visitor straight to WhatsApp with a pre-filled message
       (matches the "message us on WhatsApp" flow). If you'd rather post
       to your builder's native form handler / your own backend, remove
       this handler and let the form submit normally — the markup and
       styling stay the same either way.
     -------------------------------------------------------------------- */
  (function quoteForm() {
    var form = $("[data-vv-quote-form]");
    if (!form) return;
    var status = $(".vv-form-status", form);
    var whatsappNumber = form.getAttribute("data-vv-whatsapp") || "19288991002";

    function setStatus(msg, type) {
      if (!status) return;
      status.textContent = msg;
      status.className = "vv-form-status is-visible " + (type === "error" ? "is-error" : "is-success");
    }

    on(form, "submit", function (e) {
      e.preventDefault();

      var honeypot = form.querySelector('input[name="company"]');
      if (honeypot && honeypot.value) return; // bot caught by honeypot, fail silently

      var data = {};
      $all("input, select, textarea", form).forEach(function (f) {
        if (f.name) data[f.name] = f.value.trim();
      });

      var required = ["name", "phone", "service"];
      var missing = required.filter(function (key) { return !data[key]; });
      if (missing.length) {
        setStatus("Please fill in your name, phone, and the service you need.", "error");
        return;
      }

      var lines = [
        "New quote request from verdevalleycleaners.com",
        "Name: " + data.name,
        "Phone: " + data.phone,
        data.email ? "Email: " + data.email : null,
        data.service ? "Service: " + data.service : null,
        data.property ? "Property type: " + data.property : null,
        data.message ? "Notes: " + data.message : null
      ].filter(Boolean);

      var url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(lines.join("\n"));
      vvTrack("generate_lead", { method: "whatsapp_form" });
      setStatus("Opening WhatsApp with your request…", "success");
      window.open(url, "_blank", "noopener");
      form.reset();
      $all(".vv-field select", form).forEach(function (s) { s.classList.remove("has-value"); });
    });
  })();

  /* --------------------------------------------------------------------
     WhatsApp / call click tracking (fires only if GA4 or Meta Pixel exist)
     -------------------------------------------------------------------- */
  (function ctaTracking() {
    $all('a[href^="https://wa.me"], a[data-vv-whatsapp]').forEach(function (a) {
      on(a, "click", function () { vvTrack("contact", { method: "whatsapp" }); });
    });
    $all('a[href^="tel:"]').forEach(function (a) {
      on(a, "click", function () { vvTrack("contact", { method: "phone" }); });
    });
  })();

  /* --------------------------------------------------------------------
     Footer year
     -------------------------------------------------------------------- */
  (function year() {
    var el = $("[data-vv-year]");
    if (el) el.textContent = new Date().getFullYear();
  })();
})();
