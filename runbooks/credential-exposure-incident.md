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
   - `GEMINI_API_KEY`: Google Gemini Generative AI key
   - `VITE_GEOAPIFY_API_KEY`: Geoapify map tile & routing key
   - Firebase Web API Key / `oAuthClientId` in `firebase-applet-config.json`
2. **DO NOT** post the exposed secret string into issue trackers, chat channels, or pull request comments.
3. Determine if the repository has been made public or pushed to external remotes.

## Diagnosis

### Step 1: Check Git Status and Staged Files
Verify if secrets or environment files were tracked or staged in git:
```bash
git log -S "AIza" --oneline
git status
```

### Step 2: Identify Credential Roles & Blast Radius
- **`GEMINI_API_KEY`**: Stored server-side in Node environment. Grants access to Google GenAI API (`@google/genai`). If compromised, an attacker can invoke Gemini LLM endpoints at the project owner's expense.
- **`VITE_GEOAPIFY_API_KEY`**: Built into client bundle via Vite (`import.meta.env.VITE_GEOAPIFY_API_KEY`). Grants tile loading and geocoding quota.
- **Firebase Web Credentials**: Used in `src/auth.ts` for Google Auth popup.

## Recovery

### Safe Automation vs Human Approval
> [!IMPORTANT]
> **REQUIRES HUMAN APPROVAL**: Revoking or regenerating production API keys must be performed by authorized project administrators in external cloud provider consoles.

### Procedure 1: Gemini AI Key Rotation
1. Log in to [Google AI Studio](https://aistudio.google.com/) or the associated Google Cloud Console.
2. Under API Keys / Credentials, generate a new Gemini API Key.
3. Update the production environment variable:
   ```env
   GEMINI_API_KEY="<new_key>"
   ```
4. Restart the server process to load the new environment variable.
5. In Google Cloud Console, delete or disable the compromised old API key.

### Procedure 2: Geoapify Key Rotation
1. Log in to [Geoapify MyProjects Dashboard](https://myprojects.geoapify.com/).
2. Generate a new API key for the project.
3. Configure domain/referrer restrictions on the new key (e.g. limit to `https://<production-domain>` and `http://localhost:*`).
4. Update the environment variable:
   ```env
   VITE_GEOAPIFY_API_KEY="<new_key>"
   ```
5. Rebuild the frontend client bundle:
   ```bash
   npm run build
   ```
6. Revoke the old compromised key in Geoapify.

### Procedure 3: Firebase / Google OAuth Client ID
1. Navigate to Google Cloud Console -> **APIs & Services** -> **Credentials**.
2. If Firebase API key was compromised, apply HTTP Referrer restrictions in Google Cloud Console.
3. If OAuth Client Secret was compromised, regenerate the secret under OAuth 2.0 Client IDs.
4. Update `firebase-applet-config.json` with the renewed configuration.
5. Rebuild and restart the application:
   ```bash
   npm run build
   npm start
   ```

## Validation

1. Verify Gemini AI functionality:
   Trigger a test request to `/api/worker/detect-field`:
   ```bash
   curl -X POST http://localhost:3001/api/worker/detect-field \
     -H "Content-Type: application/json" \
     -d '{"skills":["pipe fitting"],"workDescription":"fixing leaking bathroom pipes","experienceYears":4}'
   ```
   Confirm HTTP 200 with trade classification.
2. Verify Map Tiles:
   Open the Customer or Worker portal and confirm map tiles render without HTTP 401/403 errors.
3. Check external dashboards:
   Confirm API request graphs in Google AI Studio and Geoapify show expected internal traffic only.

## Rollback

No rollback to an old compromised key is permitted. If the new key fails:
1. Verify key permissions, quotas, and referrer restrictions in the provider console.
2. Ensure `.env` was saved properly and the process was restarted.

## Escalation

- Immediately notify Security Officer / Repository Owner.
- If billing spikes were observed, open a support ticket with Google Cloud or Geoapify support to request billing relief due to unauthorized access.

## Do Not

- **DO NOT** commit `.env` or secret files into git.
- **DO NOT** leave compromised keys active while waiting for a maintenance window; revoke immediately once the new key is deployed.
- **DO NOT** paste compromised credentials into incident reports or tickets.

## Root Cause Follow-Up

1. Verify `.gitignore` includes:
   ```
   .env
   .env.local
   *.local
   ```
2. Set up pre-commit hooks or automated secret detection (e.g. `gitleaks` or GitHub Secret Scanning) to prevent future secret commits.
3. Ensure API keys in Google Cloud and Geoapify have strict API and referrer restrictions enabled.
