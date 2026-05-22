/**
 * Demande de rapport (e-mail seul) — SMTP via nodemailer.
 */
const nodemailer = require("nodemailer");
const { DEFAULT_TO } = require("./contactMail.js");

function validateEmail(email) {
  if (typeof email !== "string") return false;
  const s = email.trim();
  if (s.length < 3 || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * @param {Record<string, unknown>} fields
 */
async function sendReportEmail(fields) {
  const to =
    typeof process.env.CONTACT_TO === "string" && process.env.CONTACT_TO.trim()
      ? process.env.CONTACT_TO.trim()
      : DEFAULT_TO;

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

  const host =
    typeof process.env.SMTP_HOST === "string" ? process.env.SMTP_HOST.trim() : "";
  const user =
    typeof process.env.SMTP_USER === "string" ? process.env.SMTP_USER.trim() : "";
  const pass = process.env.SMTP_PASS;
  const passOk = typeof pass === "string" && pass !== "";

  if (!host || !user || !passOk) {
    return {
      error:
        "Envoi e-mail non configuré côté serveur (SMTP). Voir README ou .env.example.",
      status: 503,
    };
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    process.env.SMTP_SECURE === "true" || String(port) === "465";

  const fromRaw =
    typeof process.env.SMTP_FROM === "string" && process.env.SMTP_FROM.trim()
      ? process.env.SMTP_FROM.trim()
      : "Cirkles — Contact <" + user + ">";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const text = [
    "Demande de rapport depuis le site Cirkles.ai",
    "",
    "E-mail : " + email.trim(),
    "",
    "— Envoyer le document de synthèse à cette adresse.",
  ].join("\n");

  await transporter.sendMail({
    from: fromRaw,
    to,
    replyTo: email.trim(),
    subject: "[Cirkles — site] Demande de rapport",
    text,
  });

  return { ok: true };
}

module.exports = { sendReportEmail };
