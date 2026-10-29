# HealthBridge Production Backend Architecture

This document describes the **Node.js + Express + TypeScript + PostgreSQL** backend built for the HealthBridge telemedicine platform.

---

## 1. Overview & Key Capabilities

- **Runtime**: Node.js (v18+) with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (with automatic connection pooling via `pg.Pool`) & Resilient Local File/Memory Fallback Store
- **Authentication**: Stateless JSON Web Tokens (JWT) + salted `bcryptjs` password hashing
- **Security Middleware**: `helmet`, `cors` allowlist, and strict Role-Based Access Control (RBAC)
- **Real-Time WebRTC Gateway**: `socket.io` signaling for peer-to-peer clinical teleconsultation and chat

---

## 2. Directory Layout

```
server/
├── data_store.json         # Local seed and fallback persistence store
├── package.json            # Backend scripts and dependencies
├── tsconfig.json           # Modern ES2022 TypeScript configuration
├── .env.example            # Environment configuration template
├── src/
│   ├── index.ts            # Main application entry point & Socket.IO server
│   ├── types/              # Typed models (User, Appointment, HealthRecord, etc.)
│   ├── db/
│   │   ├── index.ts        # Database connection pool & resilient fallback store
│   │   ├── schema.sql      # Production PostgreSQL relational schema
│   │   ├── migrate.ts      # Automated database migration runner
│   │   └── seed.ts         # Deterministic demo user and clinic data seeder
│   ├── middleware/
│   │   └── auth.ts         # JWT verification & RBAC authorization guards
│   ├── controllers/
│   │   ├── authController.ts        # Login, registration, anti-privilege escalation
│   │   ├── appointmentController.ts # 7-state transitions, slot conflict protection
│   │   ├── recordController.ts      # Patient-isolated records, clinical write guard
│   │   ├── inventoryController.ts   # Medication search, non-negative clamping
│   │   └── adminController.ts       # Telemetry analytics and audit log viewer
│   ├── routes/             # Express route declarations
│   └── services/
│       └── webrtc.ts       # Socket.IO WebRTC signaling room handlers
└── tests/
    └── api.test.mjs        # Automated integration test suite (6 passing suites)
```

---

## 3. Database Schema (PostgreSQL)

Located in `server/src/db/schema.sql`:

1. **`users`**:
   - `id`, `name`, `email` (unique index), `password` (bcrypt hash), `role` (`patient`, `doctor`, `pharmacy`, `admin`), `phone`, `location`, `specialization`, `created_at`.
2. **`appointments`**:
   - `id`, `patient_id` (FK `users.id`), `doctor_id` (FK `users.id`), `specialty`, `date`, `time`, `type` (`video`, `in-person`, `phone`), `status` (`REQUESTED`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `FAILED`, `RESCHEDULED`), `symptoms`, `notes`, `audit_log` (`JSONB`).
3. **`health_records`**:
   - `id`, `patient_id` (FK `users.id`), `doctor_id` (FK `users.id`), `title`, `type`, `date`, `status`, `summary`, `created_by` (FK `users.id`).
4. **`medicines`**:
   - `id`, `pharmacy_id` (FK `users.id`), `name`, `generic_name`, `category`, `dosage_form`, `strength`, `stock` (`CHECK (stock >= 0)`), `min_stock`, `max_stock`, `price`, `mrp`, `batch_number`, `expiry_date`.
5. **`audit_logs`**:
   - `id`, `timestamp`, `actor_id`, `actor_name`, `actor_role`, `action`, `entity_type`, `entity_id`, `details`.

---

## 4. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Public registration (strictly defaults newly registered users to `patient`).
- `POST /api/auth/login` — Authenticates user via email and password; returns JWT token.
- `GET /api/auth/me` — Protected endpoint returning active user profile.

### Appointments (`/api/appointments`)
- `GET /api/appointments` — Lists appointments (Patients see their own; Doctors see their assigned consultations; Admins see all).
- `POST /api/appointments` — Books appointment with slot conflict protection (prevents overlapping bookings for the same doctor at the same slot).
- `PATCH /api/appointments/:id/status` — State machine transition (`CONFIRMED`, `RESCHEDULED`, `COMPLETED`, `CANCELLED`) with append-only audit trail.

### Health Records (`/api/records`)
- `GET /api/records` — Strict RBAC isolation (Patients strictly filtered by `patientId === user.id`).
- `POST /api/records` — Clinical write guard (Only doctors and administrators can issue records).

### Medicine Inventory (`/api/inventory`)
- `GET /api/inventory?query=...` — Publicly searchable pharmacy stock.
- `PATCH /api/inventory/:id/stock` — Stock level updates (Restricted to `pharmacy`/`admin`; clamps at `0` to prevent negative inventory).
- `POST /api/inventory` — Adds a new medicine entry.

### System Telemetry & Auditing (`/api/admin`)
- `GET /api/admin/telemetry` — Live system metrics (consultation counts, low stock alerts, active providers).
- `GET /api/admin/audit-logs` — Immutable audit trail of clinical and inventory actions.

---

## 5. WebRTC Signaling Gateway

Socket.IO is configured on the same HTTP server port (`5000`):
- `join-room`: Peer joins consultation room (`roomId` = appointment ID).
- `offer`: Relays Session Description Protocol (SDP) offer.
- `answer`: Relays SDP answer.
- `ice-candidate`: Relays network connectivity candidates.
- `chat-message`: Broadcasts in-consultation messages.
- `leave-room`: Disconnects and notifies the peer.

---

## 6. How to Run

### Development Mode (with hot-reload)
```powershell
# From repository root:
npm run server:dev

# Or inside server directory:
cd server
npm run dev
```

### Production Build & Execution
```powershell
cd server
npm run build
npm start
```

### Running Backend Automated Tests
```powershell
cd server
npm test
```

### Connecting to a Live PostgreSQL Instance
1. In `server/.env`, set:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/healthbridge
   ```
2. Run database migration:
   ```powershell
   npm run migrate
   ```
3. Run seed data initialization:
   ```powershell
   npm run seed
   ```
*(Note: If PostgreSQL is not connected, the server automatically operates in its resilient local store mode without crashing).*
