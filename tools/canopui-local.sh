#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────
# ProjectCenter — tools/canopui-local.sh
# (Re)construit le design system CanopUI et installe son tarball
# local dans ProjectCenter, en UNE commande.
#
# Idempotent : relançable autant de fois que voulu.
#   - dépendances CanopUI installées uniquement si absentes
#   - build + pack refaits à chaque exécution (rafraîchit le tarball)
#   - tarball (ré)installé dans node_modules sans muter package.json
#
# Tarball local :  <ProjectCenter>/canopui.local.tgz
#   Nom STABLE (indépendant de la version de CanopUI) : le tarball packé
#   (canopui-X.Y.Z.tgz) est copié vers ce nom fixe à chaque run, qui écrase
#   toujours l'ancien — donc aucune accumulation aux bumps de version.
#   Il persiste à la racine du repo car il sert de CIBLE à la dépendance
#   `file:canopui.local.tgz` que le frontend câble dans package.json (US1).
#   Ignoré par Git via `*.tgz` dans .gitignore (artefact local, non versionné).
#
# Usage :  bash tools/canopui-local.sh
#          npm run canopui:local
# Surcharge du chemin CanopUI :  CANOPUI_DIR=/chemin/vers/CanopUI bash tools/canopui-local.sh
# ──────────────────────────────────────────────────────────
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'; BOLD='\033[1m'
info() { echo -e "${BOLD}[canopui-local]${NC} ${CYAN}$1${NC}"; }
ok()   { echo -e "${BOLD}[canopui-local]${NC} ${GREEN}$1${NC}"; }
warn() { echo -e "${BOLD}[canopui-local]${NC} ${YELLOW}$1${NC}"; }
err()  { echo -e "${BOLD}[canopui-local]${NC} ${RED}$1${NC}" >&2; }

# ─── Résolution des chemins (relative au script, pas de chemin en dur) ───
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
QVL_ROOT="$(cd "$PROJECT_ROOT/.." && pwd)"
CANOPUI_DIR="${CANOPUI_DIR:-$QVL_ROOT/QVL-Studio/CanopUI}"

info "ProjectCenter : $PROJECT_ROOT"
info "CanopUI       : $CANOPUI_DIR"

[ -d "$CANOPUI_DIR" ] || { err "CanopUI introuvable : $CANOPUI_DIR (surcharge via CANOPUI_DIR=...)"; exit 1; }
[ -f "$CANOPUI_DIR/package.json" ] || { err "package.json CanopUI introuvable dans $CANOPUI_DIR"; exit 1; }

# ─── 1. Dépendances CanopUI (installées seulement si absentes) ───
if [ ! -d "$CANOPUI_DIR/node_modules" ]; then
  info "Dépendances CanopUI absentes — installation (npm ci)..."
  ( cd "$CANOPUI_DIR" && npm ci )
else
  info "Dépendances CanopUI déjà présentes — installation ignorée."
fi

# ─── 2. Build + pack CanopUI ───
# `npm pack` déclenche le script `prepare` de CanopUI (= `npm run build`), donc le
# build est fait dans le cadre du packaging (une seule fois). Le tarball est produit
# dans un dossier temporaire puis détecté par glob : robuste quel que soit le nom
# (versionné/scopé) et sans dépendre du parsing de `npm pack --json`.
info "Build + packaging CanopUI (npm pack → prepare/build)..."
PACK_DIR="$(mktemp -d)"
trap 'rm -rf "$PACK_DIR"' EXIT
( cd "$CANOPUI_DIR" && npm pack --pack-destination "$PACK_DIR" >/dev/null )

PACKED_TARBALL="$(ls -1 "$PACK_DIR"/*.tgz 2>/dev/null | head -1)"
[ -n "$PACKED_TARBALL" ] && [ -f "$PACKED_TARBALL" ] || { err "npm pack n'a produit aucun tarball dans $PACK_DIR"; exit 1; }

# ─── 3. Publication du tarball frais dans ProjectCenter (nom stable, écrase l'ancien) ───
# Nom fixe `canopui.local.tgz` (pas le nom versionné canopui-X.Y.Z.tgz) : la
# copie écrase systématiquement l'ancien tarball, donc pas d'accumulation aux
# bumps de version, et le chemin reste stable pour `file:canopui.local.tgz`.
TARBALL_PATH="$PROJECT_ROOT/canopui.local.tgz"
cp -f "$PACKED_TARBALL" "$TARBALL_PATH"
ok "Tarball produit : $TARBALL_PATH"

# ─── 4. (Ré)installation du tarball dans ProjectCenter ───
# --no-save          : ne mute pas package.json (scaffold minimal — la dépendance
#                      formelle sera déclarée à l'US1, au bootstrap de l'app).
# --legacy-peer-deps : n'entraîne pas l'arbre de peers React/MUI (installé à l'US1).
info "(Ré)installation du tarball dans ProjectCenter..."
( cd "$PROJECT_ROOT" && npm install "$TARBALL_PATH" --no-save --legacy-peer-deps )

ok "canopui installé localement dans ProjectCenter ✓"
