# HealthBridge Security and Privacy Specification

This document details the security architecture, role-based access control (RBAC), data governance, and clinical safety practices implemented in **HealthBridge**.

---

## 1. Authentication and Identity Management

HealthBridge supports four distinct roles:
1. **Patient**: Books consultations, reviews own diagnostic reports, searches community pharmacy inventory.
2. **Doctor**: Reviews assigned appointments, conducts teleconsultations, issues verified clinical records and prescriptions.
3. **Pharmacist**: Manages local medicine inventory stock counts, reorder thresholds, and dispensed quantities.
4. **Administrator**: Oversees audit logs, system performance metrics, and clinical provider onboarding.

### Anti-Privilege-Escalation Guarantees
- The public registration flow (`AuthContext.register`) strictly defaults all newly created users to the `patient` role.
- Even if a malicious client payload attempts to specify `role: "admin"` or `role: "doctor"`, the registration handler discards the requested role and assigns `patient`.
- User objects stored in client storage omit plaintext passwords; credentials are evaluated during login against pre-registered user registries or demo credentials.

---

## 2. Role-Based Access Control (RBAC) & Data Isolation

Data operations are centralized in `src/services/storage.ts` (`StorageRepository`), enforcing role-level guards at the query and mutation boundaries:

### Health Records (`getHealthRecords`, `addHealthRecord`)
- **Patient Isolation**: When a patient requests medical records, the repository strictly filters by `r.patientId === user.id`. Patients cannot view other patients' consultations, prescriptions, or laboratory reports.
- **Doctor Scoping**: Doctors receive clinical records for patients under their active consultation care relationship (`r.doctorId === user.id`).
- **Creation Guard**: Only users with the role `doctor` or `admin` can call `addHealthRecord()`. An attempt by a patient to forge a medical record throws an unauthorized security exception.

### Pharmacy Inventory (`updateStockQuantity`)
- Stock modifications and dispensing adjustments are restricted strictly to users with the role `pharmacy` or `admin`.
- Quantities are validated to prevent negative stock numbers (`Math.max(0, quantity)`).

---

## 3. Clinical Audit Trail

Every major state mutation in HealthBridge generates an append-only audit event:
- **Appointment Lifecycle**: Changes from `REQUESTED` to `CONFIRMED`, `RESCHEDULED`, `COMPLETED`, or `CANCELLED` record:
  - Exact UTC timestamp
  - Actor ID, Name, and Role
  - Transition Action
  - Optional clinical rationale / notes
- **System Audit Log**: Administrative dashboards provide complete visibility into system actions, logins, inventory updates, and report generation events.

---

## 4. Clinical Safety & Emergency Protocols

- **Symptom Checker Disclaimer**: The symptom checker is strictly an informational clinical decision support triage guide. It explicitly informs users that it is **not** a diagnostic device.
- **Red Flag Escalation**: When red-flag symptoms are indicated (e.g., crushing chest pain, acute dyspnea, sudden neurological deficit, severe trauma), the system immediately displays emergency escalation cards featuring national Indian emergency numbers (**112** for emergency response and **108** for ambulance services) and directs the patient to Nabha Civil Hospital.

---

## 5. Privacy & Edge Storage Model

- HealthBridge operates with a resilient offline-first client architecture. In standard mode without an external centralized EHR database, records are isolated to the browser's origin-scoped localStorage.
- Clear and explicit consent checkboxes are required before booking consultations or sharing medical records.
- Cross-origin isolation and permissions policies in `vercel.json` ensure that third-party domains cannot access local audio, video, or clinical storage.
