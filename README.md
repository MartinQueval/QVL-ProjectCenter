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

## Statut

Repository initialisé. Le scaffold applicatif et les fonctionnalités sont suivis dans Jira
(US0 → US6, projet SCRUM).
