/**
 * Serveur local : fichiers statiques + /api/calendly + POST /api/contact (e-mail).
 * Usage : cp .env.example .env puis npm run dev
 */
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const { sendContactEmail } = require("./lib/contactMail.js");
const { createReportInNotion } = require("./lib/reportNotion.js");

const PORT_START = Number(process.env.PORT) || 3000;
const PORT_ATTEMPTS = 20;
const ROOT = __dirname;

const app = express();
app.use(express.json({ limit: "2mb" }));

app.all("/api/calendly", async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = typeof process.env.CALENDLY_TOKEN === "string" ? process.env.CALENDLY_TOKEN.trim() : "";
  if (!token) {
    return res.status(500).json({
      error:
        "Token manquant — copie .env.example vers .env et renseigne CALENDLY_TOKEN",
    });
  }

  const { path: calPath, ...queryParams } = req.query;
  if (!calPath) {
    return res.status(400).json({ error: "path manquant" });
  }

  const pathStr = Array.isArray(calPath) ? calPath[0] : calPath;
  const usp = new URLSearchParams();
  Object.keys(queryParams).forEach(function (key) {
    var v = queryParams[key];
    if (v === undefined || v === null) return;
    var s = Array.isArray(v) ? v[0] : v;
    if (typeof s !== "string") s = String(s);
    usp.append(key, s);
  });
  const qs = usp.toString();
  const calendlyUrl = "https://api.calendly.com" + pathStr + (qs ? "?" + qs : "");

  try {
    const headers = {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    };
    if (req.method === "POST") {
      headers["Content-Type"] = "application/json";
    }

    var options = { method: req.method, headers: headers };

    if (req.method === "POST" && req.body) {
      options.body =
        typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    var response = await fetch(calendlyUrl, options);
    const data = await response.json().catch(function () {
      return { error: "Réponse Calendly non JSON" };
    });

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || String(err) });
  }
});

function contactCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

app.options("/api/contact", function (req, res) {
  contactCors(res);
  res.status(200).end();
});

app.post("/api/contact", async function (req, res) {
  contactCors(res);
  try {
    const result = await sendContactEmail(req.body || {});
    if (result.skipped) return res.status(200).json({ ok: true });
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("contact mail:", err);
    return res.status(500).json({
      error: err.message || "Erreur lors de l’envoi. Réessayez plus tard.",
    });
  }
});

app.options("/api/report", function (req, res) {
  contactCors(res);
  res.status(200).end();
});

app.post("/api/report", async function (req, res) {
  contactCors(res);
  try {
    const result = await createReportInNotion(req.body || {});
    if (result.skipped) return res.status(200).json({ ok: true });
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("report notion:", err);
    return res.status(500).json({
      error: err.message || "Erreur lors de l’envoi. Réessayez plus tard.",
    });
  }
});

app.use(express.static(ROOT));

function listenFrom(port, attempt) {
  const server = app.listen(port, function () {
    if (port !== PORT_START) {
      console.log(
        "Port " + PORT_START + " déjà utilisé ; serveur sur le port " + port + "."
      );
    }
    console.log(
      "Cirkles local → http://localhost:" +
        port +
        "  |  landing: /index.html  démo: /demo-booking.html  contact: /contact.html"
    );
  });

  server.on("error", function (err) {
    if (err.code === "EADDRINUSE" && attempt < PORT_ATTEMPTS) {
      server.close(function () {
        listenFrom(port + 1, attempt + 1);
      });
      return;
    }
    if (err.code === "EADDRINUSE") {
      console.error(
        "Aucun port libre entre " +
          PORT_START +
          " et " +
          (PORT_START + PORT_ATTEMPTS - 1) +
          ". Arrête l’autre process (ex. `serve` sur 3000) ou PORT=3333 npm run dev"
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}

listenFrom(PORT_START, 1);
