# Décision — Bouton « Télécharger » : raccourci bureau et écran d'accueil

- **US** : SCRUM-3xx (US4 — refonte store/doc, bouton « Télécharger »)
- **Date** : 2026-09-15
- **Statut** : en vigueur
- **Portée** : `src/lib/platform.ts`, `src/lib/desktopShortcut.ts`,
  `src/components/DownloadShortcutButton.tsx`, `src/components/useDownloadShortcutButton.ts`,
  `src/components/AddToHomeSheet.tsx`

## Besoin

Depuis une tuile du store, un utilisateur doit pouvoir créer un raccourci vers l'application :
**sur le bureau** en desktop, **sur l'écran d'accueil** en mobile.

## Contrainte : aucune API navigateur ne sait le faire pour un site tiers

Ce point est la raison d'être de cette décision. Il a été vérifié et accepté avant
implémentation.

- **Écran d'accueil** — l'ajout natif passe par l'installation PWA, pilotée par l'événement
  `beforeinstallprompt`. Cet événement n'est émis **que pour l'origine courante**, et le
  `BeforeInstallPromptEvent.prompt()` n'installe que le manifeste de cette origine. ProjectCenter
  ne peut donc pas proposer l'installation de `departemental.qvl…`, `statbar.qvl…`, etc. : ce sont
  des origines tierces. Aucune API (ni `navigator.share`, ni `Web Share Target`, ni les
  `shortcuts` du manifeste) ne contourne cela — c'est une limite de sécurité voulue, pas un trou
  d'implémentation.
- **Safari iOS / iPadOS** — n'implémente pas `beforeinstallprompt` du tout. L'ajout à l'écran
  d'accueil est **exclusivement** un geste utilisateur dans le menu Partager, et **seul Safari**
  en est capable : Chrome, Firefox et Edge sur iOS ne le proposent pas.
- **Bureau** — une page web n'a aucun accès au système de fichiers de l'utilisateur en dehors
  d'un téléchargement ou d'un `showSaveFilePicker()` (File System Access API, non supporté par
  Safari/Firefox, et qui ne donne de toute façon pas le bureau par défaut). Écrire directement
  sur le bureau est impossible.

## Décision

Un **icon action button** (`IconActionButton` CanopUI, icône `download`) dont le comportement est
choisi à l'exécution par un **mode discriminé** :

| Mode             | Quand                                      | Effet                                              |
| ---------------- | ------------------------------------------ | -------------------------------------------------- |
| `"file"`         | Windows, macOS, Linux                      | Télécharge un vrai fichier raccourci                |
| `"instructions"` | iOS, iPadOS, Android, plateforme inconnue  | Ouvre une feuille d'instructions contextualisée     |
| `"pwa"`          | **non implémenté** — voir « Réévaluation »  | Réservé à l'installation PWA native                |

`resolveShortcutMode()` renvoie `ResolvedShortcutMode = Exclude<DownloadShortcutMode, "pwa">` :
le mode `"pwa"` existe dans le type public et **n'a aucune branche exécutable**. Le jour où il
devient pertinent, il suffit de l'ajouter à `ResolvedShortcutMode` — le compilateur désigne alors
tous les points à compléter, et le contrat du composant (`{ name, url }`) ne bouge pas.

### Formats de raccourci

- **Windows** — `.url`, section `[InternetShortcut]`, **fins de ligne CRLF** (l'Explorateur
  n'interprète pas un `.url` en LF).
- **macOS** — `.webloc`, plist XML avec la clé `URL`.
- **Linux** — `.desktop`, `[Desktop Entry]` / `Type=Link`. Le fichier doit être rendu exécutable
  par l'utilisateur : un `Toast` affiche la ligne `chmod +x` juste après le téléchargement.

Le nom de fichier est dérivé du nom de l'app : caractères interdits (`\ / : * ? " < > |`) et
caractères de contrôle remplacés, espaces normalisés, points/espaces de bord retirés, longueur
plafonnée, repli sur `raccourci` si le résultat est vide. Les accents sont **conservés**
(« DéparteMental » reste « DéparteMental »), les noms collés ne sont pas découpés.

### Défense en profondeur sur l'URL

`buildShortcut()` **lève** pour toute URL non absolue ou non `https://`. L'URL écrite dans le
fichier est le `href` **normalisé par `new URL()`**, ce qui neutralise au passage toute injection
de section (`\r\n[InternetShortcut]`) : le parseur WHATWG supprime les CR/LF de l'entrée. Le XML
du `.webloc` est en plus échappé (`&`, `<`, `>`).

Côté composant, une URL invalide ne casse jamais la tuile : le mode `"file"` retombe sur la
feuille d'instructions, qui affiche le lien. Même repli pour une plateforme inconnue — le bouton
n'est jamais mort et ne lève jamais.

## CSP : `Blob` + `URL.createObjectURL`, pas de `data:`

La CSP du portail est stricte (`default-src 'self'`, injectée en meta au build **et** en header).
Le téléchargement construit un `Blob`, en dérive un object URL, et le pose sur un `<a download>`
cliqué puis retiré ; l'object URL est révoqué après coup.

Une `data:` URL a été écartée : Chrome et Firefox **bloquent la navigation de premier niveau vers
`data:`**, indépendamment de la CSP, et le comportement de `<a download href="data:…">` n'est pas
fiable sur Safari/iOS. `blob:` est same-origin par construction et, à la différence de `data:`,
n'est concerné par aucune de ces règles.

Aucune directive CSP ne régit un téléchargement déclenché par `<a download>` : ni `default-src`
ni `connect-src` ne s'appliquent (`blob:` n'est ici ni chargé, ni navigué, ni exécuté). **Aucune
directive n'a donc été ajoutée à `vite.config.ts`.** Ce point est à **revérifier sur le build de
production** — c'est l'ajout éventuel d'une directive `sandbox` (qui exigerait `allow-downloads`)
qui casserait la fonctionnalité, pas `default-src`.

## Accessibilité

Cible tactile de `2.75rem` (≥ 44 px), nom accessible explicite (`Télécharger un raccourci vers X`
ou `Ajouter X à l'écran d'accueil` selon le mode), infobulle native sur le déclencheur.
Les animations (`transform` seul) sont désactivées sous `prefers-reduced-motion` via
`useReducedMotion`. La feuille est un `SidePanel` CanopUI, construit sur `Modal` MUI : `Échap`
ferme, le focus est piégé pendant l'ouverture et **rendu au bouton déclencheur** à la fermeture,
sans code supplémentaire côté portail.

## Conséquences

- Le bouton s'insère dans le slot `actions?: ReactNode` de `StoreAppCard` (branchement en US5).
- Son `onClick` fait `preventDefault()` + `stopPropagation()` : la tuile est un lien, et sans cela
  un clic sur l'icône déclencherait la navigation de la carte.
- Toute la logique testable est pure et vit dans `src/lib/` — `vitest` tourne en
  `environment: "node"`, sans jsdom.

## Réévaluation — bascule vers le mode `"pwa"`

On passe au mode `"pwa"` le jour où **les applications du store sont servies depuis la même
origine que ProjectCenter** (sous-chemins d'un même domaine plutôt que sous-domaines/domaines
distincts), ou derrière un proxy qui les fait apparaître ainsi. `beforeinstallprompt` devient
alors exploitable et l'installation native remplace le fichier téléchargé sur les plateformes qui
le supportent. Le repli `"instructions"` restera nécessaire pour iOS et iPadOS tant que Safari
n'implémente pas cet événement.

Si l'inventaire d'icônes CanopUI ou l'ajout d'un composant `Tooltip` à la librairie rendent
l'infobulle native inutile, remplacer le `title` du déclencheur par ce composant.
