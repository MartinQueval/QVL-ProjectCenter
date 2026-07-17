# Décision — Source des documentations distantes (VITE_DOCS_BASE_URL)

> **REMPLACÉE le 2026-07-16** par [`docs-source-gitlab-api.md`](./docs-source-gitlab-api.md).
> Le repo `QVL-Documentation` (projet GitLab 84403403) est passé public : la doc est désormais
> servie directement via l'API GitLab v4 (CORS `*` vérifié), et `VITE_DOCS_BASE_URL` est supprimée
> au profit de `VITE_DOCS_API_PROJECT_URL` + `VITE_DOCS_REF`. Contenu ci-dessous conservé pour
> historique.

- **US** : SCRUM-312 (US0 — Setup infra, ProjectCenter)
- **Date du spike** : 2026-07-09
- **Statut** : remplacé
- **Valeur retenue** : `VITE_DOCS_BASE_URL=https://raw.githubusercontent.com/QVL-Studio/Documentation/main/`

## Contexte

Les pages de documentation par projet sont récupérées **au runtime, côté navigateur**
(`fetch(VITE_DOCS_BASE_URL + docPath)`) depuis le repo public `Documentation`, puis rendues
en Markdown. Un fetch navigateur cross-origin n'aboutit que si la réponse porte l'en-tête
`Access-Control-Allow-Origin` (CORS) compatible avec l'origine de dev (ex. `http://localhost:3002`).

Le spike vérifie **réellement** (curl, en-têtes bruts) quelle source est fetchable depuis un
navigateur, avec une base d'URL compatible avec la concaténation `base + docPath`.

## Méthode

`curl` avec en-tête `Origin: http://localhost:3002`, inspection des en-têtes de réponse
(préflight `OPTIONS` + `GET`). Trois sources candidates testées.

## Résultats bruts

### 1. API GitLab raw v4 — `https://gitlab.com/api/v4/projects/qvl-studio%2FDocumentation/repository/files/README.md/raw?ref=main`

Préflight `OPTIONS` (`Origin` + `Access-Control-Request-Method: GET`) :

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
access-control-allow-methods: GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS
access-control-max-age: 7200
```

`GET` (`Origin: http://localhost:3002`) :

```
HTTP/1.1 404 Not Found
Access-Control-Allow-Origin: *
Vary: Origin
Content-Type: application/json
```

→ CORS **OK** (en-têtes `Access-Control-Allow-Origin: *` présents sur préflight et GET),
**mais** la ressource répond `404` (le repo `qvl-studio/Documentation` n'est pas résolvable
publiquement via l'API dans cet environnement). De plus, la forme d'URL de l'API v4 exige
l'encodage du chemin de fichier + le suffixe `?ref=main`, **incompatible avec une simple
concaténation `base + docPath`**.

### 2. Route web « raw » GitLab — `https://gitlab.com/qvl-studio/Documentation/-/raw/main/README.md`

`GET` (`Origin: http://localhost:3002`) :

```
HTTP/1.1 302 Found
Content-Type: text/html; charset=utf-8
(aucun en-tête Access-Control-Allow-Origin)
```

→ CORS **KO** : redirection `302` (repo non résolu → redirection) **sans** en-tête
`Access-Control-Allow-Origin`. Inutilisable pour un fetch navigateur.

### 3. Miroir GitHub raw — `https://raw.githubusercontent.com/QVL-Studio/Documentation/main/README.md`

`GET` (`Origin: http://localhost:3002`) :

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: text/plain; charset=utf-8
Vary: Authorization,Accept-Encoding
```

→ CORS **OK** (`Access-Control-Allow-Origin: *`), **contenu réellement servi** (`200 OK`),
et base d'URL compatible avec la concaténation `base + docPath`.

## Décision

Source retenue : **miroir GitHub raw public de Documentation**.

Justification : c'est la seule des trois sources qui est simultanément (a) fetchable en
navigateur (CORS `*`), (b) retourne effectivement le contenu (`200`), et (c) s'utilise par
simple concaténation `VITE_DOCS_BASE_URL + docPath`. L'API GitLab v4, bien que CORS-OK,
renvoie `404` ici et impose une forme d'URL (encodage + `?ref=`) incompatible avec le modèle
de fetch ; la route web `/-/raw/` est CORS-KO (302 sans en-tête).

```
VITE_DOCS_BASE_URL=https://raw.githubusercontent.com/QVL-Studio/Documentation/main/
```

## Réévaluation

Si le repo `Documentation` devient publiquement résolvable via l'API GitLab v4 et qu'un besoin
impose de quitter GitHub, refaire ce spike : la limitation d'aujourd'hui est la résolution du
repo + la forme d'URL, pas le CORS de l'API v4 (déjà `*`).
