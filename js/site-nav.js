/**
 * Barre de navigation globale (logo + Accueil, Articles, Contact, Onboarding, Démo).
 */
(function () {
  var ARROW_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

  var PRODUCT_PAGE =
    /^(fraude-id|schema|score|analyse-documentaire)\.html$/i;

  function pageName() {
    var path = window.location.pathname || "";
    var file = path.split("/").pop() || "index.html";
    if (file === "" || file === "/") return "index.html";
    return file;
  }

  function activeClass(name, current) {
    return name === current ? ' class="is-active"' : "";
  }

  function mount() {
    if (document.querySelector("[data-site-nav-global]")) return;

    var current = pageName();
    var onHome = current === "index.html";
    var homeHref = onHome ? "#accueil" : "index.html";
    var logoHref = onHome ? "#accueil" : "index.html";

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
      activeClass("index.html", current) +
      ">Accueil</a>" +
      '<a href="articles.html"' +
      (current === "articles.html" || current === "article.html"
        ? ' class="is-active"'
        : "") +
      ">Articles</a>" +
      '<a href="contact.html"' +
      activeClass("contact.html", current) +
      ">Contact</a>" +
      '<a href="onboarding.html"' +
      activeClass("onboarding.html", current) +
      ">Onboarding</a>" +
      '<a href="demo-booking.html" class="site-nav-cta">Demandez une Démo ' +
      ARROW_SVG +
      "</a>" +
      "</div>" +
      '<a href="demo-booking.html" class="site-nav-cta-mobile">Demandez une Démo ' +
      ARROW_SVG +
      "</a>" +
      "</div></nav>";

    document.body.classList.add("has-site-nav");

    if (!PRODUCT_PAGE.test(current) && current !== "index.html") {
      document.body.classList.add("has-site-nav-body-pad");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
