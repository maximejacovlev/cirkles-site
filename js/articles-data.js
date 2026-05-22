/** Données des articles blog — partagées entre articles.html et article.html */
window.CIRKLES_ARTICLES = [
  {
    slug: "intelligence-collective-fraude",
    category: "Réseau",
    date: "12 mars 2026",
    readMin: 6,
    title: "Pourquoi la fraude se combat mieux en réseau qu'en silo",
    excerpt:
      "Un acteur isolé voit son dossier. Un réseau voit le schéma. Comment l'intelligence collective change la donne pour les équipes risque et conformité.",
    body: [
      "La fraude moderne n'est plus l'affaire d'un mauvais payeur isolé. Ce sont des montages coordonnés, des identités recyclées, des structures qui changent de nom mais pas de comportement.",
      "Quand chaque organisation analyse ses dossiers seul, les signaux faibles restent locaux. Le même fraudeur peut être refusé chez l'un, accepté chez l'autre — faute de mémoire partagée.",
      "L'intelligence collective ne signifie pas partager des données clients en clair. Elle signifie enrichir chaque décision avec des empreintes anonymisées, des schémas déjà observés ailleurs, des corrélations que personne ne peut produire seul.",
      "Plus le réseau grandit, plus la détection gagne en précision — sans multiplier les faux positifs. C'est l'effet que Cirkles cherche à industrialiser : une protection qui monte avec l'écosystème, pas avec la taille de votre seule base.",
    ],
  },
  {
    slug: "fraude-documentaire-signaux",
    category: "Documents",
    date: "5 mars 2026",
    readMin: 5,
    title: "Fraude documentaire : les signaux que les contrôles classiques ratent",
    excerpt:
      "Faux justificatifs, relevés retouchés, pièces générées par IA — les indices ne sont plus seulement visuels, ils sont comportementaux.",
    body: [
      "Un document peut être authentique sur le papier et frauduleux dans le dossier. La cohérence entre pièces — revenus, adresse, IBAN, chronologie — devient le vrai test.",
      "Les falsifications les plus efficaces reprennent des modèles déjà vus ailleurs : même police mal alignée, même structure de fichier, même séquence de dépôt. Un réseau les reconnaît plus vite qu'un opérateur seul.",
      "L'OCR et l'analyse de métadonnées ne suffisent pas sans contexte. Croiser chaque pièce avec les schémas de falsification récents du réseau permet de détecter une retouche qui aurait passé un contrôle isolé.",
      "L'enjeu n'est pas de tout refuser, mais de documenter pourquoi un dossier est suspect — pour des décisions auditables et défendables.",
    ],
  },
  {
    slug: "schemas-complexes-b2b",
    category: "B2B",
    date: "28 février 2026",
    readMin: 7,
    title: "Schémas complexes B2B : au-delà du registre du commerce",
    excerpt:
      "Coquilles vides, surfacturations, dirigeants prête-noms — pourquoi la due diligence classique arrive trop tard.",
    body: [
      "En B2B, la fraude ressemble souvent à une entreprise « normale » : bilans présentables, adresse physique, dirigeant identifié. Le piège est dans les liens — entre structures, flux, historiques de paiement.",
      "Un schéma complexe ne se révèle que lorsqu'on relie des dossiers dans le temps et dans l'écosystème. Deux membres du réseau qui n'ont jamais échangé de données métier peuvent néanmoins partager la même alerte sur un montage vu sous un autre angle.",
      "La vérification d'entreprise ne devrait pas se limiter à une photographie à l'instant T. Elle doit intégrer ce que le comportement collectif dit du risque réel.",
      "Cirkles positionne cette lecture comme un complément aux sources ouvertes : moins de cases cochées, plus de signaux actionnables.",
    ],
  },
  {
    slug: "score-fraude-declarations",
    category: "Scoring",
    date: "20 février 2026",
    readMin: 5,
    title: "Score de fraude : pourquoi la déclaration client ne suffit plus",
    excerpt:
      "Ce que le client affirme et ce que ses flux montrent divergent souvent. Le scoring doit croiser les deux.",
    body: [
      "Les questionnaires et déclarations restent utiles — mais ils décrivent une intention, pas un comportement. Les fraudeurs savent remplir les formulaires.",
      "Un score de fraude crédible combine open banking ou relevés OCR, historique transactionnel et similarité avec des profils défaillants observés dans le réseau.",
      "La vitesse compte : une réponse en trente secondes n'a de valeur que si elle est expliquée. Chaque alerte doit pouvoir être justifiée devant un comité risque ou un auditeur.",
      "Refuser moins de bons clients et accepter moins de mauvais : c'est l'équilibre qu'un score enrichi par le collectif vise à tenir.",
    ],
  },
  {
    slug: "ia-explicable-conformite",
    category: "Conformité",
    date: "14 février 2026",
    readMin: 6,
    title: "IA explicable et conformité : anticiper l'AI Act sans ralentir",
    excerpt:
      "Transparence des signaux, traçabilité des décisions — la conformité comme architecture, pas comme couche ajoutée.",
    body: [
      "Les modèles opaques créent de la méfiance en interne comme en régulation. Un score sans explication est un veto automatique — ou pire, une acceptation aveugle.",
      "L'IA explicable by design documente les signaux, leurs pondérations et leur évolution. L'humain garde la décision ; la machine structure l'argumentaire.",
      "RGPD, DSP2, AI Act : les cadres convergent vers plus de responsabilité. Les systèmes qui anticipent cette traçabilité évitent des refontes coûteuses plus tard.",
      "Chez Cirkles, l'explicabilité n'est pas un module optionnel — c'est la condition pour déployer l'intelligence collective à grande échelle.",
    ],
  },
  {
    slug: "fraude-identite-reseau",
    category: "Identité",
    date: "6 février 2026",
    readMin: 5,
    title: "Fraude à l'identité : quand le réseau a déjà vu ce visage",
    excerpt:
      "Deepfakes, usurpation, identités synthétiques — la biométrie seule ne tient plus la promesse sans mémoire collective.",
    body: [
      "La fraude à l'identité a changé d'échelle avec les outils génératifs. Un selfie convaincant ne prouve plus qu'une personne est qui elle prétend être.",
      "Le réseau apporte une couche différente : ce document, ce comportement de connexion, cette combinaison de signaux a déjà produit un incident chez un autre membre — sans exposer les données sources.",
      "La détection ne consiste pas à maintenir une liste noire figée, mais à repérer les configurations statistiques qui précèdent la fraude, y compris pour des individus jamais nommément identifiés.",
      "C'est cette promesse — voir plus tôt, expliquer clairement — qui guide les parcours KYC enrichis par Cirkles.",
    ],
  },
];
