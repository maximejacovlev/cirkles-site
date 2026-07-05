/**
 * Popup « Obtenir le rapport » — saisie e-mail, POST /api/report
 */
(function () {
  var ROOT_ID = "report-popup-root";

  function buildModal() {
    if (document.getElementById(ROOT_ID)) return;

    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.className = "report-popup-root";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "report-popup-title");
    root.innerHTML =
      '<div class="report-popup-backdrop" data-report-close></div>' +
      '<div class="report-popup-card">' +
      '<button type="button" class="report-popup-close" data-report-close aria-label="Fermer">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>' +
      "</svg></button>" +
      '<h2 id="report-popup-title" class="report-popup-title">Obtenir le rapport</h2>' +
      '<p class="report-popup-lede">Indiquez votre e-mail professionnel. Nous vous enverrons la synthèse sur la fraude et l’intelligence collective.</p>' +
      '<form class="report-popup-form" id="report-popup-form" novalidate>' +
      '<div class="report-popup-hp" aria-hidden="true">' +
      '<label for="report-website">Ne pas remplir</label>' +
      '<input type="text" id="report-website" name="website" tabindex="-1" autocomplete="off" />' +
      "</div>" +
      '<label for="report-email">E-mail professionnel</label>' +
      '<input type="email" id="report-email" name="email" required autocomplete="email" placeholder="vous@entreprise.com" />' +
      '<button type="submit" class="report-popup-submit" id="report-popup-submit">' +
      '<span id="report-popup-submit-label">Recevoir le rapport</span>' +
      "</button>" +
      '<p class="report-popup-msg err" id="report-popup-error" role="alert"></p>' +
      '<p class="report-popup-msg ok" id="report-popup-success" role="status"></p>' +
      "</form></div>";

    document.body.appendChild(root);

    root.querySelectorAll("[data-report-close]").forEach(function (el) {
      el.addEventListener("click", closeReportPopup);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("open")) {
        closeReportPopup();
      }
    });

    var form = document.getElementById("report-popup-form");
    var errEl = document.getElementById("report-popup-error");
    var okEl = document.getElementById("report-popup-success");
    var btn = document.getElementById("report-popup-submit");
    var label = document.getElementById("report-popup-submit-label");
    var emailInput = document.getElementById("report-email");

    function hideMsgs() {
      errEl.classList.remove("show");
      okEl.classList.remove("show");
    }

    function showErr(msg) {
      okEl.classList.remove("show");
      errEl.textContent = msg;
      errEl.classList.add("show");
    }

    function showOk(msg) {
      errEl.classList.remove("show");
      okEl.textContent = msg;
      okEl.classList.add("show");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideMsgs();

      var email = emailInput.value.trim();
      var website = document.getElementById("report-website").value;

      if (!email) {
        showErr("Merci d’indiquer votre adresse e-mail.");
        return;
      }

      btn.disabled = true;
      label.textContent = "Envoi en cours…";
      if (window.cirklesI18n) window.cirklesI18n.apply();

      fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, website: website }),
      })
        .then(function (res) {
          return res.json().catch(function () {
            return {};
          }).then(function (data) {
            if (!res.ok) {
              showErr(data.error || "Envoi impossible. Réessayez plus tard.");
              return;
            }
            showOk("Merci. Le rapport vous sera envoyé sous peu.");
            form.reset();
            setTimeout(closeReportPopup, 2200);
          });
        })
        .catch(function () {
          showErr("Erreur réseau. Vérifiez votre connexion et réessayez.");
        })
        .finally(function () {
          btn.disabled = false;
          label.textContent = "Recevoir le rapport";
          if (window.cirklesI18n) window.cirklesI18n.apply();
        });
    });
  }

  function openReportPopup() {
    buildModal();
    var root = document.getElementById(ROOT_ID);
    hideMsgsIfAny();
    root.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      var emailInput = document.getElementById("report-email");
      if (emailInput) emailInput.focus();
    }, 80);
  }

  function hideMsgsIfAny() {
    var err = document.getElementById("report-popup-error");
    var ok = document.getElementById("report-popup-success");
    if (err) err.classList.remove("show");
    if (ok) ok.classList.remove("show");
  }

  function closeReportPopup() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.classList.remove("open");
    if (document.querySelector(".modal-root.open, .article-modal-root.open")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-report-open]");
    if (!trigger) return;
    e.preventDefault();
    openReportPopup();
  });

  window.openReportPopup = openReportPopup;
  window.closeReportPopup = closeReportPopup;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildModal);
  } else {
    buildModal();
  }
})();
