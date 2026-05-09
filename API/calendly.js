export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    const token = process.env.CALENDLY_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Token manquant" });
    }
  
    // Le path Calendly est passé en query param: ?path=/users/me
    const { path, ...queryParams } = req.query;
    if (!path) {
      return res.status(400).json({ error: "path manquant" });
    }
  
    // Reconstruit les query params (sauf "path")
    const qs = new URLSearchParams(queryParams).toString();
    const url = "https://api.calendly.com" + path + (qs ? "?" + qs : "");
  
    try {
      const options = {
        method: req.method,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
  
      if (req.method === "POST" && req.body) {
        options.body = JSON.stringify(req.body);
      }
  
      const response = await fetch(url, options);
      const data = await response.json();
  
      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }