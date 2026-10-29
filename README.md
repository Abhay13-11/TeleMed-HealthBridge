# HealthBridge: Telemedicine Platform for Rural Healthcare Access

**HealthBridge** is a digital health platform designed to transform healthcare accessibility in rural communities, with an initial regional focus on **Nabha and its 173 surrounding villages in Patiala district, Punjab, India**.

Architected, developed, and maintained by **Abhay Singh Chauhan** ([@Abhay13-11](https://github.com/Abhay13-11)).

The platform provides remote clinical consultations, appointment lifecycle management, localized health records, community pharmacy inventory tracking, and safety-first symptom triage—optimized for low-bandwidth rural environments.

---

## Author & Project Lead

- **Lead Architect & Developer**: **Abhay Singh Chauhan**
- **Repository**: [https://github.com/Abhay13-11/TeleMed-HealthBridge](https://github.com/Abhay13-11/TeleMed-HealthBridge)
- **Backend API**: [https://healthbridge-api-tcnq.onrender.com](https://healthbridge-api-tcnq.onrender.com)

---

## Quick Start & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: npm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# http://localhost:8080
```

### Verification & Quality Commands

```bash
# Execute automated test suite (node:test)
npm test

# Run ESLint validation
npm run lint

# Compile production bundle and typecheck
npm run build

# Run backend tests
npm run server:test
```

---

## Pre-Configured Demo Accounts

For evaluation and testing, four pre-configured roles are available out-of-the-box. All accounts use the standard password: `12345`

| Role | Account Name | Email | Password | Intended Capabilities |
| :--- | :--- | :--- | :---: | :--- |
| **Patient** | Krishna | `patient@demo.com` | `12345` | Consultation booking, symptom screening, personal records, medicine search |
| **Doctor** | Dr. Rachit Kumar | `doctor@demo.com` | `12345` | Consultation room, appointment status updates, prescription/record creation |
| **Pharmacist** | Nabha Rural Pharmacy | `pharmacy@demo.com` | `12345` | Inventory management, medicine restocking, stockout alerts |
| **Administrator** | **Abhay Singh Chauhan** | `admin@demo.com` | `12345` | System telemetry, clinical audit logs, provider management, appointments |

> **Security Note**: Public registration on the landing page is strictly bounded to the `patient` role. Administrative and clinical provider roles cannot be self-assigned via public registration.

---

## System Architecture

- **Frontend Core**: React 18.3.1 with TypeScript 5.8.3 + Tailwind CSS + Radix UI
- **Backend Server**: Node.js + Express + TypeScript in `server/` with PostgreSQL relational schema
- **Real-Time Gateway**: Socket.IO WebRTC signaling gateway for 1-to-1 teleconsultations
- **Data Repository**: `src/services/storage.ts` and `server/src/db/` with conflict protection, appointment state machines, and RBAC filters.
- **Routing**: `react-router-dom` with client-side SPA route rewrites configured in `vercel.json`.
- **Emergency Protocols**: Safety triage with red-flag detection linking directly to Indian national emergency services (**112** for emergency, **108** for ambulance).

---

## Project Documentation

Detailed technical documentation is available in the `docs/` directory:

- [docs/BACKEND_ARCHITECTURE.md](docs/BACKEND_ARCHITECTURE.md) — Node.js + Express + PostgreSQL architecture, Socket.IO WebRTC, and API routes.
- [docs/IMPLEMENTATION_AUDIT.md](docs/IMPLEMENTATION_AUDIT.md) — Comprehensive technical audit, feature gap analysis, and implementation roadmap.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Deployment instructions for Render, Vercel, and Nginx.
- [docs/SECURITY_AND_PRIVACY.md](docs/SECURITY_AND_PRIVACY.md) — Role-based access control (RBAC), data governance, and clinical safety safeguards.
- [docs/TESTING.md](docs/TESTING.md) — Automated test suite report and verification checklists.

---

## License

This project is licensed under the MIT License. Developed by Abhay Singh Chauhan.
