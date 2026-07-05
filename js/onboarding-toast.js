/**
 * Notification « Onboarding accéléré » — page d'accueil uniquement.
 * Apparaît en haut à droite après un court délai ; « Oui » ouvre onboarding.html,
 * la croix ferme et mémorise le refus pour la session (sessionStorage).
 */
(function () {
  var STORAGE_KEY = "cirkles-onboarding-toast-dismissed";
  var SHOW_DELAY_MS = 2500;

  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
  } catch (_) {
    /* sessionStorage indisponible (navigation privée stricte) : on affiche quand même */
  }

  function injectStyles() {
    var css =
      ".onboarding-toast{position:fixed;top:20px;right:20px;z-index:320;" +
      "max-width:340px;padding:12px 14px 16px;border-radius:18px;" +
      "background:rgba(255,255,255,.96);border:1px solid rgba(255,255,255,.9);" +
      "box-shadow:0 1px 0 rgba(255,255,255,.95) inset,0 12px 40px rgba(0,0,0,.14);" +
      "backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);" +
      "font-family:'Inter Tight',sans-serif;" +
      "opacity:0;transform:translateX(24px);transition:opacity .4s ease,transform .4s cubic-bezier(.2,.7,.2,1);}" +
      ".onboarding-toast.in{opacity:1;transform:translateX(0);}" +
      ".onboarding-toast .ot-body{display:flex;flex-direction:column;align-items:center;justify-content:center;" +
      "gap:12px;text-align:center;padding:4px 28px 0;}" +
      ".onboarding-toast .ot-text{font-size:13px;font-weight:500;color:#000;line-height:1.45;margin:0;" +
      "text-align:center;width:100%;}" +
      ".onboarding-toast .ot-yes{display:inline-flex;align-items:center;justify-content:center;" +
      "padding:8px 18px;border-radius:999px;background:#000;color:#fff;font-size:13px;font-weight:600;" +
      "text-decoration:none;transition:background .2s;cursor:pointer;}" +
      ".onboarding-toast .ot-yes:hover{background:rgba(0,0,0,.85);}" +
      ".onboarding-toast .ot-close{position:absolute;top:10px;right:10px;width:26px;height:26px;" +
      "border:none;border-radius:999px;background:rgba(0,0,0,.06);color:rgba(0,0,0,.55);" +
      "font-size:15px;line-height:1;cursor:pointer;display:grid;place-items:center;" +
      "transition:background .2s,color .2s;}" +
      ".onboarding-toast .ot-close:hover{background:rgba(0,0,0,.12);color:#000;}" +
      "@media(max-width:520px){.onboarding-toast{left:16px;right:16px;max-width:none;top:16px;}" +
      ".onboarding-toast .ot-body{padding:4px 24px 0;}}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function dismiss(toast) {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (_) {}
    toast.classList.remove("in");
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 450);
  }

  function show() {
    injectStyles();

    var toast = document.createElement("div");
    toast.className = "onboarding-toast";
    toast.setAttribute("role", "alert");
    toast.innerHTML =
      '<button type="button" class="ot-close" aria-label="Fermer la notification">\u00d7</button>' +
      '<div class="ot-body">' +
      '<p class="ot-text">Besoin d\u2019un onboarding acc\u00e9l\u00e9r\u00e9\u00a0?</p>' +
      '<a class="ot-yes" href="onboarding.html">Oui</a>' +
      "</div>";
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add("in");
      });
    });

    toast.querySelector(".ot-close").addEventListener("click", function () {
      dismiss(toast);
    });
    toast.querySelector(".ot-yes").addEventListener("click", function () {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch (_) {}
    });
  }

  function schedule() {
    setTimeout(show, SHOW_DELAY_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else {
    schedule();
  }
})();
