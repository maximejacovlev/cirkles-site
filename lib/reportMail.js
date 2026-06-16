/**
 * Demande de rapport (e-mail seul) — SMTP Microsoft 365 via nodemailer.
 */
const { DEFAULT_TO } = require("./contactMail.js");
const { createSmtpTransporter, isSmtpConfigured } = require("./smtpTransport.js");

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

  if (!isSmtpConfigured()) {
    return {
      error:
        "Envoi e-mail non configuré côté serveur (SMTP Microsoft 365). Renseignez SMTP_USER et SMTP_PASS dans .env ou Vercel.",
      status: 503,
    };
  }

  const smtp = createSmtpTransporter();
  if (!smtp) {
    return { error: "Configuration SMTP invalide.", status: 503 };
  }

  const { transporter, from: fromRaw } = smtp;

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
