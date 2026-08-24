/** Helpers SEO partagés — mise à jour dynamique des balises head (articles). */
window.CIRKLES_SEO = {
  SITE: "https://cirkles.ai",
  OG_IMAGE: "https://cirkles.ai/images/cirkles-cover-fr.png",

  setMeta: function (attr, key, content) {
    var sel = "meta[" + attr + '="' + key + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  },

  setLink: function (rel, href) {
    var el = document.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  },

  applyPageMeta: function (opts) {
    document.title = opts.title;
    this.setMeta("name", "description", opts.description);
    this.setLink("canonical", opts.url);
    this.setMeta("property", "og:type", opts.type || "website");
    this.setMeta("property", "og:site_name", "Cirkles.ai");
    this.setMeta("property", "og:locale", "fr_FR");
    this.setMeta("property", "og:title", opts.title);
    this.setMeta("property", "og:description", opts.description);
    this.setMeta("property", "og:image", this.OG_IMAGE);
    this.setMeta("property", "og:url", opts.url);
    this.setMeta("name", "twitter:card", "summary_large_image");
    this.setMeta("name", "twitter:title", opts.title);
    this.setMeta("name", "twitter:description", opts.description);
    this.setMeta("name", "twitter:image", this.OG_IMAGE);
  },

  getArticleSlug: function () {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get("slug");
    if (fromQuery) return fromQuery;
    var match = window.location.pathname.match(/^\/articles\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : null;
  },
};
