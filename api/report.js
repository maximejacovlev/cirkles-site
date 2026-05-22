const { createReportInNotion } = require("../lib/reportNotion.js");

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function parseBody(req) {
  let body = req.body;
  if (Buffer.isBuffer(body)) {
    try {
      body = JSON.parse(body.toString("utf8"));
    } catch {
      body = {};
    }
  } else if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  if (!body || typeof body !== "object") return {};
  return body;
}

module.exports = async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const body = parseBody(req);
    const result = await createReportInNotion(body);
    if (result.skipped) return res.status(200).json({ ok: true });
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("api/report:", err);
    return res.status(500).json({
      error: err.message || "Erreur lors de l’envoi. Réessayez plus tard.",
    });
  }
};
