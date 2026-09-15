# Incident: Credential Exposure / Compromised API Key

## Purpose

Emergency response procedure when an API key, OAuth credential, or private token used by Bharat Kaushal is accidentally exposed, committed to public source control, or compromised.

## Impact

- Potential unauthorized API quota consumption and unexpected billing charges (e.g. Google Gemini AI or Geoapify credit exhaustion).
- Potential abuse of client-facing Firebase / Google OAuth project resources.
- Reputation and security compliance risks.

## Symptoms

- Automated secret scanner alerts (GitHub Secret Scanning, Google Cloud Security Command Center, GitGuardian).
- Sudden unexpected spike in Gemini API or Geoapify API consumption in external provider dashboards.
- HTTP `403 Forbidden` or `429 Too Many Requests` returned by external APIs due to quota exhaustion from abusive external traffic.
- Potential secret exposure detected in repository files (e.g. static configuration files such as `firebase-applet-config.json` or unignored `.env`).

## Severity

**P0** — Security & Compliance Incident

## Immediate Actions

1. Identify which credential was exposed:
   - `GEMINI_API_KEY`: Google Gemini Generative AI key (server environment).
   - `VITE_GEOAPIFY_API_KEY`: Geoapify map tile & routing key (client bundle).
   - Firebase Web API Key / `oAuthClientId`: Firebase project config in `firebase-applet-config.json`.
2. **DO NOT** post the exposed secret string into issue trackers, chat channels, or pull request comments.
3. Determine if the repository has been made public or pushed to external remotes.

## Diagnosis

### Step 1: Check Git Status and Staged Files
Verify if secrets or environment files were tracked or staged in git:

On Linux / macOS / Git Bash:
```bash
git log -S "AIza" --oneline
git status
```

On Windows (PowerShell):
```powershell
git log -S "AIza" --oneline
git status
```

### Step 2: Identify Credential Roles & Blast Radius
- **`GEMINI_API_KEY`**: Stored server-side in Node environment (`process.env.GEMINI_API_KEY`). Grants access to Google GenAI API (`@google/genai`). If compromised, an external party can invoke Gemini LLM endpoints at the project owner's expense.
- **`VITE_GEOAPIFY_API_KEY`**: Bundled into client JS assets during Vite compilation (`import.meta.env.VITE_GEOAPIFY_API_KEY`). Grants tile loading and geocoding quota. If exposed without referrer restrictions, external websites can consume geocoding credits.
- **Firebase Web Credentials (`firebase-applet-config.json`)**: Configures client-side authentication in `src/auth.ts`.
  > [!WARNING]
  > **OAuth Scope Blast Radius**: `src/auth.ts` requests Google OAuth scopes including Gmail permissions (`mail.google.com`, `gmail.send`, `gmail.modify`). Compromised OAuth credentials or leaked access tokens carry significant privacy and data-access risks. Ensure OAuth client secrets are never exposed and HTTP referrers are restricted in Google Cloud Console.

## Recovery

### Safe Automation vs Human Approval
> [!IMPORTANT]
> **REQUIRES HUMAN APPROVAL**: Revoking or regenerating production API keys must be performed by authorized project administrators in external cloud provider consoles. Automated tools must not revoke production keys autonomously.

### Procedure 1: Gemini AI Key Rotation
1. Log in to [Google AI Studio](https://aistudio.google.com/) or the associated Google Cloud Console.
2. Under API Keys / Credentials, generate a new Gemini API Key.
3. Update the production environment variable in `.env`:
   ```env
   GEMINI_API_KEY="<new_key>"
   ```
4. Restart the server process to load the new environment variable.
5. In Google AI Studio / Google Cloud Console, delete or disable the compromised old API key.

### Procedure 2: Geoapify Key Rotation
1. Log in to [Geoapify MyProjects Dashboard](https://myprojects.geoapify.com/).
2. Generate a new API key for the project.
3. Configure domain/referrer restrictions on the new key (e.g. restrict to `https://<production-domain>` and `http://localhost:*`).
4. Update the environment variable in `.env`:
   ```env
   VITE_GEOAPIFY_API_KEY="<new_key>"
   ```
5. Rebuild the frontend client bundle:
   ```bash
   npm run build
   ```
6. Revoke the old compromised key in the Geoapify dashboard.

### Procedure 3: Firebase / Google OAuth Client ID
1. Navigate to Google Cloud Console -> **APIs & Services** -> **Credentials**.
2. If Firebase API key was compromised:
   - Apply HTTP Referrer restrictions in Google Cloud Console (limit to authorized domains).
   - Regenerate the Web API key if needed.
3. If OAuth Client Secret was compromised, regenerate the secret under OAuth 2.0 Client IDs.
4. Update `firebase-applet-config.json` with the renewed configuration.
5. Rebuild and restart the application:
   ```bash
   npm run build
   npm start
   ```

## Validation

### 1. Verify Gemini AI Functionality
> [!NOTE]
> **Avoid False Positives**: `server.ts` includes a deterministic rule-based keyword engine (`detectWorkerField`). If the Gemini API key is invalid, the endpoint will catch the error and still return HTTP 200 using the rule engine. You must confirm that Gemini specifically succeeded without emitting fallback warnings in the server logs.

Trigger a test classification request:
```bash
curl -s -X POST http://localhost:3001/api/worker/detect-field \
  -H "Content-Type: application/json" \
  -d '{"skills":["pipe fitting"],"workDescription":"fixing leaking bathroom pipes","experienceYears":4}'
```
- **Check Response**: Confirm HTTP 200 with `"detectedField": "Plumbing"`.
- **Check Server Console**: Verify that **no** warning appears saying:
  `Gemini field detection fallback to rule engine:`

### 2. Verify Geoapify Map Key
Quickly validate the new Geoapify key directly via CLI:
```bash
curl -s "https://api.geoapify.com/v1/geocode/search?text=New%20Delhi&apiKey=<VITE_GEOAPIFY_API_KEY>" | grep -q "features" && echo "Geoapify key VALID" || echo "Geoapify key INVALID"
```
Then open the Customer or Worker portal in a browser to confirm map tiles and dispatch markers render without HTTP 401 or 403 errors.

### 3. Check External Provider Dashboards
Confirm API request graphs in Google AI Studio and Geoapify show only authorized internal traffic and that unauthorized spikes have dropped to zero.

## Rollback

No rollback to an old compromised key is permitted. If the new key fails:
1. Verify key permissions, quotas, and referrer restrictions in the provider console.
2. Ensure `.env` was saved properly and the Node server was restarted.
3. Check `server.ts` logs for error details.

## Escalation

- Immediately notify Security Officer / Repository Owner.
- If billing spikes were observed, open a support ticket with Google Cloud or Geoapify support to request billing relief due to unauthorized access.

## Do Not

- **DO NOT** commit `.env` or secret files into git.
- **DO NOT** leave compromised keys active while waiting for a maintenance window; revoke immediately once the new key is deployed.
- **DO NOT** paste compromised credentials into incident reports, GitHub issues, or chat channels.

## Root Cause Follow-Up

1. **Verify `.gitignore` Coverage**:
   Ensure `.gitignore` contains all sensitive and local configuration files:
   ```gitignore
   .env
   .env.*
   *.local
   firebase-applet-config.json
   ```
2. **Decouple Secrets from Source Files**:
   - Provide a template file (e.g. `firebase-applet-config.example.json`) with placeholders for development.
   - For production deployments, inject Firebase configuration via environment variables or secure secret managers rather than hardcoding in tracked files.
3. **Audit OAuth Scopes**:
   - Review `src/auth.ts` to ensure only the minimal required scopes are requested (principle of least privilege).
4. **Automated Secret Scanning**:
   - Set up pre-commit hooks or automated secret detection (e.g. `gitleaks` or GitHub Secret Scanning) to prevent future secret commits.
5. **Enforce Restrictions**:
   - Ensure all public-facing API keys in Google Cloud and Geoapify have strict API restrictions and HTTP referrer restrictions enabled.
