#!/bin/bash
cd "$(dirname "$0")"
echo "=== IndustryVerse: saving and pushing to GitHub ==="
rm -f .git/*.lock .git/*.lock.old .git/objects/maintenance.lock
find .git/objects -name 'tmp_obj_*' -delete 2>/dev/null
git add -A
git diff --cached --quiet || git commit -q -m "Update IndustryVerse site

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WSJ8VpGZVGPr3M2quinZtp"
git push origin main
echo ""
echo "=== Done. You can close this window. ==="
read -p "Press Enter to close..."
