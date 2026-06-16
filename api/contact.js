function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function parseBody(req) {
  let body = req.body;
  if (Buffer.isBuffer(body)) {
    try { body = JSON.parse(body.toString("utf8")); } catch { body = {}; }
  } else if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== "object") return {};
  return body;
}

module.exports = async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const body = parseBody(req);
    const { name, email, company, message, website } = body;

    // Honeypot : champ "website" rempli => bot, on répond OK sans rien faire
    if (website) return res.status(200).json({ ok: true });

    // Validation des champs requis
    if (!name || !email || !company) {
      return res.status(400).json({
        error: "Merci de remplir le prénom, le nom, l'e-mail et la société.",
      });
    }

    const url = process.env.MAKE_WEBHOOK_URL;
    if (!url) {
      return res.status(500).json({ error: "Webhook Make non configuré (MAKE_WEBHOOK_URL)." });
    }

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, company, message }),
    });

    if (!r.ok) {
      return res.status(502).json({ error: "Envoi impossible pour le moment. Réessayez plus tard." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("api/contact:", err);
    return res.status(500).json({ error: "Erreur lors de l'envoi. Réessayez plus tard." });
  }
};