# Incident: Unified Server Down / Unresponsive

## Purpose

Operational recovery procedure when the unified full-stack Node.js server (`server.ts` or `dist/server.cjs`) stops responding, crashes, or fails to bind to its network port.

## Impact

- **Total Platform Outage**: All web portals (Customer, Worker, Society, Federation, Super Admin) become completely inaccessible.
- **API Failure**: All REST endpoints under `/api/*` return connection refused, 502 Bad Gateway, or 504 Gateway Timeout.
- **WebSocket Drop**: All active WebSocket connections to `/ws` disconnect immediately.

## Symptoms

- HTTP requests to `http://<host>:<PORT>/api/health` fail with `ECONNREFUSED` or timeout.
- Reverse proxy (if present) returns `502 Bad Gateway` or `503 Service Unavailable`.
- Browser console reports `WebSocket connection to 'ws://<host>:<PORT>/ws' failed`.
- Server process terminates or throws `Error: listen EADDRINUSE: address already in use :::3001` or `:::3000`.

## Severity

**P0** — Complete Production Outage

## Immediate Actions

1. Check if the Node.js server process is running.
2. Probe the health endpoint directly on localhost to bypass external network/load balancer layers:
   ```bash
   curl -I http://localhost:3001/api/health
   ```
   *(Or configured `PORT` from environment).*
3. Inspect the most recent process logs for unhandled exceptions or fatal errors.

## Diagnosis

### Step 1: Check Process and Port Status
Verify whether another process is already occupying the configured port (`PORT` env var, default `3001` in `server.ts` or `3000` in dev):

On Windows (PowerShell):
```powershell
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Format-Table -Property OwningProcess, State
```

On Linux / macOS:
```bash
lsof -i :3001
# or
netstat -tuln | grep 3001
```

### Step 2: Check Node Process Logs
Look for the following common failure signatures:
- **`EADDRINUSE`**: Another zombie Node instance or conflicting service is occupying the port.
- **`Cannot find module '.../dist/server.cjs'`**: Production was started before running `npm run build`.
- **`ENOENT: no such file or directory, stat '.../dist/index.html'`**: The Vite client build was skipped or cleared.
- **Out of Memory (OOM)**: `JavaScript heap out of memory` during large JSON broadcast.

### Step 3: Verify Application Build Integrity
Check that required production bundle artifacts exist:
- `dist/server.cjs`
- `dist/index.html`
- `dist/assets/`

If these files are missing, the production entry point cannot serve the application.

## Recovery

### Scenario A: Port Conflict (`EADDRINUSE`)
If a defunct or orphaned process holds port 3001:

1. Terminate the conflicting process:
   ```bash
   npx kill-port 3001
   ```
2. Confirm the port is free:
   ```powershell
   Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
   ```
3. Restart the production server:
   ```bash
   npm start
   ```

### Scenario B: Missing or Corrupted Build Artifacts
If `dist/` is corrupted or missing:

1. Clean previous build artifacts:
   ```bash
   npm run clean
   ```
2. Verify TypeScript integrity:
   ```bash
   npm run lint
   ```
3. Rebuild the client SPA and bundled server:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```

### Scenario C: Process Crash in Production Daemon / PM2 / Container
If managed by a process manager:
1. Check process status:
   ```bash
   # If running via node directly:
   node dist/server.cjs
   ```
2. Ensure environment variable `NODE_ENV=production` is set so static file serving is activated.

## Validation

1. Verify HTTP Health Endpoint returns status `ok`:
   ```bash
   curl -s http://localhost:3001/api/health
   ```
   Expected response:
   ```json
   {
     "status": "ok",
     "connectedClients": 0,
     "servicesCount": 140,
     "workersCount": 10,
     "bookingsCount": 1
   }
   ```
2. Verify WebSocket connection:
   Open browser at `http://localhost:3001/` and check that the real-time indicator shows `🟢 Live Connected` (WebSocket `/ws` connected).
3. Verify static page loads:
   `curl -I http://localhost:3001/` should return `HTTP/1.1 200 OK`.

## Rollback

If a recent code deployment caused the fatal server crash:
1. Check git commit history to identify the last stable commit:
   ```bash
   git log -n 5 --oneline
   ```
2. Revert to the previous known good commit:
   ```bash
   git checkout <last-stable-commit-hash>
   ```
3. Rebuild and restart:
   ```bash
   npm run build
   npm start
   ```

## Escalation

Escalate to Platform Lead / Tech Lead if:
- The server crashes continuously immediately after startup with an untraceable memory fault.
- The port remains locked at the operating system socket layer even after process termination.
- Outage exceeds 15 minutes without recovery.

## Do Not

- **DO NOT** restart the server repeatedly in a loop without inspecting logs; remember that each process restart completely resets all in-memory bookings and active ledger records to seed defaults.
- **DO NOT** edit production files directly in `dist/`. Always build from source.
- **DO NOT** ignore TypeScript linting errors before building.

## Root Cause Follow-Up

1. Review exception logs leading to the crash to identify unhandled promise rejections.
2. Ensure process supervisor (e.g. systemd, PM2, Docker container restart policy) is configured for automatic restarts.
3. Review memory usage trends to ensure in-memory state (audit logs, ledger) is not leaking memory over time.
