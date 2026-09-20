#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/paysondong/coral-cadets.git"

if ! command -v git >/dev/null 2>&1; then
  echo "Git is required." >&2
  exit 1
fi

if [ -d .git ]; then
  echo "This folder is already a Git repository. Stopping to avoid rewriting history." >&2
  exit 1
fi

if ! git config user.name >/dev/null || ! git config user.email >/dev/null; then
  echo "Configure your Git identity first:" >&2
  echo '  git config --global user.name "Your Name"' >&2
  echo '  git config --global user.email "your-email@example.com"' >&2
  exit 1
fi

git init -b main
git add .
git commit -m "Initial release: original CoralCadets game"
git remote add origin "$REPO_URL"
git push -u origin main
git tag -a v0.1.0 -m "CoralCadets v0.1.0 — Original Version"
git push origin v0.1.0

echo "Published CoralCadets v0.1.0"
