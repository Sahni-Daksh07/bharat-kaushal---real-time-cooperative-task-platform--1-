# Incident: In-Memory State Loss, Process Restart, or Accidental Demo Reset

## Purpose

Operational recovery runbook when live platform state (bookings, registered workers, customer profiles, ledger entries, welfare records, or policy settings) is wiped or unexpectedly reset to the baseline seed data.

## Impact

- **Loss of Volatile Data**: Newly created bookings in progress, dynamically registered workers, customer addresses, and completed transactions not recorded in external systems disappear.
- **State Reversion**: Platform state instantly reverts to initial seed fixtures (`INITIAL_BOOKING` `SS-1042`, baseline `SEEDED_WORKERS`, and `INITIAL_POLICY`).
- **User Confusion**: Active customers and workers may see their ongoing tasks reset or disappear from their dashboard.

## Symptoms

- Active bookings in progress suddenly vanish from the customer and worker dashboards.
- Recent ledger audit transactions reset back to entry `LEDGER-001`.
- The server audit log shows:
  ```json
  {"event": "SYSTEM_BOOT", "details": "Bharat Kaushal Real-Time Engine initialized with 140 Indore services catalog."}
  ```
  or
  ```json
  {"event": "DEMO_RESET", "details": "System state reset to baseline demo seed."}
  ```
- All connected WebSocket clients receive an unexpected `INIT_STATE` broadcast resetting their views.

## Severity

**P1** — Serious Production Degradation & Data Loss

## Immediate Actions

1. Check the server `/api/health` endpoint:
   ```bash
   curl -s http://localhost:3001/api/health
   ```
   Note the `time` and `bookingsCount` fields.
2. Inspect the server console / audit logs to verify whether a server restart or an endpoint invocation caused the reset.
3. Inform active users via a broadcast announcement or platform notification.

## Diagnosis

### Architecture Context (Source of Truth)
Bharat Kaushal uses an **in-memory, server-authoritative state model** in `server.ts`:
```typescript
let workers: WorkerProfile[] = JSON.parse(JSON.stringify(SEEDED_WORKERS));
let customers: CustomerProfile[] = JSON.parse(JSON.stringify(SEEDED_CUSTOMERS));
let bookings: Booking[] = [JSON.parse(JSON.stringify(INITIAL_BOOKING))];
let ledger: FinancialLedgerEntry[] = [...];
```
There is **no external relational or document database attached** to this deployment. Consequently:
- Any process termination, crash, or container restart reinitializes all variables from `src/data/seedData.ts`.
- Invoking `POST /api/demo/reset` explicitly reinitializes all in-memory arrays.

### Step 1: Check Audit Logs to Identify Cause
Examine the audit log in server state:
- If the first log entry is `SYSTEM_BOOT`, the Node.js process crashed or was restarted by the host / process supervisor.
- If the first log entry is `DEMO_RESET`, an admin or automated test triggered `POST /api/demo/reset`.

### Step 2: Check Client LocalStorage
Client-side browsers may still retain local session keys:
- `bk_auth_customer`: Customer session profile
- `bk_auth_worker`: Worker session profile
- `GEOAPIFY_API_KEY`: Custom map API keys
If the server reset, client local storage will still attempt to authenticate with IDs that may have been wiped if they were registered post-boot.

## Recovery

### Scenario A: Unintended Process Restart
Because state is non-persistent in memory:
1. Confirm the server has rebooted into a clean, healthy state:
   ```bash
   curl -s http://localhost:3001/api/health
   ```
2. Notify connected users to re-submit any active service requests.
3. Seeded accounts (`SEEDED_WORKERS`, `PRIMARY_DEMO_CUSTOMER`) remain immediately available for continued operations.

### Scenario B: Accidental Demo Reset Endpoint Invocation
If `POST /api/demo/reset` was triggered accidentally:
1. Identify the source IP or client that issued the request.
2. Verify that Super Admin / Federation Admin portals are restricted to authorized personnel.
3. Re-enter any critical policy overrides (such as active cooperative welfare commission splits) via the Federation Admin portal or `POST /api/policies`.

## Validation

1. Verify server returns healthy status with baseline seeded data:
   ```bash
   curl -s http://localhost:3001/api/health
   ```
   Expected:
   - `servicesCount`: 140
   - `workersCount`: >= 10
   - `bookingsCount`: >= 1
2. Confirm WebSockets are streaming state:
   Check that connecting to `/ws` delivers a valid `INIT_STATE` payload.
3. Confirm Customer Portal loads services from `INDORE_SERVICES_DATASET`.

## Rollback

**No verified rollback mechanism found.** In-memory state prior to process restart or reset cannot be restored unless snapshots were exported externally.

## Escalation

- Notify Platform Architect and Product Owner regarding lost in-flight transactions.
- If the process restarted due to an unhandled exception or memory leak, request engineering review of the stack trace.

## Do Not

- **DO NOT** trigger `POST /api/demo/reset` in production unless explicitly approved for an intentional demo reset.
- **DO NOT** execute `npx kill-port` or `kill -9` against the production Node process unless it is confirmed frozen and unrecoverable, as this will immediately erase all runtime bookings.

## Root Cause Follow-Up

1. Document the need for an external persistent data layer (PostgreSQL, SQLite, or Redis) if persistence across restarts becomes a formal requirement.
2. Protect the `/api/demo/reset` endpoint behind strong authentication or disable it in production (`process.env.NODE_ENV === 'production'`).
