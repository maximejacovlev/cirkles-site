# Cirkles.ai — site statique

- **Développement local** : `cp .env.example .env`, renseigner `CALENDLY_TOKEN` (démo Calendly), **`SMTP_PASS`** (Microsoft 365, voir ci-dessous), et `NOTION_TOKEN` pour **Obtenir le rapport**.
- **Serveur Express** : `npm run dev` — sert les fichiers à la racine, `/api/calendly`, `POST /api/contact`, `POST /api/report`.
- **Formulaires contact + onboarding** : envoi par **Microsoft 365 SMTP** vers **franck.jacovlev@cirkles.ai** (`CONTACT_TO`). Sans `SMTP_PASS`, l’API renvoie une erreur 503.
- **Demande de rapport** : popup → `POST /api/report` → base Notion.

### Microsoft 365 — configuration SMTP

1. Admin Microsoft 365 : activer **SMTP AUTH** sur la boîte utilisée (`SMTP_USER`, ex. `franck.jacovlev@cirkles.ai`).
2. Si **MFA** est activée : [mot de passe d’application](https://account.microsoft.com/security) → coller la valeur dans `SMTP_PASS` (pas le mot de passe du compte).
3. Dans `.env` (local) et **Vercel → Settings → Environment Variables** (prod), définir :
   - `SMTP_HOST=smtp.office365.com`
   - `SMTP_PORT=587`
   - `SMTP_SECURE=false`
   - `SMTP_USER=franck.jacovlev@cirkles.ai`
   - `SMTP_PASS=…`
   - `SMTP_FROM="Cirkles — Contact <franck.jacovlev@cirkles.ai>"`
   - `CONTACT_TO=franck.jacovlev@cirkles.ai` (optionnel, c’est la valeur par défaut)

Déploiement Vercel : les routes `api/*.js` sont des fonctions serverless ; **redéployer** après ajout des variables SMTP.
