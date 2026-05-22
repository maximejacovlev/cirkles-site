# Cirkles.ai — site statique

- **Développement local** : `cp .env.example .env`, renseigner au minimum `CALENDLY_TOKEN` (démo Calendly) ; pour le **formulaire contact**, ajouter les variables **SMTP** ; pour **Obtenir le rapport**, ajouter `NOTION_TOKEN` (voir `.env.example`).
- **Serveur Express** : `npm run dev` — sert les fichiers à la racine, `/api/calendly`, `POST /api/contact`, `POST /api/report`.
- **Formulaire contact** : page `contact.html` — envoi vers **franck.jacovlev@cirkles.ai** (modifiable via `CONTACT_TO`). Sans SMTP configuré, l’API renvoie une erreur 503 explicite.
- **Demande de rapport** : popup sur le site → `POST /api/report` → nouvelle ligne dans la base Notion (`NOTION_DATABASE_ID`, colonne `email`).

Déploiement Vercel : les routes `api/*.js` sont exposées comme fonctions serverless ; définir les mêmes variables d’environnement dans le projet Vercel.
