# HealthBridge: Telemedicine Platform for Rural Healthcare Access

HealthBridge is a digital health platform designed to improve healthcare access in rural communities, with initial focus on **Nabha and its 173 surrounding villages in Patiala district, Punjab, India**.

The application provides remote clinical consultations, appointment lifecycle management, localized health records, community pharmacy inventory tracking, and safety-first symptom triage—tailored for low-bandwidth rural environments.

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
# http://localhost:8080 (or the port Vite outputs)
```

### Verification & Quality Commands

```bash
# Execute automated test suite (node:test)
npm test

# Run ESLint validation
npm run lint

# Compile production bundle and typecheck
npm run build

# Preview production build locally
npm run preview
```

---

## Pre-Configured Demo Accounts

For evaluation and testing, four pre-configured roles are available out-of-the-box. All accounts use the standard password: `12345`

| Role | Email | Password | Intended Capabilities |
| :--- | :--- | :---: | :--- |
| **Patient** | `patient@demo.com` | `12345` | Consultation booking, symptom screening, personal records, medicine search |
| **Doctor** | `doctor@demo.com` | `12345` | Consultation room, appointment status updates, prescription/record creation |
| **Pharmacist** | `pharmacy@demo.com` | `12345` | Inventory management, medicine restocking, stockout alerts |
| **Administrator** | `admin@demo.com` | `12345` | System telemetry, clinical audit logs, provider management, appointments |

> **Security Note**: Public registration on the landing page is strictly bounded to the `patient` role. Administrative and clinical provider roles cannot be self-assigned via public registration.

---

## System Architecture

- **Frontend Core**: React 18.3.1 with TypeScript 5.8.3
- **Build System**: Vite 5.4.21
- **Styling & UI**: Tailwind CSS with Radix UI accessible primitives, custom warm-ivory / deep forest green palette
- **Data Repository**: `src/services/storage.ts` provides a typed, persistent storage layer with deterministic seed data, conflict protection, appointment state machines, and RBAC filters.
- **Routing**: `react-router-dom` with client-side SPA route rewrites configured in `vercel.json`.
- **Media Consultation**: Local `getUserMedia` preview with permission-denial handling and fallback to clinical audio/chat guidance.
- **Emergency Protocols**: Safety triage with red-flag detection linking directly to Indian national emergency services (**112** for emergency, **108** for ambulance).

---

## Project Documentation

Detailed technical documentation is available in the `docs/` directory:

- [docs/IMPLEMENTATION_AUDIT.md](docs/IMPLEMENTATION_AUDIT.md) — Comprehensive technical audit, feature gap analysis, and implementation roadmap.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Deployment instructions for Vercel, Netlify, and Nginx, including SPA rewrites and HTTP headers.
- [docs/SECURITY_AND_PRIVACY.md](docs/SECURITY_AND_PRIVACY.md) — Role-based access control (RBAC), data governance, audit logging, and anti-escalation safeguards.
- [docs/TESTING.md](docs/TESTING.md) — Automated test suite report, verification checklists, and QA results.

---

## Problem Statement & Context

### Healthcare Access in Nabha, Punjab
- **Staffing Vacancies**: The local Civil Hospital in Nabha operates with limited medical specialists across clinical departments.
- **Travel Overhead**: Patients traveling from rural villages incur travel costs and daily wage loss.
- **Pharmacy Stockouts**: Patients frequently travel to town only to find critical medications out of stock.
- **HealthBridge Impact**: Enables patients to check medicine availability before traveling, book remote follow-ups, and receive triage recommendations.

---

## License

This project is licensed under the MIT License.
