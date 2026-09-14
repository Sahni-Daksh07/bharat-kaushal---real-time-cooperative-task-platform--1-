# Incident: Production Build, Bundling, or Static Asset Delivery Failure

## Purpose

Operational recovery procedure when the production build fails during deployment or when the running production server fails to deliver bundled client assets (`index.html`, `dist/assets/*.js`, `dist/assets/*.css`).

## Impact

- **Frontend Deployment Blocker**: Deployment pipeline fails to complete or release new versions.
- **Client White Screen / 404 Errors**: Users receive blank screens, `404 Not Found` on hashed assets (`index-*.js`), or server crashes with `ENOENT` on `dist/index.html`.

## Symptoms

- Build step exits with non-zero exit code:
  ```
  npm error code ELIFECYCLE
  npm error Failed at the react-example@0.0.0 build script.
  ```
- Server logs error on client request:
  ```
  Error: ENOENT: no such file or directory, stat '.../dist/index.html'
  ```
- Browser console reports:
  ```
  Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html".
  GET http://<host>/assets/index-XXXXX.js net::ERR_ABORTED 404 (Not Found)
  ```
- Starting production via `npm start` immediately fails with `Cannot find module '.../dist/server.cjs'`.

## Severity

**P1** — Critical Deployment / Asset Serving Failure

## Immediate Actions

1. Check if `dist/` directory exists and contains the required compiled assets:
   - `dist/index.html`
   - `dist/server.cjs`
   - `dist/assets/`
2. Test static delivery locally:
   ```bash
   curl -I http://localhost:3001/
   ```
   Confirm `Content-Type: text/html; charset=UTF-8` and `200 OK`.

## Diagnosis

### Step 1: Run TypeScript Type-Check
The Vite build will fail if there are syntax or typing errors in frontend or backend code:
```bash
npm run lint
```
Inspect any reported compiler errors (`tsc --noEmit`).

### Step 2: Test Build Process Step-by-Step
The project build script in `package.json` consists of two distinct build stages:
1. `vite build` (compiles React SPA to `dist/`)
2. `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` (compiles Express server to `dist/server.cjs`)

Run the full build command manually to isolate which stage fails:
```bash
npm run build
```

Common failure causes:
- **Missing NPM Packages**: `node_modules` is out of sync or packages were added without running `npm install`.
- **Case-Sensitivity Issues**: In Linux deployments, file paths like `./Components/...` vs `./components/...` will break bundling.
- **Vite Chunk Size Warnings**: Informational only; does not break the build.
- **Execution Directory Mismatch**: `server.ts` uses `path.join(process.cwd(), 'dist')`. If the process is started from a subdirectory instead of the repository root, it will fail to locate `dist/index.html`.

## Recovery

### Scenario A: Clean Rebuild
1. Delete previous build outputs:
   ```bash
   npm run clean
   ```
2. Reinstall dependencies cleanly if modules are suspect:
   ```bash
   npm install
   ```
3. Run the complete build pipeline:
   ```bash
   npm run build
   ```
4. Verify files are present:
   ```powershell
   Test-Path dist/index.html, dist/server.cjs
   ```
5. Start the production server:
   ```bash
   npm start
   ```

### Scenario B: Working Directory Issue in Production Daemon
Ensure the process manager (systemd, PM2, Docker, or Cloud Run) has its `cwd` set explicitly to the repository root directory:
```bash
# Correct execution from repo root:
cd /path/to/bharat-kaushal
node dist/server.cjs
```

## Validation

1. Verify root returns the compiled HTML:
   ```bash
   curl -s http://localhost:3001/ | grep "<title>"
   ```
   Expected output: `<title>Bharat Kaushal - Real-Time Cooperative Task Platform</title>`.
2. Verify asset files are served with correct MIME types:
   ```bash
   curl -I http://localhost:3001/assets/index-*.js
   ```
   Should return `Content-Type: application/javascript` or `text/javascript` and `200 OK`.
3. Open application in browser in an incognito/private window to confirm there are no caching or hash mismatch issues.

## Rollback

If a new commit introduced an unresolvable build or asset issue:
1. Identify the previous functional commit:
   ```bash
   git log -n 5 --oneline
   ```
2. Roll back working directory to that commit:
   ```bash
   git checkout <last-known-good-commit>
   ```
3. Re-run clean and build:
   ```bash
   npm run clean
   npm run build
   npm start
   ```

## Escalation

Escalate to Frontend / Full-Stack Engineer if:
- Breaking dependency upgrade in `package.json` causes esbuild or Vite rollup plugins to throw internal exceptions.
- Asset chunk splitting produces circular reference errors.

## Do Not

- **DO NOT** edit or patch files directly inside `dist/`; all changes in `dist/` will be overwritten by the next build.
- **DO NOT** commit the `dist/` folder into git; build artifacts belong in deployment artifacts or CI build steps.

## Root Cause Follow-Up

1. Ensure `npm run lint` is integrated as a pre-build check.
2. Check for cache-busting headers on CDN / reverse proxy to prevent stale `index.html` from requesting old asset hashes after new deployments.
