# HealthBridge Deployment Guide

This guide details the procedure for deploying the **HealthBridge** rural telemedicine platform to modern edge and static hosting providers such as Vercel, Netlify, or standard Nginx/Cloudflare Pages environments.

---

## 1. Architecture Overview

- **Framework**: Vite + React 18 + TypeScript + Tailwind CSS
- **Application Type**: Client-Side Single Page Application (SPA)
- **Data Layer**: Typed localStorage Persistence Repository (`src/services/storage.ts`) with deterministic seed datasets, conflict detection, role-based access filtering, and an audit trail.
- **Production Distribution**: Statically compiled HTML, CSS bundles, and JS chunks located in `dist/`.

---

## 2. Vercel Deployment

`vercel.json` is located in the repository root and is pre-configured with SPA route rewrites and hardened HTTP security headers.

### Steps for Deployment via Vercel Dashboard

1. **Import Repository**:
   - Log in to your Vercel account.
   - Click **Add New...** > **Project**.
   - Select the `TeleMed-HealthBridge` repository.

2. **Configure Build and Output Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Configure Environment Variables**:
   Copy the keys from `.env.example` into Vercel Project Settings > Environment Variables:
   - `VITE_APP_NAME`: `HealthBridge Telemedicine`
   - `VITE_APP_ENV`: `production`
   - `VITE_APP_VERSION`: `1.0.0`
   - `VITE_DEFAULT_REGION`: `Nabha, Punjab`
   - `VITE_CIVIL_HOSPITAL_CODE`: `PB-PTA-NABHA-01`
   - `VITE_API_BASE_URL`: (Optional - set if connecting to a backend microservice)
   - `VITE_WEBRTC_SIGNALING_URL`: (Optional - for dedicated external WebRTC signaling)
   - `VITE_STUN_SERVER`: `stun:stun.l.google.com:19302`
   - `VITE_EMERGENCY_NATIONAL`: `112`
   - `VITE_EMERGENCY_AMBULANCE`: `108`

4. **Deploy**:
   - Click **Deploy**. Vercel will run `npm run build` and publish the site.

---

## 3. Route Rewrites and Single Page Application (SPA) Routing

Because HealthBridge uses client-side routing (`react-router-dom`), any direct URL navigation or browser refresh to subpaths (such as `/appointments`, `/reports`, `/consultations`, or `/inventory`) will result in a 404 HTTP error unless the hosting provider is configured to route all incoming requests back to `/index.html`.

In `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

For **Nginx**, configure the fallback location block:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 4. HTTP Security Headers

`vercel.json` injects standard defense-in-depth headers on all response streams:
- `X-Content-Type-Options: nosniff` — Prevents MIME-type sniffing.
- `X-Frame-Options: DENY` — Prevents clickjacking by forbidding embedding in iframes.
- `X-XSS-Protection: 1; mode=block` — Enables legacy browser XSS filters.
- `Referrer-Policy: strict-origin-when-cross-origin` — Protects referral metadata.
- `Permissions-Policy: camera=(self), microphone=(self), geolocation=()` — Restricts hardware APIs exclusively to the application origin.

---

## 5. Verification Checklist Post-Deployment

1. **Direct Deep Links**: Visit `/appointments` and `/reports` directly in a fresh tab; ensure `/index.html` loads and routes without a 404.
2. **Demo Account Access**: Log in as each of the 4 demo profiles (`patient@demo.com`, `doctor@demo.com`, `pharmacy@demo.com`, `admin@demo.com` with password `12345`).
3. **Hardware Media Permissions**: Verify camera and microphone prompt triggers on `/consultations`.
4. **Offline Resilience**: Open Chrome DevTools > Application > Storage and verify that local appointments, health records, and inventory operate offline.
