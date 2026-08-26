/* ==========================================================================
   POE HEIGHTS — SITE SCRIPT
   Paste this whole file into GoHighLevel's Custom Code (footer / "before
   </body>") area for every page that uses this design. Pairs with
   poe-heights.css. Every feature checks the element exists before binding,
   so it's safe to paste even if a page only has some of these sections
   (e.g. a service detail page has no quote form).
   ========================================================================== */
(function () {
  "use strict";

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }

  /* --------------------------------------------------------------------
     Sticky header background on scroll
     -------------------------------------------------------------------- */
  (function stickyHeader() {
    var header = $(".ph-header");
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle("ph-scrolled", window.scrollY > 40);
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
    var burger = $(".ph-burger");
    var menu = $(".ph-mobile-menu");
    var close = $(".ph-mobile-close");
    if (!burger || !menu) return;
    on(burger, "click", function () { menu.classList.add("ph-open"); });
    on(close, "click", function () { menu.classList.remove("ph-open"); });
    $all("a", menu).forEach(function (a) {
      on(a, "click", function () { menu.classList.remove("ph-open"); });
    });
  })();

  /* --------------------------------------------------------------------
     Reveal-on-scroll — progressive enhancement only.
     Elements are visible by default in CSS; this only adds the fade/slide
     effect once IntersectionObserver is available. If this script never
     runs (blocked, slow network, GHL preview quirks), content stays
     visible instead of being stuck hidden.
     -------------------------------------------------------------------- */
  (function reveal() {
    var items = $all(".ph-reveal");
    if (!items.length || !("IntersectionObserver" in window)) return;
    items.forEach(function (el) { el.classList.add("ph-pre"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("ph-is-visible");
          entry.target.classList.remove("ph-pre");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* --------------------------------------------------------------------
     Quote form — reference behavior only.
     Replace this whole block once the form is rebuilt as a native GHL
     form / Custom Code + GHL "Form" element so submissions land in your
     GHL pipeline. Until then this just confirms the click without sending
     data anywhere.
     -------------------------------------------------------------------- */
  (function quoteForm() {
    var form = $(".ph-quote-form");
    if (!form) return;
    on(form, "submit", function (e) {
      e.preventDefault();
      alert("Reference form — connect this to a GHL Form / workflow when publishing.");
    });
  })();
})();
