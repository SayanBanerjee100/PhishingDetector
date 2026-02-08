#!/usr/bin/env bash
set -euo pipefail
REPO_URL="https://github.com/SayanBanerjee100/PhishingDetector.git"
REMOVE=${REMOVE:-0}
FORCE=${FORCE:-0}
if ! command -v git >/dev/null 2>&1; then
  echo "Git is not installed or not in PATH. Install: https://git-scm.com/downloads"
  exit 1
fi
if [ -d .git ] && [ "$REMOVE" != "1" ]; then
  echo ".git exists. To remove and reinitialize, run: REMOVE=1 bash scripts/push_initial.sh"
  exit 1
fi
if [ "$REMOVE" = "1" ]; then
  rm -rf .git
  echo "Removed existing .git"
fi
git init
git add -A
if ! git commit -m "Initial commit" 2>/dev/null; then
  echo "Nothing to commit or commit failed. Continuing."
fi
git branch -M main
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
if [ "$FORCE" = "1" ]; then
  git push -u origin main --force
else
  git push -u origin main
fi
