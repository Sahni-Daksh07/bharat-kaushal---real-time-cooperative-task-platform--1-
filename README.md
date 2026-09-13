# Bharat Kaushal — Real-Time Cooperative Task Platform

> A cooperative digital labour and local services ecosystem built with React 19, TypeScript, Express, WebSockets, Leaflet maps, and Gemini AI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Installation & Getting Started](#installation--getting-started)
- [Available Scripts](#available-scripts)
- [Role Portals & Demo Access](#role-portals--demo-access)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

**Bharat Kaushal** empowers artisans, gig workers, housing societies, and consumers through a decentralized, cooperative-first platform. It replaces exploitative platform commission models with a democratic, transparent welfare-backed cooperative structure featuring live spatial dispatch, dynamic crew/scope sizing, real-time OTP validation, and cooperative dividend sharing.

---

## ✨ Key Features

- **Multi-Role Experience**: Dedicated portals for **Customers**, **Artisans/Workers**, **Society Admins**, **Federation Admins**, and **Super Admins**.
- **Real-Time WebSocket Synchronization**: Live dispatch matching, worker status broadcasting, location tracking, and instant notifications.
- **Dynamic Scope & Crew Calculator**: Automatically estimates required crew size, job duration, and transparent cost breakdown based on room sizes, floor levels, and material selection.
- **Fair Cooperative Pricing & Welfare**: 85% worker earnings guarantee, welfare fund allocation, and transparent ledger tracking.
- **Interactive Mapping & Geo-Routing**: Leaflet & Geoapify integration for real-time proximity dispatch (within 5 km zones in Indore).
- **AI-Powered Diagnostics & Assessments**: Server-side Gemini AI integration for skill assessments and multilingual task analysis.
- **Multilingual Support**: Real-time translation supporting English, Hindi, and regional languages.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion, Leaflet, Recharts
- **Backend Server**: Node.js, Express, `ws` (WebSockets), `tsx`
- **Build Tooling**: Vite 6, `esbuild`
- **AI Engine**: Google Gen AI SDK (`@google/genai`)

---

## ⚙️ Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v18.0.0` or higher (Node.js 20+ recommended)
- **npm**: `v9.0.0` or higher (or `yarn` / `pnpm`)

---

## 🔐 Environment Configuration

Create a `.env` file in the root directory by copying from `.env.example`:

```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:

```env
# Gemini AI API Key for smart assessment generation & task diagnostics
GEMINI_API_KEY="your_gemini_api_key_here"

# Application URL (used for callbacks and links)
APP_URL="http://localhost:3000"

# Optional: Geoapify API key for map tile styling and spatial routing
VITE_GEOAPIFY_API_KEY="your_geoapify_api_key_here"
```

> **Note**: The application will run smoothly with seeded fallback logic even if external API keys are not provided.

---

## 🚀 Installation & Getting Started

Follow these steps to run the application locally:

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The unified full-stack server (Express + Vite + WebSockets) will start at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the unified Express backend and Vite frontend with live hot-reloading on port `3000`. |
| `npm run build` | Compiles the React SPA to `dist/` and bundles the Express server to `dist/server.cjs`. |
| `npm start` | Runs the compiled production server (`node dist/server.cjs`). |
| `npm run lint` | Runs TypeScript type-checking (`tsc --noEmit`) to verify syntax and types. |
| `npm run preview` | Previews the Vite production build locally. |
| `npm run clean` | Removes build artifacts (`dist/` and generated bundles). |

---

## 👥 Role Portals & Demo Access

The platform comes pre-seeded with test profiles. Use the **Role Switcher** bar at the top of the interface to seamlessly switch between:

1. **Customer Portal**: Browse 15+ home & trade services, configure dynamic scope/crew requirements, dispatch local artisans, track live location, and complete OTP-verified jobs.
2. **Worker / Artisan Portal**: Toggle availability (Online/Busy/Offline), receive live dispatch requests with sound alerts, navigate to customer locations, and manage cooperative earnings & welfare benefits.
3. **Society Admin Portal**: Manage verified society artisan rosters, gate access permissions, and local maintenance requests.
4. **Federation Admin Portal**: Supervise regional clusters (Indore Central, Vijay Nagar, etc.), dispute resolutions, and cooperative welfare distribution.
5. **Super Admin Dashboard**: Full platform governance, real-time WebSocket connection monitoring, system metrics, dynamic policy configuration, and financial ledger audits.

---

## 💡 Troubleshooting

- **Port 3000 already in use**: Ensure no other service is occupying port `3000`, or terminate the conflicting process:
  ```bash
  npx kill-port 3000
  ```
- **Dependencies out of date**: Run `npm install` to ensure all packages (including `@google/genai` and `leaflet`) are installed.
- **TypeScript checks**: Run `npm run lint` to inspect type integrity across client and server files.

---

## 📄 License

This project is licensed under the MIT License.
