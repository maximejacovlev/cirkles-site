module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token =
    typeof process.env.CALENDLY_TOKEN === "string" ? process.env.CALENDLY_TOKEN.trim() : "";
  if (!token) {
    return res.status(500).json({ error: "Token manquant" });
  }

  const { path, ...queryParams } = req.query;
  if (!path) {
    return res.status(400).json({ error: "path manquant" });
  }

  const pathStr = Array.isArray(path) ? path[0] : path;
  const usp = new URLSearchParams();
  Object.keys(queryParams).forEach((key) => {
    let v = queryParams[key];
    if (v === undefined || v === null) return;
    let s = Array.isArray(v) ? v[0] : v;
    if (typeof s !== "string") s = String(s);
    usp.append(key, s);
  });
  const qs = usp.toString();
  const url = "https://api.calendly.com" + pathStr + (qs ? "?" + qs : "");

  try {
    const headers = {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    };
    if (req.method === "POST") headers["Content-Type"] = "application/json";

    const options = {
      method: req.method,
      headers,
    };

    if (req.method === "POST" && req.body) {
      options.body =
        typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
