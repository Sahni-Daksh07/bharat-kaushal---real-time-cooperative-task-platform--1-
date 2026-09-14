# Incident: WebSocket Disconnection & Real-Time Desynchronization

## Purpose

Diagnostic and recovery runbook for incidents where real-time WebSocket communication breaks, causing clients to desynchronize, dispatch updates to halt, or the UI connection indicator to show `DISCONNECTED` or persistent `CONNECTING`.

## Impact

- **Live Dispatch Failure**: Workers do not receive incoming job sound alerts or dispatch requests in real time.
- **Doorstep Tracking Stall**: Customer map does not show live artisan movement or ETA updates.
- **OTP Validation Lag**: Arrival and completion OTP confirmations do not propagate to the other party until manual page refresh.
- **Admin Visibility Blindspot**: Federation and Super Admin command portals display stale metrics and offline connection counts.

## Symptoms

- The top UI toast or status bar displays `🔴 Disconnected` or cycles indefinitely in `🟡 Connecting`.
- Browser developer console displays repeated errors:
  ```
  WebSocket connection to 'wss://<host>/ws' failed: WebSocket is closed before the connection is established
  ```
- Reconnect loop triggered every 2500ms in `src/context/RealtimeContext.tsx`.
- `/api/health` reports `connectedClients: 0` despite active users browsing the site.
- Node server logs show JSON parsing failures or unhandled socket exceptions:
  ```
  Failed to parse WS message
  Error handling WS event
  ```

## Severity

**P1** — Major Platform Feature Impairment

## Immediate Actions

1. Check the server `/api/health` endpoint to see the active client count:
   ```bash
   curl -s http://localhost:3001/api/health
   ```
2. Check if the WebSocket port/path (`/ws`) is reachable directly from the host.
3. Open browser Developer Tools -> **Network** tab -> filter by **WS** (WebSockets). Check HTTP handshake status code (should be `101 Switching Protocols`).

## Diagnosis

### Step 1: Inspect Reverse Proxy / CDN WebSocket Headers
If running behind a reverse proxy (e.g. Nginx, Cloudflare, or cloud load balancer), verify that WebSocket upgrade headers are passed correctly to backend port 3001:

For Nginx, the configuration must include:
```nginx
location /ws {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
}
```
If `proxy_http_version 1.1` or the `Upgrade` header is missing, the proxy will return `400 Bad Request` or `502 Bad Gateway` on the WebSocket handshake.

### Step 2: Check Client URL Protocol Resolution
In `src/context/RealtimeContext.tsx`, the client resolves:
```typescript
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${protocol}//${window.location.host}/ws`;
```
- If the application is accessed over `https://`, browsers block insecure `ws://` connections (Mixed Content security restriction). Ensure SSL termination proxy properly supports `wss://`.

### Step 3: Check Server Socket Event Handlers
Inspect `server.ts` around `handleClientSocketMessage`:
- If an unhandled exception occurs inside a socket handler, verify whether the socket closed abnormally.
- Check if clients are being purged from `clients` Set on socket disconnect:
  ```typescript
  ws.on('close', () => { clients.delete(ws); });
  ```

## Recovery

### Scenario A: Proxy / Ingress Dropping Upgrades
1. Update reverse proxy / ingress rule to include `Upgrade` and `Connection "upgrade"` headers.
2. Ensure proxy read timeout is extended (e.g. `86400s` or heartbeat enabled) so idle connections are not severed every 60 seconds.
3. Reload proxy service without restarting the backend Node app (preserving in-memory state).

### Scenario B: Server-Side WebSocket Server Stall
If the Node server process is running but `wss` is unresponsive:
> [!CAUTION]
> **REQUIRES HUMAN APPROVAL**: Restarting the Node server will clear all in-flight bookings and restore seed baseline data. Only restart if proxy and network layers are verified healthy and socket creation is failing at the Node layer.

1. Verify server health:
   ```bash
   curl -s http://localhost:3001/api/health
   ```
2. If `connectedClients` remains stuck at `0` or rejects connections:
   ```bash
   npm start
   ```

### Scenario C: Client State Resynchronization
If clients experienced a temporary disconnect and missed events:
- Instruct users to refresh their browser tab. Upon reloading, `src/context/RealtimeContext.tsx` requests the full initial state (`INIT_STATE`) from `server.ts`, immediately restoring full synchronization.

## Validation

1. Run a test WebSocket connection check using `wscat` or `curl`:
   ```bash
   npx wscat -c ws://localhost:3001/ws
   ```
   Expected response: Server sends an initial `INIT_STATE` JSON payload containing `workers`, `customers`, `bookings`, etc.
2. In browser UI, verify status badge turns `🟢 Live Connected`.
3. Dispatch a test booking or toggle worker status and verify instant update across two open browser tabs.

## Rollback

No verified rollback mechanism for WebSocket runtime disconnects. If caused by a recent proxy configuration change, revert the proxy configuration file and reload the proxy daemon.

## Escalation

Escalate to Infrastructure / Platform Engineer if:
- Cloud provider load balancer / CDN is actively blocking WebSocket upgrade handshakes.
- SSL certificate mismatch prevents `wss://` handshake across domain names.

## Do Not

- **DO NOT** restart the server for single-user connection drops; client network blips are automatically recovered by `RealtimeContext`'s 2.5s reconnect loop.
- **DO NOT** disable SSL on production; browsers will reject non-secure WebSockets on secure domains.

## Root Cause Follow-Up

1. Implement WebSocket ping/pong heartbeats to keep idle mobile connections alive across aggressive cellular carrier NAT gateways.
2. Add structured metrics for connection drop rates and payload size monitoring in `server.ts`.
