#!/bin/bash
cd "$(dirname "$0")"
echo "=== IndustryVerse: deploying to Vercel ==="
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v npx >/dev/null 2>&1; then
  echo ""
  echo "Node.js is not installed on this Mac."
  echo "Install it from https://nodejs.org (LTS), then double-click this file again."
  open "https://nodejs.org/en/download"
  read -p "Press Enter to close..."
  exit 1
fi
echo "Step 1/2: sign in to Vercel (your browser will open, sign in there)..."
npx --yes vercel@latest login
echo ""
echo "Step 2/2: uploading the site..."
npx --yes vercel@latest deploy --prod --yes --name industryverse-ai 2>&1 | tee vercel-deploy-log.txt
echo ""
echo "=== Done. Your live link is above (and saved in vercel-deploy-log.txt) ==="
read -p "Press Enter to close..."
