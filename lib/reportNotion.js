/**
 * Demande de rapport — enregistrement dans une base Notion (propriété e-mail).
 */
const NOTION_VERSION = "2022-06-28";

function validateEmail(email) {
  if (typeof email !== "string") return false;
  const s = email.trim();
  if (s.length < 3 || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function notionConfigError() {
  return {
    error:
      "Enregistrement Notion non configuré. Ajoutez NOTION_TOKEN et NOTION_DATABASE_ID dans .env (voir .env.example).",
    status: 503,
  };
}

/**
 * @param {Record<string, unknown>} fields
 */
async function createReportInNotion(fields) {
  const website = fields.website;
  if (typeof website === "string" && website.trim() !== "") {
    return { ok: true, skipped: true };
  }

  const email = typeof fields.email === "string" ? fields.email : "";

  if (!email.trim()) {
    return { error: "Merci d’indiquer votre adresse e-mail.", status: 400 };
  }

  if (!validateEmail(email)) {
    return { error: "Adresse e-mail invalide.", status: 400 };
  }

  const token =
    typeof process.env.NOTION_TOKEN === "string"
      ? process.env.NOTION_TOKEN.trim()
      : "";
  const databaseId =
    typeof process.env.NOTION_DATABASE_ID === "string"
      ? process.env.NOTION_DATABASE_ID.trim()
      : "";
  const emailProperty =
    typeof process.env.NOTION_EMAIL_PROPERTY === "string" &&
    process.env.NOTION_EMAIL_PROPERTY.trim()
      ? process.env.NOTION_EMAIL_PROPERTY.trim()
      : "Email";

  if (!token || !databaseId) {
    return notionConfigError();
  }

  const properties = {};
  properties[emailProperty] = { email: email.trim() };

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  const data = await response.json().catch(function () {
    return {};
  });

  if (!response.ok) {
    console.error("notion report:", response.status, data);
    var message =
      typeof data.message === "string" ? data.message : null;
    if (data.code === "object_not_found") {
      message =
        "Base Notion introuvable — vérifiez NOTION_DATABASE_ID et que la base est connectée à votre intégration.";
    } else if (data.code === "validation_error") {
      message =
        "Propriété Notion incorrecte — dans Notion l’intitulé peut être « email » mais l’API utilise souvent « Email » (majuscule). Définissez NOTION_EMAIL_PROPERTY=Email dans .env.";
    }
    return {
      error: message || "Impossible d’enregistrer la demande. Réessayez plus tard.",
      status: response.status >= 500 ? 503 : 502,
    };
  }

  return { ok: true };
}

module.exports = { createReportInNotion, validateEmail };
