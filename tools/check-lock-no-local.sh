#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────
# ProjectCenter — tools/check-lock-no-local.sh (SCRUM-320)
# Garde-fou : rejette un package-lock.json qui épingle canopui sur une version
# de dev `X.Y.Z-local.<timestamp>`. Un tel lock committé casse `npm ci` sur la CI
# et les autres postes (le tarball local, gitignoré, y est absent → intégrité
# introuvable). Le bump -local est un artefact LOCAL produit par canopui-local.sh
# et ne doit jamais être versionné (baseline committée = canopui@X.Y.Z).
#
# Deux modes :
#   (défaut)   contrôle package-lock.json tel qu'il est sur le disque → pour la CI.
#   --staged   contrôle la version INDEXÉE (git show :package-lock.json) → pour le
#              hook pre-commit : ne bloque que si le lock -local est réellement mis
#              en scène (le working tree peut, lui, rester en -local sans souci).
#
# Sortie : 0 = OK (pas de -local), 1 = -local détecté (bloquant).
# ──────────────────────────────────────────────────────────
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'; BOLD='\033[1m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOCK_REL="package-lock.json"

# Motif : une "version": "...-local.<...>" (seul canopui reçoit ce suffixe).
LOCAL_PATTERN='"version"[[:space:]]*:[[:space:]]*"[^"]*-local\.'

MODE="${1:-file}"

if [ "$MODE" = "--staged" ]; then
  # Rien de mis en scène pour le lock ? → rien à vérifier.
  # Here-string (pas de pipe) : sous `set -o pipefail`, `grep -q` ferme le tube au
  # premier match et le SIGPIPE amont ferait échouer le pipeline (faux négatif).
  STAGED_FILES="$(git -C "$PROJECT_ROOT" diff --cached --name-only)"
  if ! grep -qx "$LOCK_REL" <<<"$STAGED_FILES"; then
    exit 0
  fi
  CONTENT="$(git -C "$PROJECT_ROOT" show ":$LOCK_REL" 2>/dev/null || true)"
else
  [ -f "$PROJECT_ROOT/$LOCK_REL" ] || { echo -e "${YELLOW}[check-lock] $LOCK_REL introuvable — rien à vérifier.${NC}"; exit 0; }
  CONTENT="$(cat "$PROJECT_ROOT/$LOCK_REL")"
fi

# Idem : here-string pour éviter le SIGPIPE de `grep -q` sous pipefail.
if grep -Eq "$LOCAL_PATTERN" <<<"$CONTENT"; then
  echo -e "${BOLD}${RED}[check-lock] REFUSÉ : package-lock.json épingle une version -local de canopui.${NC}" >&2
  echo -e "${RED}  → C'est un artefact de dev (canopui-local.sh), il ne doit pas être committé.${NC}" >&2
  echo -e "${RED}  → Désindexe-le :  git restore --staged package-lock.json${NC}" >&2
  echo -e "${RED}     (le working tree peut rester en -local ; la baseline committée est canopui@X.Y.Z)${NC}" >&2
  exit 1
fi

echo -e "${GREEN}[check-lock] OK : aucune version -local dans package-lock.json.${NC}"
exit 0
