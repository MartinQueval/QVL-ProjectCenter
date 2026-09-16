# Défauts CanopUI remontés pendant la refonte store/doc

- **US** : SCRUM-3xx (refonte store/doc), complété par les ajustements store du 2026-09-15
  (points 9 à 13), par le chantier i18n du 2026-09-15 (points 14 et 15) et par les ajustements
  titre/icônes du 2026-09-16 (points 16 et 17, précision au point 4) et par l'ajustement de la
  barre de titre sur téléphone du 2026-09-16 (point 18)
- **Date** : 2026-09-16
- **Statut** : remontés, arbitrage à venir — **sauf le point 14, corrigé par CanopUI 3.1.0**
  (2026-09-15, `CanopHeadingSize` ouvert à `6`)
- **Portée** : CanopUI (`C:\4 - PROJETS\QVL-CanopUI`) — **tous les portails**, pas seulement ProjectCenter
- **Décision de Martin** : tracer maintenant, décider plus tard

## Pourquoi ce document

La règle des **portails légers** impose de ne pas absorber dans un portail ce qui relève de la
librairie. Chaque limitation rencontrée pendant la refonte a donc été **remontée** ici plutôt que
contournée silencieusement. Les contournements décrits ci-dessous sont **locaux, assumés et
temporaires** : ils documentent une dette, ils ne la légitiment pas.

**Aucun de ces points n'est corrigé ici.** Ce document est un constat, pas un plan d'action.

---

## Manque préalable — aucun composant `Tooltip` dans CanopUI

Ce n'est pas un défaut de composant : c'est une **absence pure**. L'inventaire complet des
composants exportés a été vérifié dans `components/index.d.ts` — **CanopUI n'expose aucun
`Tooltip`**, sous aucun nom.

- **Impact** : l'icon action button du store n'a aucun moyen d'exposer son intitulé au survol.
- **Contournement portail** : attribut `title` natif du DOM, faute de mieux. Apparence non
  maîtrisée, délai d'affichage non réglable, non stylable, et inaccessible au clavier.
- **Demande CanopUI** : ajouter un composant `Tooltip` à la librairie.

---

## 1. `Button` ne sait pas être un lien

**Le plus visible pour l'utilisateur d'un store** — c'est le défaut à traiter en premier.

- **Constat** : `CanopButtonProps` n'expose ni `href`, ni `target`, ni `rel`, ni `component`.
  Un `Button` ne peut rendre qu'un `<button>`.
- **Impact** : le bouton « Ouvrir » du store déclenche
  `window.open(url, "_blank", "noopener,noreferrer")`. Les protections sont **identiques** à celles
  d'un lien correctement configuré (`noopener`, `noreferrer`) — la sécurité n'est pas en cause.
  Ce qui est perdu relève de l'usage et de la sémantique :
  - **perte du clic-milieu** (ouverture en arrière-plan) ;
  - **perte du « ouvrir dans un nouvel onglet »** du menu contextuel ;
  - perte de la **sémantique de lien** (l'élément s'annonce comme bouton et non comme lien ;
    pas d'URL au survol, pas de copie d'adresse, pas de prise en charge par le navigateur).

  Dans un **store**, où l'action principale de chaque tuile est d'aller vers une application,
  ces gestes sont exactement ceux que l'utilisateur attend.
- **Contournement portail** : `window.open(url, "_blank", "noopener,noreferrer")`.
- **Demande CanopUI** : ajouter `href` / `target` / `rel` sur `CanopButtonProps`, avec rendu en
  `<a>` dès que `href` est présent.

## 2. `Button` n'a pas d'`ariaLabel`

- **Constat** : aucune prop ne permet de fournir un nom accessible à un bouton dont le contenu
  visible est insuffisant (bouton icône, libellé tronqué).
- **Impact** : un bouton icône est annoncé sans intitulé exploitable par les lecteurs d'écran.
- **Contournement portail** : composant `VisuallyHidden` local, dont le texte est placé dans le
  bouton pour lui donner un nom accessible.
- **Demande CanopUI** : ajouter une prop `ariaLabel` sur `Button`.

## 3. `Link` ne transmet pas sa couleur à un titre cliquable

- **Constat** : `Link` applique `fontSize` et `color` dans son **propre `sx`**, sur l'élément `<a>`.
  Un `Heading` placé à l'intérieur pose lui aussi `fontSize` et `color` dans son `sx` : il
  **n'hérite donc ni de la taille ni de la couleur du lien**. La taille du titre est préservée
  (aucun plafonnement ne s'applique), mais **sa couleur de lien est perdue**.
- **Impact** : un titre cliquable ne se signale plus comme un lien — il reste à la couleur de texte
  par défaut tant que la couleur n'est pas reposée à la main.
- **Contournement portail** : la **couleur du lien est repassée à la main** sur le `Heading`
  (`color="var(--canop-palette-primary-main)"`), dans `StoreAppCard.tsx` et `StoreHeroTile.tsx` —
  une constante de couleur dupliquée dans le portail, qui dérivera de la palette au premier
  changement de thème.
- **Demande CanopUI** : que `Link` **propage sa couleur** à ses enfants (ou expose un
  `size="inherit"` / `color="inherit"` cohérent), et une prop `ariaLabel`.

## 4. `PageContent title` rend un `Heading level={2}` sans option

- **Constat** : la prop `title` de `PageContent` rend systématiquement un `Heading level={2}`.
  Le niveau n'est pas paramétrable.
- **Impact** : **aucune page ne peut avoir de `h1`** par ce biais. La hiérarchie des titres démarre
  au niveau 2, ce qui casse le plan du document pour les lecteurs d'écran et la navigation par
  titres, sur toutes les pages construites avec `PageContent`.
- **Contournement portail** : les `Heading level={1}` sont **rendus à la main**, en dehors de la
  prop `title` — qui n'est donc pas utilisée pour le titre principal.
- **Précision (2026-09-16)** : `PageScaffold`, lui, **fait bien un vrai `<h1>`** — `PageHeader` rend
  le `title` en `Typography component="h1"` et expose en plus un `subtitle`. Le défaut ne porte donc
  que sur `PageContent`. Le titre du store est passé à `PageScaffold title` / `subtitle`
  (`usePageHeader.ts`), ce qui rend le `h1` sans aucun contournement ni titre masqué. Les pages doc
  continuent de rendre leur `Heading level={1}` à la main.
- **Demande CanopUI** : ajouter une prop `headingLevel` sur `PageContent`.

## 5. `Card onClick` n'est accessible au clavier qu'en `variant="interactive"`

**Le plus sournois du lot : rien ne prévient.**

- **Constat** : `role`, `tabIndex` et `onKeyDown` ne sont câblés par `Card` que lorsque
  `variant="interactive"`. Ils sont conditionnés à la **variante**, pas à la présence d'`onClick`.
- **Impact** : avec **toute autre variante**, une `Card` munie d'un `onClick` reste cliquable à la
  souris mais devient **morte au clavier** — non focusable, insensible à Entrée et Espace.
  La défaillance est **silencieuse** : aucune erreur, aucun avertissement, aucun signe visuel.
  Le développeur croit son composant accessible, il ne l'est pas. Le défaut ne se voit qu'en
  testant explicitement au clavier.
- **Contournement portail** : usage systématique de `variant="interactive"` dès qu'une carte porte
  un `onClick`, ce qui **contraint le choix visuel** à un impératif d'accessibilité.
- **Demande CanopUI** : câbler `role` / `tabIndex` / `onKeyDown` **dès qu'`onClick` est présent**,
  quelle que soit la variante — ou, à défaut, **avertir en développement** lorsqu'un `onClick` est
  passé à une variante non interactive.

## 6. Pas de troncature multi-lignes dans `Text` / `Heading`

- **Constat** : aucune prop de troncature sur plusieurs lignes. Les descriptions d'applications, de
  longueur variable, débordent et cassent l'alignement de la grille du store.
- **Impact** : hauteurs de tuiles irrégulières, grille visuellement désordonnée.
- **Contournement portail** : clamp à 2 lignes en **style local**, via `-webkit-box`
  (`display: -webkit-box`, `-webkit-line-clamp: 2`, `-webkit-box-orient: vertical`,
  `overflow: hidden`). Du CSS préfixé recopié dans le portail, à la charge du portail — exactement
  ce que la règle des portails légers cherche à éviter.
- **Demande CanopUI** : ajouter une prop `clamp?: number` sur `Text`.

## 7. `StatusChip` s'étire en enfant direct d'un `Stack` colonne

- **Constat** : `StatusChip` est en `inline-flex`. Placé en enfant direct d'un `Stack` en colonne
  (dont l'alignement par défaut est `stretch`), il est **étiré sur toute la largeur** au lieu de se
  dimensionner à son contenu.
- **Impact** : puce déformée, occupant toute la largeur de la colonne.
- **Contournement portail** : emballer le `StatusChip` dans un `Stack` en **ligne**, ajoutant un
  niveau de balisage dont la seule raison d'être est de neutraliser l'étirement.
- **Demande CanopUI** : corriger le dimensionnement, ou **au minimum le documenter** — c'est le
  point le moins coûteux à traiter des huit.

## 8. Le catalogue d'icônes est un barrel statique : rien n'est éliminable au build

**Le plus coûteux du lot, et le seul qui se paie sur tous les portails à chaque chargement.**

- **Constat** : `canopui/dist/components/Icon/icons.js` est un **barrel statique** — **233 `import`
  statiques** couvrant **510 SVG**, agrégés dans **un seul objet** exporté. Importer `Icon`, ou
  n'importe quel composant qui en dépend, fait entrer **tout le catalogue** dans le graphe de
  modules. Comme l'objet est indexé dynamiquement par nom d'icône, **aucun bundler ne peut prouver
  qu'une icône est inutilisée** : le tree-shaking ne peut rien éliminer.
- **Impact mesuré** : **155,3 kB dans le bundle d'entrée de chaque portail** — **premier poste du
  bundle, devant react-dom**. ProjectCenter n'utilise qu'une poignée d'icônes ; il paie les 510.
  L'impact porte sur **tous les portails QVL**, sur le **premier chargement**, donc directement sur
  le temps d'affichage en mobile et en réseau lent.
- **Contournement portail** : **aucun possible** (comme le point 17) : la structure du barrel rend
  le coût inévitable côté consommateur.
- **Demande CanopUI** : exporter **une icône par module** (`canopui/icons/<nom>`), ou découper le
  catalogue de façon à rendre les icônes non utilisées éliminables au build — en conservant si
  besoin l'objet agrégé comme point d'entrée **optionnel**, jamais comme seul accès.

## 9. `Toolbar` : le fond de la recherche est un squircle, son trait de bordure non

**Constaté en production, signalé par Martin (ajustements store, 2026-09-15).**

- **Constat** : `ToolbarSearch` habille le `OutlinedInput` de MUI avec `squircleSurface`
  (`shape: "pill"`, rayon `1.375rem`) — le **fond** suit donc bien la superellipse. Mais le
  `fieldset.MuiOutlinedInput-notchedOutline` que MUI rend par-dessus reste sur un
  `border-radius` **classique**, et c'est lui qui porte le trait au repos, au survol et au focus.
  Les deux formes ne coïncident pas : le trait déborde du fond dans les coins.
- **Impact** : visible à l'œil nu partout où `Toolbar search` est utilisé, et d'autant plus sur
  mobile où la barre est posée sur une surface. C'est le seul endroit de l'interface où la forme
  CanopUI 3 se contredit elle-même.
- **Contournement portail** : dans `useStickySearch.ts`, le trait du `notchedOutline` est **annulé**
  (`borderWidth: 0`) et l'indicateur de focus est **reconstruit** en anneau squircle, via
  `squircleSurface({ borderColor, borderWidth })` appliqué sur `.MuiOutlinedInput-root.Mui-focused`.
  Le portail atteint donc une classe interne de MUI (`.MuiOutlinedInput-notchedOutline`) à travers
  un composant CanopUI : c'est fragile par nature, et cela casserait au premier changement
  d'implémentation de `ToolbarSearch`.
- **Demande CanopUI** : neutraliser le `notchedOutline` dans `ToolbarSearch` et porter bordure et
  anneau de focus par le même `squircleSurface` que le fond.

## 10. `IconActionButton` n'a pas de variante d'accent

- **Constat** : `CanopIconActionButtonVariant` vaut `"default" | "danger" | "secondary"`. La
  couleur d'accent de la palette (`accent.main`), pourtant présente dans le thème et exposée en
  `--canop-palette-accent-*`, n'est atteignable par aucune variante.
- **Impact** : impossible de faire ressortir une action secondaire mais désirable — exactement le
  cas du bouton de téléchargement du store, que Martin veut « en couleur d'accent » pour qu'il se
  détache des deux autres actions de la tuile.
- **Contournement portail** : `useStoreIconAction.ts` repeint le bouton depuis un `Box` parent, en
  visant `.MuiIconButton-root` et son `::before` (le fond squircle) — encore une classe interne de
  MUI atteinte depuis le portail, et une réimplémentation de la logique de survol de la librairie.
- **Demande CanopUI** : ajouter une variante `accent` à `IconActionButton` (fond `accent.main`,
  survol `accent.dark`, glyphe `accent.contrastText`).

## 11. Aucune surface « verre dépoli » pour poser du texte sur `CanopyBackground`

- **Constat** : `CanopyBackground` est un fond **animé** (vidéo). CanopUI n'expose aucune surface
  translucide floutée à poser dessus : `Card` est opaque et porte une élévation de carte, et rien
  n'expose `backdrop-filter`. Or tout texte posé directement sur la canopée est illisible par
  intermittence, puisque le fond change en permanence — un contraste calculé sur une image fixe ne
  dit rien de la lisibilité réelle.
- **Impact** : chaque portail qui utilise le fond canopée doit réinventer la même surface pour ses
  titres de page et ses accroches de section.
- **Contournement portail** : `frostedPanelSx.ts` / `FrostedPanel.tsx`, construits sur
  `squircleClip` + `backdrop-filter` + un voile `color-mix` dérivé de `surface.base` (donc
  théo-dépendant), avec repli opaque sous `@supports not`.
- **Demande CanopUI** : exposer une surface floutée (`Surface variant="frosted"`, ou une option de
  `Card`) prévue pour être posée sur `CanopyBackground`.

## 12. `Text tone="secondary"` désigne le **vert** de la palette, pas le texte secondaire

**Le piège de nommage qui a causé le défaut de lisibilité signalé en production.**

- **Constat** : `CanopTextTone` mélange deux familles dans une seule union. Les tons *sémantiques*
  du texte sont `default` / `muted` / `subtle` (respectivement `text.primary`, `text.secondary`,
  `text.disabled`), et à côté sont déversées les couleurs de palette `primary`, `secondary`,
  `accent`… Écrire `tone="secondary"` ne donne donc **pas** la couleur de texte secondaire
  (`text.secondary`) mais le **vert sauge de la palette** (`secondary.main`, `#8f9a74` en clair,
  `#a9b48c` en sombre) — et rien ne le signale.
- **Impact** : toutes les accroches et descriptions du portail étaient en vert sur le fond canopée,
  d'où l'illisibilité constatée par Martin. Le nom `secondary` est le premier auquel on pense pour
  un texte secondaire, et c'est le seul qui donne une couleur décorative.
- **Contournement portail** : aucun — c'est un usage fautif, corrigé en passant tous les textes
  secondaires du store et de la doc en `tone="muted"`.
- **Demande CanopUI** : séparer les deux familles (ton sémantique vs couleur de palette), ou
  renommer pour lever l'ambiguïté (`tone="text-secondary"` / `color="secondary"`).

## 13. `Stack direction="row"` ne protège pas ses enfants du `min-width: auto`

**Constaté en production, signalé par Martin (cartes coupées sur mobile, 2026-09-15).**

- **Constat** : `Stack` se pose bien `minWidth: 0` **à lui-même**, mais ne pose rien **sur ses
  enfants**. `CardGrid`, lui, le fait (`& > * { minWidth: 0 }`) — la librairie connaît donc le
  piège et ne le traite qu'à un seul endroit. Conséquence : tout enfant d'un `Stack` en ligne qui
  n'est pas lui-même un `Stack` — un `Heading`, un `Text` — reste en `min-width: auto` et refuse de
  descendre sous la largeur de son mot le plus long.
- **Impact** : `Heading` pose pourtant `overflowWrap: "break-word"`, mais cette propriété
  **n'abaisse pas la taille min-content** : le titre déborde au lieu de se couper en deux lignes.
  Comme `Card fill` met son `CardContent` en `overflow: hidden`, le débordement est **rogné net** —
  le titre est tranché en plein mot, sans ellipse ni indice. C'est le défaut vu en production sur
  les tuiles du store en 320 px.
- **Contournement portail** : chaque titre de carte est emballé dans un `<Stack fill>`
  (`StoreCardTitle.tsx`), dont le `minWidth: 0` interne fait ce que le parent aurait dû faire. Un
  niveau de balisage dont la seule raison d'être est de neutraliser le `min-width: auto` — même
  nature que le contournement du point 7.
- **Demande CanopUI** : poser `& > * { minWidth: 0 }` sur `Stack` en `direction="row"`, comme
  `CardGrid` le fait déjà, et/ou exposer une prop de troncature sur `Heading` (pendant du `clamp`
  demandé au point 6 pour `Text`).

## 14. `Heading` s'arrêtait à `size={5}` : aucun cran sous `h5` — **résolu en CanopUI 3.1.0**

- **Constat (avant 3.1.0)** : `CanopHeadingSize` valait `1 | 2 | 3 | 4 | 5` et l'échelle s'arrêtait à
  `tokens.typography.heading.h5` (`1.333rem`). `StoreHeroTile` était **déjà** en
  `size={{ xs: 5, md: 4 }}`, donc au plus petit palier existant sous `md`.
- **Impact (avant 3.1.0)** : la décision « réduire le titre d'un cran sur petit écran » n'était pas
  exprimable sans sortir de l'échelle du thème.
- **Correction CanopUI 3.1.0** : `CanopHeadingSize` accepte `6`, avec
  `tokens.typography.heading.h6 = 1rem` — dernier cran de la gamme de raison 1,333, police, graisse
  et interlignage identiques aux autres paliers ; les paliers 1 à 5 sont inchangés.
- **Suite côté portail (2026-09-15)** : `StoreHeroTile` passe en `size={{ xs: 6, md: 4 }}`.
  Aucun contournement n'a jamais été posé, il n'y a donc rien à retirer.
- **Réserve mesurée** : à 320 px, la largeur laissée au titre d'une grande tuile est **8,25 rem**
  (320 px → gouttières `PageContent` `sm` → `FrostedPanel` `hero` `md` → gouttière de slide du
  `Carousel` `sm` → `CardContent` `comfortable` → logo `md` 3 rem + `gap="sm"`). « DéparteMental »
  en Titan One à `1rem` y tient **de justesse** : la réduction d'un cran rend exactement 25 % de
  largeur, pour un dépassement mesuré du même ordre. À vérifier au rendu réel avant de clore.

## 15. `CanopI18nProvider` ne détecte pas la langue du navigateur

- **Constat** : le provider lit la langue **stockée** (`storageKey`), et retombe sinon sur la prop
  `locale`, dont la valeur par défaut est `"fr"` en dur. Aucune lecture de `navigator.languages`.
- **Impact** : un visiteur anglophone qui arrive pour la première fois voit l'interface en
  français. Chaque portail doit réécrire la même détection et la passer en `locale`.
- **Contournement portail** : `src/i18n/browserLocale.ts` (`detectBrowserLocale` /
  `navigatorLocale`), dont le résultat est passé en `locale` au provider — le repli du provider
  devient la langue du navigateur, le choix mémorisé restant prioritaire.
- **Demande CanopUI** : détecter `navigator.languages` dans `CanopI18nProvider` (entre le choix
  stocké et la prop `locale`), ou exposer l'utilitaire de détection depuis `canopui/i18n`.

## 16. La taille d'`Icon` est une échelle fermée, étrangère à l'échelle des titres

**Constaté le 2026-09-16 (icônes de section du store demandées à la hauteur du titre).**

- **Constat** : `CanopIconSize` vaut `xs | sm | md | lg | xl` (`1` / `1.25` / `1.5` / `2` / `3` rem),
  une échelle **fermée**, **non responsive** et **sans rapport avec `tokens.typography.heading`**
  (`h4` = `1.777rem`, `h5` = `1.333rem`). `Icon` n'accepte ni valeur en `em`, ni `"inherit"`, ni
  objet par point de rupture — la taille est posée en attributs `width`/`height` sur le SVG.
- **Impact** : une icône posée à côté d'un `Heading` ne peut pas être mise à la hauteur de sa police.
  Sur un titre responsive (`size={{ xs: 5, md: 4 }}`), aucun palier ne convient aux deux largeurs :
  `sm` est trop petit de 6 % sous `md`, `md` trop petit de 16 % au-dessus.
- **Contournement portail** : `HeadingIcon.tsx` + `headingIconSx.ts` — un `Box` qui **réécrit en CSS
  la taille du `<svg>` rendu par `Icon`** (`& svg { width, height }`), avec une valeur responsive
  dérivée de `tokens.typography.heading`. Le portail atteint donc l'élément interne d'un composant
  CanopUI, et casserait si `Icon` changeait de rendu.
- **Demande CanopUI** : accepter sur `Icon` une taille alignée sur la typographie — `size="inherit"`
  (SVG en `1em`, donc suivant la police du parent) et/ou une taille responsive
  `size={{ xs: …, md: … }}` comme `Heading`.

## 17. `PageScaffold` rend deux `h1` sur une même page

**Constaté le 2026-09-16 sur le rendu réel à 1280 px, pendant la reprise du titre du store.**

- **Constat** : la marque de la barre latérale de `PageScaffold` (« ProjectCenter ») est rendue
  comme **titre de niveau 1**, et `PageHeader` rend le `title` de la page en un **second niveau 1**
  (« QVL Store » au moment de la mesure). Les deux `h1` coexistent donc sur toute page construite
  avec `PageScaffold` dès que la barre latérale est visible. À **375 px**, la barre latérale est
  masquée et il n'en reste qu'un — le défaut ne se voit qu'à partir des largeurs desktop.
- **Impact** : deux titres principaux concurrents sur une même page. Le plan du document devient
  ambigu pour les lecteurs d'écran et pour la navigation par titres : le titre de la page ne se
  distingue plus du nom du produit, qui est répété sur **toutes** les pages du portail.
- **Contournement portail** : **aucun possible**. Les deux titres sont rendus par la librairie —
  ni la marque de la barre latérale ni le `title` de `PageHeader` ne sont paramétrables en niveau
  de titre depuis le portail. C'est, avec les points 8 et 18, l'un des trois défauts non
  contournables de la liste.
- **Demande CanopUI** : que la marque de la barre latérale **ne soit pas un titre de niveau 1** —
  un simple texte, ou un lien vers l'accueil, suffit — afin que le `title` de `PageHeader` soit le
  **seul `h1` de la page**.

## 18. `PageHeader` réserve la place du bouton de réglages sur toute sa hauteur

**Constaté le 2026-09-16 sur le rendu réel à 375 px, pendant la réduction de la barre de titre.**

- **Constat** : `PageHeader` pose
  `paddingRight: { xs: avoidPageTopRight("1rem"), md: avoidPageTopRight("2.5rem") }`, soit
  `max(base, var(--canop-page-top-right-inset, 0rem))`. Sur mobile, `NavbarMobileLayout` remplit cet
  inset avec `NAVBAR_MOBILE_SETTINGS_FOOTPRINT`, c'est-à-dire
  `calc(env(safe-area-inset-right, 0rem) + 2.75rem + 2 * 0.75rem)` — **4,25 rem** hors encoche, pour
  l'empreinte du bouton de réglages (thème / langue) ancré en haut à droite. La mesure relevée sur
  capture, **76,5 px à 375 px de large**, correspond à ces 4,25 rem (l'écart avec 68 px tient à la
  taille de police racine effective ou à l'encoche de l'appareil).
- **Impact** : ce retrait s'applique à **toute la hauteur du `<header>`**, alors que le bouton
  n'occupe que son premier carré. À 375 px, il consomme **21 % de la largeur de texte disponible**
  et c'est lui qui fait passer le titre du store sur deux lignes, donc qui gonfle la barre de titre.
  Toutes les lignes du titre paient la place d'un bouton qui n'est en regard que de la première.
- **Contournement portail** : **aucun posé, et aucun souhaitable** — l'inset comme le padding sont
  calculés par la librairie ; un portail ne pourrait que réécrire le `sx` de `PageHeader`, ce qui
  n'est pas exposé. Le portail a traité le **symptôme** (masquage du sous-titre sous `sm`,
  `usePageHeader.ts`), pas la cause.
- **Demande CanopUI** : n'appliquer l'inset qu'au **flux de la première ligne** plutôt qu'au padding
  du bloc — par exemple via un `float`/`shape` ou un élément fantôme de la taille du bouton — ou, à
  défaut, ne réserver la place qu'en regard du titre et laisser le sous-titre et les lignes
  suivantes occuper la pleine largeur.

---

## Récapitulatif des demandes d'API

| # | Composant | Demande CanopUI |
|---|-----------|-----------------|
| — | (absent) | ajouter un composant `Tooltip` |
| 1 | `Button` | `href` / `target` / `rel` sur `CanopButtonProps` |
| 2 | `Button` | prop `ariaLabel` |
| 3 | `Link` | propager la couleur du lien aux enfants (`color`/`size` hérités) + `ariaLabel` |
| 4 | `PageContent` | prop `headingLevel` |
| 5 | `Card` | câbler l'accessibilité dès `onClick`, ou avertir en développement |
| 6 | `Text` | prop `clamp?: number` |
| 7 | `StatusChip` | corriger le dimensionnement, ou le documenter |
| 8 | `Icon` | sortir du barrel statique : un module par icône, icônes inutilisées éliminables |
| 9 | `Toolbar` | neutraliser le `notchedOutline` et porter bordure et focus par le `squircleSurface` du fond |
| 10 | `IconActionButton` | ajouter une variante `accent` |
| 11 | (absent) | une surface floutée à poser sur `CanopyBackground` |
| 12 | `Text` | lever l'ambiguïté de `tone="secondary"` (couleur de palette, pas texte secondaire) |
| 13 | `Stack` | `& > * { minWidth: 0 }` en `direction="row"`, comme `CardGrid` ; troncature sur `Heading` |
| 14 | `Heading` | ~~étendre l'échelle d'un palier et ouvrir `CanopHeadingSize` à `6`~~ — **livré en 3.1.0** |
| 15 | `CanopI18nProvider` | détecter `navigator.languages`, ou exposer l'utilitaire de détection |
| 16 | `Icon` | `size="inherit"` (SVG en `1em`) et/ou taille responsive, pour suivre l'échelle des titres |
| 17 | `PageScaffold` | que la marque de la barre latérale ne soit pas un `h1`, pour laisser `PageHeader` seul titre de niveau 1 |
| 18 | `PageHeader` | ne réserver la place du bouton de réglages qu'en regard de la première ligne, au lieu d'un padding droit de 4,25 rem sur toute la hauteur |

## Note finale

Le point 14 est **corrigé** par CanopUI 3.1.0. Les dix-sept autres, plus l'absence de `Tooltip`,
**ne le sont pas** : Martin a décidé de les **tracer** et d'**arbitrer plus tard**.

Ils **concernent tous les portails**, pas seulement ProjectCenter. ProjectCenter est seulement le
portail où ils ont été rencontrés en premier — chaque contournement listé ci-dessus sera
vraisemblablement réinventé, différemment, dans chaque portail tant que la librairie n'aura pas
tranché. C'est le coût réel de ne pas arbitrer, et c'est l'argument à peser au moment de le faire.
