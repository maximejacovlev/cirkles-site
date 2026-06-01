/**
 * Rouleaux en bulles glass — plusieurs blocs .hero-reels via data-reels (JSON).
 */
(function () {
  var DEFAULT_REELS = [
    ["Financement", "Location", "Équipement"],
    ["IBAN", "Scoring", "Data"],
    ["B2B/B2C", "Fraude", "ID"],
  ];

  var INTERVAL_MS = 2000;
  var SPIN_MS = 650;
  var STAGGER_MS = 90;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function parseReelsConfig(root) {
    var raw = root.getAttribute("data-reels");
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      } catch (e) {
        /* ignore */
      }
    }
    if (root.id === "hero-reels") return DEFAULT_REELS;
    return null;
  }

  function createItem(text) {
    var row = document.createElement("div");
    row.className = "hero-reel-item";
    var bubble = document.createElement("div");
    bubble.className = "hero-reel-bubble";
    var label = document.createElement("span");
    label.textContent = text;
    bubble.appendChild(label);
    row.appendChild(bubble);
    return row;
  }

  function buildTrack(track, items) {
    track.innerHTML = "";
    var i;
    for (i = 0; i < items.length; i++) {
      track.appendChild(createItem(items[i]));
    }
    track.appendChild(createItem(items[0]));
  }

  function getLineHeight(track) {
    var item = track.querySelector(".hero-reel-item");
    return item ? item.offsetHeight : 0;
  }

  function ensureReelStructure(root, reelsConfig) {
    var row = root.querySelector(".hero-reels-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "hero-reels-row";
      root.insertBefore(row, root.firstChild);
    }
    var existing = row.querySelectorAll(".hero-reel");
    if (existing.length === reelsConfig.length) return;

    row.innerHTML = "";
    var i;
    for (i = 0; i < reelsConfig.length; i++) {
      var reel = document.createElement("div");
      reel.className = "hero-reel";
      reel.setAttribute("data-reel", String(i));
      reel.setAttribute("aria-hidden", "true");
      var track = document.createElement("div");
      track.className = "hero-reel-track";
      reel.appendChild(track);
      row.appendChild(reel);
    }
  }

  function ReelController(reelEl, items) {
    this.reelEl = reelEl;
    this.items = items;
    this.track = reelEl.querySelector(".hero-reel-track");
    this.index = 0;
    this.lineH = 0;
    this.reduced = prefersReducedMotion();
  }

  ReelController.prototype.setup = function () {
    buildTrack(this.track, this.items);
    this.lineH = getLineHeight(this.track);
    this.index = 0;
    this.track.style.transition = "none";
    this.track.style.transform = "translateY(0)";
    this.updateVisibleItem();
    this.reelEl.setAttribute("data-final", this.items[0]);
  };

  ReelController.prototype.updateVisibleItem = function () {
    var rows = this.track.querySelectorAll(".hero-reel-item");
    var i;
    for (i = 0; i < rows.length; i++) {
      rows[i].classList.toggle("is-visible", this.reduced && i === this.index);
    }
  };

  ReelController.prototype.step = function (delay) {
    var self = this;
    if (this.reduced) {
      this.index = (this.index + 1) % this.items.length;
      this.updateVisibleItem();
      this.reelEl.setAttribute("data-final", this.items[this.index]);
      return;
    }

    if (!this.lineH) this.lineH = getLineHeight(this.track);

    var next = this.index + 1;
    var offset = next * this.lineH;

    window.setTimeout(function () {
      self.track.style.transition =
        "transform " + SPIN_MS + "ms cubic-bezier(0.14, 0.85, 0.18, 1)";
      self.track.style.transform = "translateY(-" + offset + "px)";

      function onEnd(e) {
        if (e && e.propertyName && e.propertyName !== "transform") return;
        self.track.removeEventListener("transitionend", onEnd);
        if (next >= self.items.length) {
          self.track.style.transition = "none";
          self.track.style.transform = "translateY(0)";
          self.index = 0;
        } else {
          self.index = next;
        }
        self.reelEl.setAttribute("data-final", self.items[self.index]);
      }

      self.track.addEventListener("transitionend", onEnd);
    }, delay);
  };

  function updateLiveText(root, controllers) {
    var live =
      root.querySelector(".hero-reels-live") ||
      (root.id === "hero-reels" ? document.getElementById("hero-reels-live") : null);
    if (!live) return;
    var parts = [];
    var i;
    for (i = 0; i < controllers.length; i++) {
      parts.push(controllers[i].items[controllers[i].index]);
    }
    live.textContent = parts.join(" — ");
  }

  function initReelsGroup(root) {
    if (root.dataset.ready === "1") return;

    var reelsConfig = parseReelsConfig(root);
    if (!reelsConfig) return;

    root.dataset.ready = "1";
    ensureReelStructure(root, reelsConfig);

    var reelEls = root.querySelectorAll(".hero-reel");
    var controllers = [];
    var i;

    for (i = 0; i < reelEls.length && i < reelsConfig.length; i++) {
      var ctrl = new ReelController(reelEls[i], reelsConfig[i]);
      ctrl.setup();
      controllers.push(ctrl);
    }

    updateLiveText(root, controllers);

    function tick() {
      var j;
      for (j = 0; j < controllers.length; j++) {
        controllers[j].step(j * STAGGER_MS);
      }
      window.setTimeout(function () {
        updateLiveText(root, controllers);
      }, SPIN_MS + STAGGER_MS * (controllers.length - 1) + 40);
    }

    window.setTimeout(tick, 500);
    window.setInterval(tick, INTERVAL_MS);
  }

  function initAllHeroReels() {
    var roots = document.querySelectorAll(".hero-reels");
    var i;
    for (i = 0; i < roots.length; i++) {
      initReelsGroup(roots[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllHeroReels);
  } else {
    initAllHeroReels();
  }
})();
