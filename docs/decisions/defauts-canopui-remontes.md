# Défauts CanopUI remontés pendant la refonte store/doc

- **US** : SCRUM-3xx (refonte store/doc)
- **Date** : 2026-09-15
- **Statut** : remontés, non corrigés — arbitrage à venir
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
- **Contournement portail** : **aucun possible**. C'est le seul point de cette liste que le portail
  ne peut pas contourner : la structure du barrel rend le coût inévitable côté consommateur.
- **Demande CanopUI** : exporter **une icône par module** (`canopui/icons/<nom>`), ou découper le
  catalogue de façon à rendre les icônes non utilisées éliminables au build — en conservant si
  besoin l'objet agrégé comme point d'entrée **optionnel**, jamais comme seul accès.

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

## Note finale

Ces huit points, plus l'absence de `Tooltip`, **ne sont pas corrigés**. Martin a décidé de les
**tracer** et d'**arbitrer plus tard** : aucune modification n'a été faite dans CanopUI dans le
cadre de cette refonte.

Ils **concernent tous les portails**, pas seulement ProjectCenter. ProjectCenter est seulement le
portail où ils ont été rencontrés en premier — chaque contournement listé ci-dessus sera
vraisemblablement réinventé, différemment, dans chaque portail tant que la librairie n'aura pas
tranché. C'est le coût réel de ne pas arbitrer, et c'est l'argument à peser au moment de le faire.
