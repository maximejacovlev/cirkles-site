/**
 * Transport SMTP partagé (Microsoft 365 / Office 365 par défaut).
 * Variables : SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
 */
const nodemailer = require("nodemailer");

const DEFAULT_SMTP_HOST = "smtp.office365.com";

function readSmtpEnv() {
  const host =
    typeof process.env.SMTP_HOST === "string" && process.env.SMTP_HOST.trim()
      ? process.env.SMTP_HOST.trim()
      : DEFAULT_SMTP_HOST;
  const user =
    typeof process.env.SMTP_USER === "string" ? process.env.SMTP_USER.trim() : "";
  const pass = process.env.SMTP_PASS;
  const passOk = typeof pass === "string" && pass !== "";
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    process.env.SMTP_SECURE === "true" || String(port) === "465";
  const isMicrosoft =
    /office365\.com|outlook\.com|microsoft\.com/i.test(host);

  return { host, user, pass, passOk, port, secure, isMicrosoft };
}

function getFromAddress(user) {
  if (typeof process.env.SMTP_FROM === "string" && process.env.SMTP_FROM.trim()) {
    return process.env.SMTP_FROM.trim();
  }
  return "Cirkles — Contact <" + user + ">";
}

/**
 * @returns {{ transporter: import("nodemailer").Transporter; from: string } | null}
 */
function createSmtpTransporter() {
  const cfg = readSmtpEnv();
  if (!cfg.user || !cfg.passOk) return null;

  /** @type {import("nodemailer").TransportOptions} */
  const options = {
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  };

  // Microsoft 365 : STARTTLS sur le port 587
  if (cfg.isMicrosoft || cfg.port === 587) {
    options.requireTLS = true;
  }

  return {
    transporter: nodemailer.createTransport(options),
    from: getFromAddress(cfg.user),
  };
}

function isSmtpConfigured() {
  const cfg = readSmtpEnv();
  return Boolean(cfg.user && cfg.passOk);
}

module.exports = {
  createSmtpTransporter,
  isSmtpConfigured,
  DEFAULT_SMTP_HOST,
};
