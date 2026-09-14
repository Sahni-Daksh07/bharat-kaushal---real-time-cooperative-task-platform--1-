# Incident: External API Degradation (Gemini AI & Geoapify)

## Purpose

Operational recovery procedure when external 3rd-party services (Google Gemini AI or Geoapify Maps) experience rate limiting, quota exhaustion, network degradation, or authentication failures.

## Impact

- **Gemini AI Degradation**: Worker trade categorization (`/api/worker/detect-field`) and customized vocational skill assessment question generation (`/api/worker/generate-assessment`) revert to deterministic rule-based engine and pre-seeded question banks.
- **Geoapify Degradation**: Map tiles fail to load (tile 401/403 errors), or vector tiles fail to render in `GeoapifyWorkerMap` and `WorkerJobMap`.
- **Core Platform Resiliency**: Core dispatch, booking workflow, OTP verification, and cooperative pricing continue operating via built-in offline fallbacks.

## Symptoms

- Server logs output:
  ```
  Gemini client initialization skipped: Error ...
  Gemini classification error: ... falling back to rule-based detection
  ```
- Worker registration screen falls back to deterministic field detector (`src/utils/fieldDetector.ts`) and pre-seeded top 15 NSQF questions (`src/utils/assessmentGenerator.ts`).
- Browser network console shows HTTP 429 (Too Many Requests), 403 (Forbidden), or 400 (Bad Request) to:
  - `https://generativelanguage.googleapis.com/*`
  - `https://maps.geoapify.com/*`
- Customer or Worker map displays empty tiles or the "Connect Your Geoapify Key" modal prompt.

## Severity

**P2** — Managed Feature Degradation (Non-blocking due to graceful fallbacks)

## Immediate Actions

1. Check if the issue is service-wide or isolated to a specific key by inspecting server and client logs.
2. Confirm that built-in fallback modes are successfully absorbing user requests without crashing the server.
3. Check external provider status pages:
   - [Google Cloud Status Dashboard](https://status.cloud.google.com/)
   - [Geoapify Status / Monitoring](https://status.geoapify.com/)

## Diagnosis

### Step 1: Diagnose Gemini AI Service Status
Trigger a test request to `/api/worker/detect-field`:
```bash
curl -X POST http://localhost:3001/api/worker/detect-field \
  -H "Content-Type: application/json" \
  -d '{"skills":["carpentry","wood cutting"],"workDescription":"custom furniture maker","experienceYears":5}'
```
Inspect the response:
- If `source: "GEMINI_AI"`, the external API is operational.
- If `source: "RULE_ENGINE"`, Gemini failed or was bypassed, and the platform safely used the deterministic classifier.

Common Gemini failure causes:
- Missing `GEMINI_API_KEY` in `.env`.
- Quota limit exceeded (Free Tier rate limit: 15 RPM / 1M TPM).
- Malformed request payload.

### Step 2: Diagnose Geoapify Tile Loading
Inspect network requests in the browser Developer Tools for requests matching:
```
https://maps.geoapify.com/v1/tile/*?apiKey=<key>
```
- **HTTP 401 / 403**: Invalid API key or domain restriction mismatch.
- **HTTP 429**: Monthly credit quota exceeded on the Geoapify account.
- **Failed DNS / Network Timeout**: Upstream CDN or regional network issue.

## Recovery

### Scenario A: Gemini AI API Key Renewal or Quota Lift
1. Verify `GEMINI_API_KEY` is present in the server environment:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```
2. If the quota was exhausted on Google AI Studio, upgrade to paid tier or wait for quota reset window (typically hourly or daily).
3. If rotating the key, update `.env` and restart the server process:
   ```bash
   npm start
   ```

### Scenario B: Geoapify Key Renewal / Client Override
1. Obtain a valid key from [Geoapify Projects](https://myprojects.geoapify.com/).
2. Set the environment variable:
   ```env
   VITE_GEOAPIFY_API_KEY="your_valid_key"
   ```
3. Rebuild the client:
   ```bash
   npm run build
   ```
4. **Immediate Zero-Downtime Client Fix**: Users and operators can also directly paste a temporary valid Geoapify key into the in-app modal ("Enter Geoapify Key"), which stores it in `localStorage.setItem('GEOAPIFY_API_KEY', ...)`.
5. **Radar Mode Fallback**: Users can toggle to the built-in `GIS_RADAR` map view in `RealtimeWorkerMapView.tsx`, which displays simulated radar dispatch without requiring external tile requests.

## Validation

1. Verify Gemini AI classification returns `source: "GEMINI_AI"`:
   ```bash
   curl -s -X POST http://localhost:3001/api/worker/detect-field \
     -H "Content-Type: application/json" \
     -d '{"skills":["wiring","circuit breaker"],"workDescription":"electrician","experienceYears":3}'
   ```
2. Verify Geoapify tile requests return HTTP `200 OK` with `image/png` content.
3. Confirm worker job tracking displays doorstep navigation with map tiles loaded.

## Rollback

If a newly deployed API key or custom prompt introduces instability:
- Remove or clear `GEMINI_API_KEY` from the environment; the application will automatically and safely fall back to the built-in NSQF rule engine and question generator without crashing.

## Escalation

- If Gemini AI remains unavailable for extended periods, no critical escalation is needed because the deterministic fallback handles all 140 Indore catalog trade categories.
- If Geoapify billing/quota requires credit top-up, contact Account Administrator.

## Do Not

- **DO NOT** bring down the Node.js production server because of a 3rd-party API outage; the platform is specifically engineered to operate gracefully in offline/fallback mode.
- **DO NOT** disable the rule-based fallback in `server.ts` or `src/utils/fieldDetector.ts`.

## Root Cause Follow-Up

1. Set up billing/quota alerts at 80% threshold in Google Cloud Console and Geoapify.
2. Review caching strategies for repeated classification prompts to reduce external token consumption.
