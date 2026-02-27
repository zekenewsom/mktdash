# mktdash Staging Deployment Plan (Free Tier)

Approved choices:
- Access path: **private tailnet only**
- Staging hosting: **Vercel (frontend) + Render free web service (backend)**
- Key hygiene: **rotate now**

## Architecture
- Frontend: Vercel free project (React/Vite build output)
- Backend: Render free web service (Node/Express)
- Access control: Tailnet-only for operational/admin surfaces; no broad public admin exposure

## Step-by-step
1. Backend first (Render)
   - Create Render web service from `mktdash`
   - Root: `packages/backend`
   - Build command: `corepack pnpm --filter backend build`
   - Start command: `corepack pnpm --filter backend start`
   - Set env vars: `PORT`, `FRED_API_KEY`, `HTTP_TIMEOUT_MS`, `DATA_PROVIDER_MODE`
   - Verify endpoints:
     - `/api/health/status`
     - `/api/health/data-quality`
     - `/api/intelligence/overview`
     - `/api/calendar/events`

2. Frontend (Vercel)
   - Create Vercel project from `mktdash`
   - Root: `packages/frontend`
   - Build command: `corepack pnpm --filter frontend build`
   - Output: Vite default `dist`
   - Set API base URL env (e.g., `VITE_API_BASE_URL`) to Render backend URL

3. Validation
   - Open frontend staging URL
   - Confirm:
     - backend heartbeat badge = `ok`
     - regime + changes load
     - cross-asset matrix loads
     - data quality console loads
     - economic calendar loads

## Notes
- Render free tier can sleep when idle (cold-start delay is expected).
- Keep staging non-public for sensitive admin operations until auth hardening is complete.
