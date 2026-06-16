/**
 * Envoi des messages du formulaire contact (SMTP Microsoft 365 via nodemailer).
 * Variables d’environnement : voir .env.example
 */
const { createSmtpTransporter, isSmtpConfigured } = require("./smtpTransport.js");

const DEFAULT_TO = "franck.jacovlev@cirkles.ai";
const MAX_MESSAGE = 8000;
const MAX_NAME = 200;

function validateEmail(email) {
  if (typeof email !== "string") return false;
  const s = email.trim();
  if (s.length < 3 || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * @param {Record<string, unknown>} fields
 * @returns {Promise<{ ok?: true; skipped?: boolean; error?: string; status?: number }>}
 */
async function sendContactEmail(fields) {
  const to = (
    typeof process.env.CONTACT_TO === "string" && process.env.CONTACT_TO.trim()
      ? process.env.CONTACT_TO.trim()
      : DEFAULT_TO
  );

  const website = fields.website;
  if (typeof website === "string" && website.trim() !== "") {
    return { ok: true, skipped: true };
  }

  const name = typeof fields.name === "string" ? fields.name : "";
  const email = typeof fields.email === "string" ? fields.email : "";
  const company = typeof fields.company === "string" ? fields.company : "";
  const message = typeof fields.message === "string" ? fields.message : "";

  if (!name.trim() || !email.trim() || !message.trim()) {
    return { error: "Merci de remplir le nom, l’e-mail et le message.", status: 400 };
  }

  if (name.trim().length < 2) {
    return { error: "Nom trop court.", status: 400 };
  }

  if (name.length > MAX_NAME || company.length > MAX_NAME) {
    return { error: "Champ trop long.", status: 400 };
  }

  if (message.length > MAX_MESSAGE) {
    return { error: "Message trop long (maximum " + MAX_MESSAGE + " caractères).", status: 400 };
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
    return {
      error: "Configuration SMTP invalide.",
      status: 503,
    };
  }

  const { transporter, from: fromRaw } = smtp;

  const textBlocks = [
    "Nom : " + name.trim(),
    company.trim() ? "Société : " + company.trim() : null,
    "E-mail : " + email.trim(),
    "",
    message.trim(),
  ].filter(Boolean);

  const text = textBlocks.join("\n");

  await transporter.sendMail({
    from: fromRaw,
    to,
    replyTo: email.trim(),
    subject: "[Cirkles — site] Message de " + name.trim().slice(0, 80),
    text,
  });

  return { ok: true };
}

module.exports = { sendContactEmail, DEFAULT_TO };
