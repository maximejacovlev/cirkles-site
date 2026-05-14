/**
 * Serveur local : fichiers statiques + proxy /api/calendly (comme api/calendly.js).
 * Usage : cp .env.example .env puis npm run dev
 */
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");

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
        "  |  landing: /index.html  démo: /demo-booking.html"
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
