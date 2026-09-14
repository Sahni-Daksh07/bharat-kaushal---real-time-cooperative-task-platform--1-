# Bharat Kaushal — Production Runbooks & Operations Guide

## Overview

This directory contains verified, production-ready operational runbooks for the **Bharat Kaushal Real-Time Cooperative Task Platform**.

These runbooks provide step-by-step diagnostic and recovery procedures for on-call engineers, operators, and incident responders when production incidents occur.

---

## Architecture Summary (Source of Truth)

- **Application Type**: Unified Full-Stack Node.js + React SPA
- **Frontend**: React 19, TypeScript, Tailwind CSS, Leaflet, Recharts, bundled via Vite 6
- **Backend**: Express 4 HTTP server + `ws` WebSocketServer on a shared HTTP listener
- **Data Persistence**: **In-Memory Server-Authoritative Store** initialized from `src/data/seedData.ts` and `src/data/servicesData.ts`. Note: The application does NOT use an external database (SQL/NoSQL); all state lives in process memory.
- **Real-Time Communication**: WebSocket endpoint at `/ws` broadcasting state synchronization events
- **External Dependencies**:
  - Google Gemini AI (`@google/genai`) for vocational classification & question generation (with built-in rule-based fallback)
  - Geoapify / OpenStreetMap for map cartography & GPS dispatch (with client/radar fallback)
  - Firebase Auth (`src/auth.ts`) for optional Google OAuth sign-in

---

## Incident Severity Matrix

| Severity | Definition | Target Response | Target Resolution |
| :--- | :--- | :--- | :--- |
| **P0** | Complete platform outage, security breach, or critical credential compromise | < 15 minutes | < 1 hour |
| **P1** | Core functionality severely degraded (WebSockets down, state wipe, build failure) | < 30 minutes | < 2 hours |
| **P2** | Partial feature impairment with active fallbacks (AI degradation, map tiles) | < 2 hours | Next business window |
| **P3** | Cosmetic, minor logging, or non-impacting maintenance issues | Best effort | Planned release |

---

## Runbook Index

| Runbook | Incident Description | Severity | Primary Target |
| :--- | :--- | :---: | :--- |
| [server-outage.md](./server-outage.md) | Unified Node/Express HTTP Server Down or Unresponsive | **P0** | Express listener, port binding, Node process |
| [credential-exposure-incident.md](./credential-exposure-incident.md) | Accidental Secret Exposure / Compromised API Key | **P0** | Firebase, Gemini API, Geoapify credentials |
| [websocket-desynchronization.md](./websocket-desynchronization.md) | Real-Time WebSocket Disconnection & State Desynchronization | **P1** | `/ws` route, reverse proxy, client sync |
| [state-loss-and-reset.md](./state-loss-and-reset.md) | In-Memory State Loss, Process Restart, or Accidental Reset | **P1** | Volatile in-memory store, baseline recovery |
| [production-build-asset-failure.md](./production-build-asset-failure.md) | Production Build, Bundling, or Static Asset Delivery Failure | **P1** | Vite build, `dist/server.cjs`, asset routes |
| [external-api-degradation.md](./external-api-degradation.md) | Gemini AI or Geoapify Rate Limiting / Degradation | **P2** | Fallback classification, map cartography |

---

## Operational Guardrails & AI Safety Rules

### Safe Automation (Automated Retries / Scripted Checks)
- Running read-only health checks (`GET /api/health`)
- Inspecting server logs and process status
- Checking network reachability and HTTP response codes
- Running local type and syntax checks (`npm run lint`)

### Requires Explicit Human Approval (High-Risk Actions)
- Killing/terminating active Node.js processes in production (wipes in-memory state!)
- Triggering `POST /api/demo/reset` (destroys live bookings and ledger history)
- Revoking or rotating production API keys in external provider consoles
- Deploying unverified code or force-pushing Git branches
- Modifying production environment variables
