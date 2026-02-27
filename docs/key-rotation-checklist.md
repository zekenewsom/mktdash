# Key Rotation Checklist (Execute Now)

## Scope
Rotate any API keys that may have appeared in:
- `.env.example`
- committed history
- screenshots/logs/shared snippets

## Procedure
1. Inventory keys/providers
   - FRED
   - Alpha Vantage (if used)
   - any additional provider keys

2. Revoke old keys at provider dashboards
3. Generate new keys
4. Update runtime secrets only (never commit)
   - local `.env`
   - Render environment variables
   - Vercel environment variables (frontend-safe only)

5. Scrub repository examples
   - replace with placeholders (`your_key_here`)
   - remove key-like literals

6. Add prevention guardrails
   - pre-commit secret scan
   - CI secret scan

7. Verify post-rotation
   - backend health endpoints return `ok`
   - data endpoints still resolve

## Acceptance Criteria
- No real key values in tracked files
- Old keys revoked
- New keys active in secret stores only
- Secret scanning enabled for future commits
