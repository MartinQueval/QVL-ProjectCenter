# ProjectCenter

Portail des projets QVL — SPA React autonome, sans backend.

## Description

ProjectCenter est le point d'entrée unique vers l'ensemble des projets QVL. C'est une
application monopage (SPA) construite avec **Vite 7**, **React 19** et **TypeScript 5.9**
en mode strict, consommant le design system **canopui**.

## Fonctionnalités cibles

- **Home à 4 sections** : QVL-Studio, QVL-Hobbies, QVL-ToolBox, QVL-CustHome.
- **Cards projet** (titre / description / logo) présentées en **carrousel** ; un clic ouvre
  l'URL du projet.
- **NavBar** à 4 pages (une par section) avec **sous-items** listant les projets de chaque
  section.
- **Pages de documentation par projet** : le contenu est récupéré au runtime depuis le repo
  public `QVL-Documentation` via l'**API GitLab v4** (fetch de
  `{VITE_DOCS_API_PROJECT_URL}/repository/files/{docPath encodé}/raw?ref={VITE_DOCS_REF}`),
  rendu en Markdown sanitisé.

## Stack

- Vite 7 / React 19 / TypeScript 5.9 (strict) / Node >= 20
- react-router-dom v7
- Design system **canopui** (registre npm privé `https://npm.qvl-project.com/`) — épinglé
  en version **hébergée exacte** (`canopui@1.1.0`) depuis Verdaccio (US6 / SCRUM-318). Le
  tarball local reste un outil de dev (`npm run canopui:local`), pas la dépendance de base.

## Environnement

- Registre privé configuré via `.npmrc`.
- Variables d'environnement clés : `VITE_DOCS_API_PROJECT_URL` (projet GitLab de la doc) et
  `VITE_DOCS_REF` (branche). Voir `docs/decisions/docs-source-gitlab-api.md`.
- Démarrage local via le tool **Switch** (dossier `Tools/`).

## Tooling — canopui en local (`npm run canopui:local`)

Le design system **canopui** est consommé en dev via un tarball local
(`canopui.local.tgz`, gitignoré). Le script `tools/canopui-local.sh` (re)build
CanopUI, le packe et l'installe dans ProjectCenter.

**Anti-cache npm.** Chaque pack injecte une version prerelease **unique**
(`X.Y.Z-local.<timestamp>`) et l'installe en `--save`, ce qui synchronise
`package-lock.json` sur cette version + son intégrité fraîche. Sans ça, un
`npm install` ultérieur pouvait restaurer un ancien contenu depuis le cache
(bug vécu : *« Module canopui has no exported member Carousel »*).

**Discipline — ne pas committer le lock `-local`.** Le (ré)install fait
volontairement passer l'entrée `canopui` de `package-lock.json` en
`X.Y.Z-local.<timestamp>`. C'est un **état de dev local** (au même titre que
`canopui.local.tgz`) : il ne doit **jamais** être committé, sinon `npm ci` casse
en CI et sur les autres postes (le tarball local y est absent). La baseline
committée reste `canopui@X.Y.Z` (montée de version réelle = US6).

**Garde-fou automatique.** `canopui-local.sh` arme un hook `pre-commit` versionné
(`core.hooksPath → .githooks`) qui **rejette** tout commit d'un `package-lock.json`
épinglé en `-local`. Pour désindexer le lock avant de committer :

```bash
git restore --staged package-lock.json   # le working tree peut rester en -local
```

Le contrôle est factorisé dans `tools/check-lock-no-local.sh` :
- `bash tools/check-lock-no-local.sh --staged` → utilisé par le hook (version indexée) ;
- `bash tools/check-lock-no-local.sh` → contrôle le fichier sur disque, **réutilisable tel
  quel par un job CI** (recommandé comme filet serveur quand une CI sera en place).

Armement manuel (si le script n'a jamais été lancé sur ce clone) :

```bash
git config core.hooksPath .githooks
```

## Hébergement (US6 / SCRUM-318)

- **Hôte retenu : nginx local QVL**, le même serveur que `npm.qvl-project.com`
  (Verdaccio) et `canopui.qvl-project.com` (vitrine). Nouveau vhost
  `projectcenter.qvl-project.com`, artefacts servis depuis `C:\QVL\deploy\projectcenter`
  (`/mnt/c/QVL/deploy/projectcenter` côté WSL) — pattern aligné sur le `deploy-vitrine` de
  CanopUI. Déploiement via `npm run deploy:local` (`tools/deploy-local.sh`, copie atomique).
- **Deep-links : rewrite serveur → `index.html`.** L'app utilise
  `createBrowserRouter` (react-router v7) : un accès direct à une route profonde doit
  retomber sur `index.html`. nginx le permet nativement (`try_files $uri $uri/ /index.html;`),
  donc **pas de repli HashRouter nécessaire**. Config : `deploy/nginx/projectcenter.qvl-project.com.conf`.
- **CSP en défense en profondeur : meta tag (build) + header HTTP (nginx) — MÊME politique.**
  La CSP validée par la Gate sécu 2 est portée aux **deux niveaux**, avec la **même valeur**
  (leur intersection navigateur est donc l'identité, pas un durcissement mutuel) :
  - **meta** `http-equiv="Content-Security-Policy"` injecté dans `dist/index.html` au
    **build uniquement** (plugin `projectcenter-csp-meta` dans `vite.config.ts`, `apply: "build"`) :
    garantit la politique au niveau de l'artefact, indépendamment de l'hôte. L'injection est
    réservée au build car en dev, react-refresh (HMR) injecte un script inline que
    `script-src 'self'` bloquerait — le dev server resterait cassé.
  - **header HTTP** délivré par nginx (`deploy/nginx/projectcenter.qvl-project.com.conf`) :
    protège aussi les requêtes ne passant pas par `index.html`.

  Directives (finales Gate 2) : `default-src 'self'` ; `connect-src 'self' https://gitlab.com`
  (fetch docs via l'API GitLab v4) ; `img-src 'self' data: https://gitlab.com https://img.shields.io`
  (images des READMEs + **badges shields.io** whitelistés Gate 2) ;
  `style-src 'self' 'unsafe-inline'` — **`unsafe-inline` requis** car MUI/emotion (via canopui)
  injectent leurs styles en balises `<style>` inline au runtime ; `font-src 'self' data:` ;
  `script-src 'self'` ; `base-uri 'self'` ; `form-action 'self'` ; `object-src 'none'`.
  **Seul écart voulu entre les deux** : `frame-ancestors 'none'` figure **uniquement dans le
  header nginx** (le navigateur ignore `frame-ancestors` en meta). Le header ajoute aussi
  `X-Content-Type-Options: nosniff`, `Referrer-Policy` et `server_tokens off` (finding SEC-318-01).
- **Décision Gate sécu 2 — police Chivo (Google Fonts) volontairement bloquée.**
  `canopui/styles.css` fait un `@import "https://fonts.googleapis.com/..."` (police Chivo, fichiers
  servis par `fonts.gstatic.com`). Ces hôtes ne sont **pas** whitelistés : sous CSP, le `@import`
  et les fontes sont bloqués et Chivo retombe sur la stack de polices système (**pas de casse
  fonctionnelle**). La Gate 2 a tranché de **ne pas élargir** `style-src`/`font-src` vers Google ;
  la **cible** est le **self-host de Chivo dans canopui** (surface CSP inchangée). C'est
  aujourd'hui la seule violation CSP console attendue en fonctionnement.

## Statut

Repository initialisé. Le scaffold applicatif et les fonctionnalités sont suivis dans Jira
(US0 → US6, projet SCRUM).
