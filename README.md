# Cirkles.ai — site statique

- **Développement local** : `cp .env.example .env`, renseigner au minimum `CALENDLY_TOKEN` (démo Calendly) ; pour le **formulaire contact**, ajouter les variables **SMTP** décrites dans `.env.example`.
- **Serveur Express** : `npm run dev` — sert les fichiers à la racine, `/api/calendly`, `POST /api/contact`.
- **Formulaire contact** : page `contact.html` — envoi vers **franck.jacovlev@cirkles.ai** (modifiable via `CONTACT_TO`). Sans SMTP configuré, l’API renvoie une erreur 503 explicite.

Déploiement Vercel : les routes `api/*.js` sont exposées comme fonctions serverless ; définir les mêmes variables d’environnement dans le projet Vercel.
