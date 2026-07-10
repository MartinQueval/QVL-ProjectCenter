#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────
# ProjectCenter — tools/deploy-local.sh
# Build de production + deploiement des artefacts vers le dossier servi par
# l'hote statique QVL (nginx local, projectcenter.qvl-project.com).
#
# Aligne sur le pattern deploy-vitrine de CanopUI :
#   artefacts copies dans C:\QVL\deploy\projectcenter (/mnt/c cote WSL).
# Deploiement atomique (.new puis swap) pour eviter un etat servi incomplet.
#
# Prerequis : canopui@X.Y.Z resolvable depuis Verdaccio (npm.qvl-project.com),
# .env renseigne (VITE_DOCS_BASE_URL).
# ──────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="/mnt/c/QVL/deploy/projectcenter"

cd "$ROOT"

echo "==> npm ci"
npm ci

echo "==> build production"
npm run build

test -d dist/assets # sanity check : artefact present

echo "==> deploiement atomique -> $DEST"
rm -rf "${DEST}.new"
cp -r dist "${DEST}.new"
rm -rf "$DEST"
mv "${DEST}.new" "$DEST"

echo "==> deploye -> https://projectcenter.qvl-project.com"
