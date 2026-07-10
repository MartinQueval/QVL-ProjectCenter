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
  public `Documentation` (fetch de `VITE_DOCS_BASE_URL` + `docPath`), rendu en Markdown
  sanitisé.

## Stack

- Vite 7 / React 19 / TypeScript 5.9 (strict) / Node >= 20
- react-router-dom v7
- Design system **canopui** (registre npm privé `https://npm.qvl-project.com/`) — consommé
  en dev via tarball local (`npm pack`).

## Environnement

- Registre privé configuré via `.npmrc`.
- Variable d'environnement clé : `VITE_DOCS_BASE_URL` (base des docs distantes).
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

## Statut

Repository initialisé. Le scaffold applicatif et les fonctionnalités sont suivis dans Jira
(US0 → US6, projet SCRUM).
