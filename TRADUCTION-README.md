# Traduction FR / EN — mode d'emploi

Le site reste **en français dans les fichiers HTML**. La traduction se fait à la volée
en JavaScript, pilotée par un bouton flottant **FR / EN** (en bas à droite).
Le choix de langue est mémorisé (localStorage) et vaut pour tout le site.

## Fichiers ajoutés
- `js/i18n-en.js` — le **dictionnaire** français → anglais (clé = texte français exact, valeur = anglais).
- `js/i18n.js` — le **moteur** : remplace le texte quand « EN » est actif, remet le français sinon.
- `css/i18n.css` — le style du bouton.

Ces trois fichiers sont chargés à la fin de chaque page (les deux `<script>` juste avant `</body>`,
le `<link>` CSS dans le `<head>`).

## Pourquoi il n'y a plus de « caractères bizarres »
Les caractères bizarres (`Ã©` au lieu de `é`, `Ã ` au lieu de `à`…) apparaissent quand un fichier
**UTF‑8 est ré‑enregistré en Latin‑1 / ANSI**. Ici on ne réécrit **aucun** fichier HTML : le français
d'origine n'est jamais touché, et les traductions vivent dans un seul fichier UTF‑8.

Règles d'or si vous éditez quoi que ce soit :
1. Toujours enregistrer en **UTF‑8, sans BOM**.
2. Garder `<meta charset="utf-8" />` dans le `<head>` (déjà présent partout).
3. Ne jamais coller de texte via un éditeur configuré en « ANSI / Windows‑1252 ».

## Ajouter ou corriger une traduction
Ouvrez `js/i18n-en.js`. C'est un objet `{ "texte français" : "texte anglais" }`.
Ajoutez une ligne avec, à gauche, le **texte français exactement tel qu'il s'affiche**
(mêmes apostrophes « ' », mêmes accents), et à droite l'anglais. Exemple :

    "Demandez une démo": "Request a demo",

Une phrase absente du dictionnaire **reste en français** (pas de trou dans la page).

## Comment ça marche pour le contenu dynamique
La nav, la popup « Obtenir le rapport », la notification onboarding et les articles sont injectés
par JavaScript. Un `MutationObserver` détecte ces ajouts et applique la traduction automatiquement.

## Enlever le bouton / la traduction
Supprimez les lignes `i18n-en.js`, `i18n.js` et `i18n.css` dans les pages concernées.
