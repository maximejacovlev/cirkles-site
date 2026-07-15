/** Shared pathname helpers for clean URLs (no .html extension). */
(function (g) {
  var PRODUCT = ["fraude-id", "schema", "score", "analyse-documentaire"];

  function segment() {
    var p = (g.location.pathname || "").split("/").filter(Boolean).pop() || "";
    return p.replace(/\.html$/i, "");
  }

  function pageSlug() {
    var s = segment();
    return !s || s === "index" ? "index" : s;
  }

  function isHome() {
    return pageSlug() === "index";
  }

  function hrefSlug(href) {
    if (!href || /^https?:/i.test(href) || href.charAt(0) === "#") return null;
    var path = href.split("#")[0].split("?")[0].replace(/^\.?\/?/, "");
    if (!path) return "index";
    return path.replace(/\.html$/i, "");
  }

  function isProduct(slug) {
    return PRODUCT.indexOf(slug || pageSlug()) !== -1;
  }

  g.cirklesPagePath = {
    PRODUCT: PRODUCT,
    pageSlug: pageSlug,
    isHome: isHome,
    hrefSlug: hrefSlug,
    isProduct: isProduct,
  };
})(window);

/**
 * Barre de navigation globale (logo + Accueil, Articles, Contact, Onboarding, Démo).
 */
(function () {
  var ARROW_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

  function currentSlug() {
    return window.cirklesPagePath.pageSlug();
  }

  function activeClass(slug, current) {
    return slug === current ? ' class="is-active"' : "";
  }

  function mount() {
    if (document.querySelector("[data-site-nav-global]")) return;

    var current = currentSlug();
    var onHome = current === "index";
    var homeHref = onHome ? "#accueil" : "/";
    var logoHref = onHome ? "#accueil" : "/";

    var root = document.getElementById("site-nav-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "site-nav-root";
      document.body.insertBefore(root, document.body.firstChild);
    }

    root.innerHTML =
      '<nav class="site-nav" data-site-nav-global aria-label="Navigation principale">' +
      '<div class="site-nav-inner">' +
      '<a href="' +
      logoHref +
      '" class="site-nav-logo" aria-label="Cirkles.ai accueil">' +
      '<img src="images/cirkles-logo-white.png" alt="Cirkles.ai" width="120" height="36" draggable="false" style="filter:invert(1)" />' +
      "</a>" +
      '<div class="site-nav-links liquid-glass">' +
      '<a href="' +
      homeHref +
      '"' +
      activeClass("index", current) +
      ">Accueil</a>" +
      '<a href="/articles"' +
      (current === "articles" || current === "article"
        ? ' class="is-active"'
        : "") +
      ">Articles</a>" +
      '<a href="/contact"' +
      activeClass("contact", current) +
      ">Contact</a>" +
      '<a href="/onboarding"' +
      activeClass("onboarding", current) +
      ">Onboarding</a>" +
      '<a href="/demo-booking" class="site-nav-cta">Demandez une Démo ' +
      ARROW_SVG +
      "</a>" +
      "</div>" +
      '<a href="/demo-booking" class="site-nav-cta-mobile">Demandez une Démo ' +
      ARROW_SVG +
      "</a>" +
      "</div></nav>";

    document.body.classList.add("has-site-nav");

    if (!window.cirklesPagePath.isProduct(current) && current !== "index") {
      document.body.classList.add("has-site-nav-body-pad");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
