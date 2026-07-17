# Décision — Bascule de la source des docs vers l'API GitLab v4

- **US** : SCRUM-31x (docs source GitLab API)
- **Date du spike** : 2026-07-16
- **Statut** : en vigueur
- **Remplace** : `cors-docs-source.md` (miroir GitHub raw)
- **Valeurs retenues** :
  - `VITE_DOCS_API_PROJECT_URL=https://gitlab.com/api/v4/projects/84403403`
  - `VITE_DOCS_REF=main`

## Contexte

Les pages de documentation par projet sont récupérées **au runtime, côté navigateur** puis
rendues en Markdown. La source précédente était le miroir GitHub raw
(`raw.githubusercontent.com`) alimenté depuis le repo GitLab privé `QVL-Documentation`.

Le repo `MartinQueval/QVL-Documentation` (**ID projet 84403403**, branche `main`) est **passé
public le 2026-07-16**. On peut donc servir la doc directement depuis GitLab et supprimer la
dépendance au miroir GitHub.

## Faits vérifiés (spike du 2026-07-16, en-têtes réels, origine cross-origin)

- **API GitLab v4** —
  `https://gitlab.com/api/v4/projects/84403403/repository/files/<CHEMIN_ENCODÉ>/raw?ref=main`
  - `GET` : `200 OK` + `Access-Control-Allow-Origin: *` (CORS OK, contenu servi).
  - Préflight `OPTIONS` : `200`.
  - `<CHEMIN_ENCODÉ>` = chemin complet du fichier passé dans `encodeURIComponent`
    (les `/` deviennent `%2F`). Exemple vérifié : `.../files/QVL-CustHome%2FREADME.md/raw?ref=main`.
  - PNG servis avec `Content-Type: image/png` (les logos s'affichent).
    `X-Content-Type-Options: nosniff` présent mais sans impact.
  - `ETag` / `X-Gitlab-Content-Sha256` exposés (cache léger possible, non exploité pour l'instant).
- **Route web `/-/raw/`** : **PAS de CORS** — ne jamais l'utiliser pour un fetch navigateur.

## Décision

Source retenue : **API GitLab v4 du projet 84403403, branche `main`**.

Contrairement au miroir GitHub raw, l'API v4 impose une forme d'URL avec **chemin encodé** et
suffixe `?ref=`, incompatible avec une simple concaténation `base + docPath`. La construction
d'URL est donc centralisée dans `src/lib/gitlabDocs.ts` :

- `buildGitlabRawUrl(repoPath)` : normalise puis `encodeURIComponent` le chemin complet et
  compose `{project}/repository/files/{encodé}/raw?ref={ref}`. Utilisé par `useProjectDoc`
  (fetch de la doc) et `ProjectLogo` (logos servis depuis le repo doc).
- `resolveRelativeDocPath(docCourant, urlRelative)` : résout les liens/images relatifs des
  Markdown (`./`, `../`, chemins racine `/…`) contre le dossier du doc courant, normalise, et
  renvoie le chemin repo à encoder. Consommé par `createDocUrlTransform` (`resolveDocUrl.ts`),
  qui laisse les ancres `#` inchangées, conserve les URLs http(s) absolues (badges shields, etc.)
  et supprime les autres protocoles.

CSP (`vite.config.ts`) : `connect-src` et `img-src` autorisent désormais `https://gitlab.com`
(en remplacement de `raw.githubusercontent.com`) ; `img.shields.io` conservé pour les badges.

## Conséquences

- Suppression de la variable `VITE_DOCS_BASE_URL` au profit de `VITE_DOCS_API_PROJECT_URL`
  + `VITE_DOCS_REF`.
- Les logos historiques (`projets/<X>/logo.png`) sont désormais réellement servis via l'API v4.
- Les liens relatifs `.yaml` (specs OpenAPI référencées dans les README) sont transformés en URL
  API v4 valides et donc consultables.

## Réévaluation

Si le repo doc redevient privé ou change d'ID/branche, adapter `VITE_DOCS_API_PROJECT_URL` /
`VITE_DOCS_REF`. Si un besoin de cache fort apparaît, exploiter `ETag` /
`X-Gitlab-Content-Sha256` déjà exposés par l'API.
