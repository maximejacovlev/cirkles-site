/**
 * Mémorise la position de scroll de la landing quand l'utilisateur ouvre
 * une page produit (KYC, KYB, solvabilité, analyse documentaire), et la restaure au retour.
 */
(function () {
  const STORAGE_KEY = "cirkles-landing-scroll";
  const PRODUCT_PAGES = ["kyc.html", "kyb.html", "solvabilite.html", "analyse-documentaire.html"];

  function isLandingPage() {
    const last = window.location.pathname.split("/").filter(Boolean).pop() || "";
    return last === "" || last === "index.html";
  }

  function isProductHref(href) {
    if (!href || href.startsWith("http") || href.startsWith("#")) return false;
    const path = href.split("#")[0].split("?")[0];
    return PRODUCT_PAGES.some(
      (p) => path === p || path.endsWith("/" + p) || path.endsWith("\\" + p)
    );
  }

  function restoreScroll() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return;
    const y = parseInt(raw, 10);
    if (Number.isNaN(y)) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.removeItem(STORAGE_KEY);

    function apply() {
      window.scrollTo(0, y);
    }

    apply();
    requestAnimationFrame(apply);
    window.addEventListener("load", apply, { once: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(apply);
    }
    setTimeout(apply, 100);
    setTimeout(apply, 400);
  }

  if (isLandingPage()) {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    restoreScroll();

    document.addEventListener(
      "click",
      (e) => {
        const link = e.target.closest("a[href]");
        if (!link) return;
        if (isProductHref(link.getAttribute("href"))) {
          sessionStorage.setItem(STORAGE_KEY, String(Math.round(window.scrollY)));
        }
      },
      true
    );
  }
})();
