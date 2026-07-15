/**
 * Cirkles — bascule de langue FR / EN.
 *
 * Principe : le HTML reste en français. Ce moteur remplace le texte à la volée
 * en anglais quand la langue "en" est active, en s'appuyant sur le dictionnaire
 * window.CIRKLES_I18N_EN (clés = texte français exact tel qu'affiché).
 * Le texte non traduit reste en français (repli sans "trou").
 *
 * Aucun fichier HTML n'est réécrit → aucun risque de mauvais encodage.
 */
(function () {
  "use strict";

  var DICT_RAW = window.CIRKLES_I18N_EN || {};
  var DICT = {};
  var STORAGE_KEY = "cirkles-lang";
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };

  // Mémorise le texte français d'origine par nœud, pour pouvoir revenir en FR.
  var ORIG_TEXT = new WeakMap(); // textNode -> chaîne FR d'origine
  var ORIG_ATTR = new WeakMap(); // element -> { attr: valeurFR }
  var ORIG_DT = new WeakMap(); // element[data-text] -> valeur FR d'origine
  var origTitle = document.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  var origMetaDesc = metaDesc ? metaDesc.getAttribute("content") : null;

  function collapse(s) {
    return s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
  }

  function normalizeApostrophes(s) {
    return s.replace(/[\u2018\u2019\u201B\u2032]/g, "'");
  }

  function stripOuterQuotes(s) {
    return s
      .replace(/^[\s"\u201C\u201D«»]+/, "")
      .replace(/[\s"\u201C\u201D«»]+$/, "")
      .trim();
  }

  function dictLookup(original) {
    var candidates = [];
    var normalized = collapse(normalizeApostrophes(original));
    candidates.push(normalized);
    var stripped = stripOuterQuotes(normalized);
    if (stripped !== normalized) candidates.push(stripped);
    var i;
    for (i = 0; i < candidates.length; i++) {
      if (DICT[candidates[i]] != null) return DICT[candidates[i]];
    }
    return null;
  }

  Object.keys(DICT_RAW).forEach(function (k) {
    DICT[collapse(normalizeApostrophes(k))] = DICT_RAW[k];
  });

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "fr";
    } catch (_) {
      return "fr";
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }

  // Remplace un texte FR par sa version EN en conservant les espaces / guillemets autour.
  function toEN(original) {
    var en = dictLookup(original);
    if (en == null) return null;
    var lead = original.match(/^\s*/)[0];
    var trail = original.match(/\s*$/)[0];
    var core = original.slice(lead.length, original.length - trail.length);
    var openQ = core.match(/^[\u201C«"]/);
    var closeQ = core.match(/[\u201D»"]$/);
    if (openQ && closeQ) {
      return lead + openQ[0] + en + closeQ[0] + trail;
    }
    return lead + en + trail;
  }

  function applyTextNode(node, lang) {
    var original = ORIG_TEXT.has(node) ? ORIG_TEXT.get(node) : node.nodeValue;
    if (!/[A-Za-zÀ-ÿ]/.test(original)) return; // rien de traduisible
    if (!ORIG_TEXT.has(node)) ORIG_TEXT.set(node, original);
    if (lang === "en") {
      var en = toEN(original);
      if (en != null && node.nodeValue !== en) node.nodeValue = en;
    } else if (node.nodeValue !== original) {
      node.nodeValue = original; // retour au français
    }
  }

  function applyAttrs(el, lang) {
    var store = ORIG_ATTR.get(el);
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      if (!store) {
        store = {};
        ORIG_ATTR.set(el, store);
      }
      if (!(a in store)) store[a] = el.getAttribute(a);
      var original = store[a];
      if (lang === "en") {
        var en = toEN(original);
        if (en != null) el.setAttribute(a, en);
      } else {
        el.setAttribute(a, original);
      }
    }
  }

  function walk(root, lang) {
    // Nœuds texte
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || SKIP_TAGS[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("[data-i18n-skip]"))
          return NodeFilter.FILTER_REJECT;
        return n.nodeValue && /\S/.test(n.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });
    var n;
    while ((n = tw.nextNode())) applyTextNode(n, lang);

    // Attributs traduisibles
    var els =
      root.nodeType === 1
        ? [root].concat(
            Array.prototype.slice.call(root.querySelectorAll("*"))
          )
        : Array.prototype.slice.call(root.querySelectorAll("*"));
    els.forEach(function (el) {
      if (el.hasAttribute && el.closest && !el.closest("[data-i18n-skip]"))
        applyAttrs(el, lang);
    });
  }

  // Reconstruit un titre "BlurText" (mots dans des <span>) à partir d'un texte,
  // en reproduisant exactement le rendu du script d'origine, et rend les mots visibles.
  function rebuildBlur(el, text) {
    el.innerHTML = "";
    var lines = String(text).split("|");
    var wordIndex = 0;
    lines.forEach(function (line) {
      var multi = lines.length > 1;
      var lineEl = multi ? document.createElement("span") : el;
      if (multi) {
        lineEl.className = "blur-line block";
        el.appendChild(lineEl);
      }
      var words = line.trim().split(/\s+/).filter(Boolean);
      words.forEach(function (w, i) {
        var span = document.createElement("span");
        span.className = "blur-word in"; // "in" => visible tout de suite
        span.style.transitionDelay = wordIndex * 110 + "ms";
        span.textContent = w + (i < words.length - 1 ? "\u00A0" : "");
        lineEl.appendChild(span);
        wordIndex += 1;
      });
    });
  }

  // Signature insensible aux espaces / séparateurs (évite les rebuilds en boucle).
  function sig(s) {
    return String(s).replace(/[\s|]+/g, "");
  }

  // Gère les éléments dont le texte affiché vient de l'attribut data-text.
  function handleDataText(el, lang) {
    if (!ORIG_DT.has(el)) ORIG_DT.set(el, el.getAttribute("data-text"));
    var orig = ORIG_DT.get(el);
    if (orig == null) return;
    el.setAttribute("data-i18n-skip", ""); // le walker laisse les mots tranquilles
    var isBlur = el.hasAttribute("data-blur-text");

    if (lang === "en") {
      var en = dictLookup(orig);
      var target = en != null ? en : orig;
      if (el.getAttribute("data-text") !== target)
        el.setAttribute("data-text", target);
      if (sig(el.textContent) !== sig(target)) {
        if (isBlur) rebuildBlur(el, target);
        else el.textContent = target;
      }
    } else {
      // on ne restaure que si on avait modifié l'élément (sinon on laisse
      // l'animation d'origine gérer l'affichage en français)
      if (el.getAttribute("data-text") !== orig) {
        el.setAttribute("data-text", orig);
        if (sig(el.textContent) !== sig(orig)) {
          if (isBlur) rebuildBlur(el, orig);
          else el.textContent = orig;
        }
      }
    }
  }

  function applyAll(lang) {
    document.documentElement.setAttribute("lang", lang);
    walk(document.body, lang);
    // Titres pilotés par data-text (héro, sections, cartes stat…)
    var dt = document.querySelectorAll("[data-text]");
    for (var i = 0; i < dt.length; i++) {
      if (!dt[i].closest("[data-i18n-skip]") || dt[i].hasAttribute("data-text"))
        handleDataText(dt[i], lang);
    }
    // <title> + meta description
    if (lang === "en") {
      var t = toEN(origTitle);
      if (t != null) document.title = collapse(t);
      if (metaDesc && origMetaDesc != null) {
        var m = toEN(origMetaDesc);
        if (m != null) metaDesc.setAttribute("content", collapse(m));
      }
    } else {
      document.title = origTitle;
      if (metaDesc && origMetaDesc != null)
        metaDesc.setAttribute("content", origMetaDesc);
    }
  }

  // ------- Bouton flottant FR / EN (page d'accueil uniquement) -------
  function isIndexPage() {
    if (window.cirklesPagePath) return window.cirklesPagePath.isHome();
    var path = window.location.pathname || "";
    var file = path.split("/").pop() || "";
    file = file.replace(/\.html$/i, "");
    return file === "" || file === "index";
  }

  function buildButton() {
    var wrap = document.createElement("div");
    wrap.className = "cirkles-lang-switch";
    wrap.setAttribute("data-i18n-skip", "");
    wrap.innerHTML =
      '<button type="button" data-lang="fr" aria-label="Français">FR</button>' +
      '<span class="cls-sep" aria-hidden="true"></span>' +
      '<button type="button" data-lang="en" aria-label="English">EN</button>';
    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-lang]");
      if (!btn) return;
      var lang = btn.getAttribute("data-lang");
      if (lang === getLang()) return;
      setLang(lang);
      applyAll(lang);
      refreshButton();
      document.dispatchEvent(
        new CustomEvent("cirkles-lang-change", { detail: { lang: lang } })
      );
    });
    document.body.appendChild(wrap);
    return wrap;
  }

  var btnEl;
  function refreshButton() {
    if (!btnEl) return;
    var lang = getLang();
    btnEl.querySelectorAll("button[data-lang]").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });
  }

  // ------- Observe le contenu injecté dynamiquement (nav, popups, toasts) -------
  var pending = null;
  function scheduleRescan() {
    if (getLang() !== "en") return;
    if (pending) return;
    pending = requestAnimationFrame(function () {
      pending = null;
      applyAll("en");
      refreshButton();
    });
  }

  function start() {
    if (isIndexPage()) {
      btnEl = buildButton();
      refreshButton();
    }
    applyAll(getLang());

    var obs = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (
          muts[i].addedNodes.length ||
          muts[i].type === "characterData"
        ) {
          scheduleRescan();
          break;
        }
      }
    });
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function refreshI18n() {
    applyAll(getLang());
    refreshButton();
  }

  window.cirklesI18n = { getLang: getLang, apply: refreshI18n };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
