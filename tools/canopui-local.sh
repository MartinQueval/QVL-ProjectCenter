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
# Cache-busting du tarball (SCRUM-320) :
#   Chaque pack produit une version prerelease UNIQUE (`X.Y.Z-local.<timestamp>`)
#   injectée temporairement dans le package.json de CanopUI, puis restaurée
#   immédiatement (la version committée reste inchangée — la vraie montée de
#   version relève de l'US6). Objectif : npm ne peut JAMAIS résoudre depuis son
#   cache un ANCIEN contenu sous une version identique. Sans ça, un `npm install`
#   ultérieur réinstallait le tarball caché (vécu : « Module canopui has no
#   exported member Carousel »). La version unique force l'extraction du contenu
#   frais à chaque fois.
#
# Tarball local :  <ProjectCenter>/canopui.local.tgz
#   Nom STABLE (indépendant de la version de CanopUI) : le tarball packé
#   (canopui-X.Y.Z-local.<ts>.tgz) est copié vers ce nom fixe à chaque run, qui
#   écrase toujours l'ancien — donc aucune accumulation aux bumps de version.
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

# ─── 2. Build + pack CanopUI (version prerelease unique, cache-busting) ───
# `npm pack` déclenche le script `prepare` de CanopUI (= `npm run build`), donc le
# build est fait dans le cadre du packaging (une seule fois). Le tarball est produit
# dans un dossier temporaire puis détecté par glob : robuste quel que soit le nom
# (versionné/scopé) et sans dépendre du parsing de `npm pack --json`.
PACK_DIR="$(mktemp -d)"

# Sauvegarde de package.json / package-lock.json AVANT tout bump, pour une
# restauration garantie même en cas d'échec (la version committée ne bouge pas).
PKG_JSON="$CANOPUI_DIR/package.json"
PKG_LOCK="$CANOPUI_DIR/package-lock.json"
cp "$PKG_JSON" "$PACK_DIR/package.json.orig"
[ -f "$PKG_LOCK" ] && cp "$PKG_LOCK" "$PACK_DIR/package-lock.json.orig"

restore_canopui_manifest() {
  cp -f "$PACK_DIR/package.json.orig" "$PKG_JSON" 2>/dev/null || true
  [ -f "$PACK_DIR/package-lock.json.orig" ] && cp -f "$PACK_DIR/package-lock.json.orig" "$PKG_LOCK" 2>/dev/null || true
}
cleanup() { restore_canopui_manifest; rm -rf "$PACK_DIR"; }
# EXIT couvre la fin normale ET les erreurs (set -e) ; INT/TERM couvrent Ctrl-C et
# kill (non garantis par le seul EXIT sous MSYS) → restauration du manifeste CanopUI
# assurée quoi qu'il arrive. Le handler de signal désarme EXIT pour éviter un double run.
trap cleanup EXIT
trap 'trap - EXIT; cleanup; exit 130' INT TERM

# Lecture de la version depuis le dossier CanopUI (require('./…') pour éviter les
# soucis de chemins MSYS `/c/…` vs Windows `C:\…` que Node ne sait pas résoudre).
BASE_VERSION="$(cd "$CANOPUI_DIR" && node -p "require('./package.json').version")"
LOCAL_VERSION="${BASE_VERSION}-local.$(date +%Y%m%d%H%M%S)"
info "Version locale unique pour le pack : $LOCAL_VERSION (committée inchangée : $BASE_VERSION)"

# --no-git-tag-version : ne crée ni commit ni tag Git (et n'exige pas un arbre propre).
# --allow-same-version : tolère un re-run rapproché.
( cd "$CANOPUI_DIR" && npm version "$LOCAL_VERSION" --no-git-tag-version --allow-same-version >/dev/null )

info "Build + packaging CanopUI (npm pack → prepare/build)..."
( cd "$CANOPUI_DIR" && npm pack --pack-destination "$PACK_DIR" >/dev/null )

# Restauration immédiate du manifeste (le trap reste un filet de sécurité).
restore_canopui_manifest

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
# --save             : synchronise package-lock.json sur la version -local unique et
#                      son intégrité fraîche. INDISPENSABLE : sans ça, le lock reste
#                      pinné sur l'ancienne version/intégrité et un `npm install`
#                      ultérieur restaure le contenu périmé depuis le cache (bug
#                      « no exported member Carousel »). La spec de package.json
#                      (`file:canopui.local.tgz`) n'est PAS modifiée par --save.
# --legacy-peer-deps : n'entraîne pas la résolution stricte des peers React/MUI.
#
# DISCIPLINE (local uniquement) : ce (ré)install fait évoluer l'entrée `canopui`
# de package-lock.json vers `X.Y.Z-local.<timestamp>` + intégrité fraîche. C'est un
# état de dev — comme canopui.local.tgz (gitignoré). NE PAS committer ce bump du
# lock : la baseline committée reste `canopui@X.Y.Z` (voir README « Tooling »).
# Un garde-fou (hook pre-commit + tools/check-lock-no-local.sh) rejette tout commit
# d'un lock -local ; `git restore --staged package-lock.json` pour le désindexer.
info "(Ré)installation du tarball dans ProjectCenter (sync du lock)..."
( cd "$PROJECT_ROOT" && npm install "$TARBALL_PATH" --save --legacy-peer-deps )

ok "canopui installé localement dans ProjectCenter ✓"

# ─── 5. Armement du garde-fou anti-commit du lock -local ───
# Le (ré)install ci-dessus a volontairement bumpé package-lock.json en -local
# (cœur du mécanisme anti-cache). On arme donc le hook versionné .githooks/ qui
# refusera de committer ce lock. Auto-armement idempotent : on ne touche
# core.hooksPath que s'il ne pointe pas déjà vers .githooks.
CURRENT_HOOKS="$(cd "$PROJECT_ROOT" && git config --get core.hooksPath || true)"
if [ "$CURRENT_HOOKS" != ".githooks" ]; then
  ( cd "$PROJECT_ROOT" && git config core.hooksPath .githooks )
  info "Garde-fou armé : core.hooksPath → .githooks (rejette un commit du lock -local)."
else
  info "Garde-fou déjà armé (core.hooksPath = .githooks)."
fi

warn "Rappel : package-lock.json est passé en -local (dev). Ne le committe PAS."
