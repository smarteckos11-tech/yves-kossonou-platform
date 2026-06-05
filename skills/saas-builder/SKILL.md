---
name: saas-builder
description: "Build complete, functional SaaS applications in a single HTML file for any sector (hotel, restaurant, clinic, school, logistics, salon, gym, etc.). Use this skill whenever the user wants to create a web application, SaaS product, management system, booking platform, CRM, ERP, or any business management software — especially for the African market or emerging economies. Triggers on: 'create a SaaS', 'build an app like ResidencePro', 'management system for', 'booking platform', 'CRM for', 'hotel management', 'restaurant management', 'clinic management', 'school management', 'inventory system', 'appointment booking', 'SaaS pour', 'application de gestion', 'logiciel de', 'plateforme de'. ALWAYS use this skill for any functional web app that needs CRUD, auth, dashboard, and sector-specific features."
---

# SaaS Builder — Full-Stack Single-File SaaS Generator

## Overview

This skill generates **complete, production-ready SaaS applications** packaged in a single HTML file. The architecture is proven in production (ResidencePro) and follows a battle-tested pattern: **Firebase backend + vanilla JS frontend + PWA capabilities**, deployable on any static host (Hostinger, Netlify, Vercel, GitHub Pages).

The goal is to deliver a **fully functional** application, not a prototype. Every generated SaaS includes: authentication, multi-tenant data isolation, CRUD operations, dashboard with charts, dark/light mode, WhatsApp integration, PDF generation, Excel export, and sector-specific business logic.

## When to Use This Skill

Use whenever the user wants to create:
- A management application (hotel, restaurant, clinic, school, warehouse, salon, gym, etc.)
- A booking/reservation platform
- A CRM or ERP system
- Any SaaS product that needs user accounts, data management, and a dashboard
- An "app like ResidencePro but for [sector X]"

## Generation Workflow

```
1. INTERVIEW  → Gather sector, features, pricing, branding
2. PLAN       → Define data model, collections, views, pricing tiers
3. GENERATE   → Build complete single-file HTML application
4. CONFIGURE  → Generate Firebase project setup instructions
5. DELIVER    → Save to /home/z/my-project/download/
```

---

## Step 1: Interview — Capture Requirements

Ask the user for these details (use French if they speak French):

| Question | Example | Default if not provided |
|----------|---------|------------------------|
| **Sector** | Hotel, restaurant, clinic, salon, school, etc. | Generic business management |
| **App name** | "CliniPro", "SalonMaster", "EcoleGest" | Based on sector + "Pro" |
| **Target country** | Cote d'Ivoire, Senegal, Cameroon, etc. | Zone FCFA (West Africa) |
| **Currency** | FCFA, USD, EUR | FCFA |
| **Core entities** | Clients/Chambres/Reservations, Patients/Dossiers, Eleves/Classes | Sector-specific (see references/sectors.md) |
| **Pricing** | Monthly tiers in local currency | 3 tiers adapted to market |
| **Special features** | WhatsApp reminders, QR codes, marketplace, etc. | WhatsApp + QR included by default |
| **Payment method** | WhatsApp contact, Mobile Money, Stripe | WhatsApp (offline payment) |
| **Language** | French, English, bilingual | French |
| **Admin email** | For super-admin access | Ask user |

If the user just says "create a SaaS for X", use defaults for everything else and proceed.

---

## Step 2: Plan — Data Model & Architecture

Read `references/sectors.md` for pre-built sector templates. Each template defines:

- **Entities**: Collections and subcollections
- **Fields**: Document schemas with types
- **Views**: Dashboard pages and forms
- **Business rules**: Validation, auto-calculations, triggers
- **Pricing tiers**: Feature matrix per plan

If the sector isn't in the templates, derive the data model from the sector's core workflows:

```
1. Identify the main "resources" (what the business manages)
2. Each resource → a Firestore subcollection
3. Identify relationships (a reservation belongs to a client + a room)
4. Define fields with types (string, number, date, select, file)
5. Identify calculated fields (totals, statuses, durations)
6. Define status machines (e.g., reservation: pending → confirmed → active → completed)
```

### Multi-Tenant Architecture (MANDATORY)

All SaaS apps use this tenant isolation pattern:

```
users/{userId}                    ← User profile + plan
  └── trial/current               ← Trial status

tenants/{tenantId}                ← Business/organization
  ├── {entity1}/{doc}             ← Sector entity 1 (e.g., clients)
  ├── {entity2}/{doc}             ← Sector entity 2 (e.g., reservations)
  ├── {entity3}/{doc}             ← Sector entity 3 (e.g., rooms)
  └── staff/{doc}                 ← Staff accounts (uid-keyed)
```

### Firestore CRUD Pattern (mandatory in every app)

```js
// Generic CRUD — works for ALL collections
let _fsQueue = Promise.resolve();
function fsOp(fn, timeoutMs = 15000) {
  const p = _fsQueue.then(() => {
    const result = fn();
    if (result && typeof result.then === 'function') {
      return Promise.race([result, new Promise((_, rej) =>
        setTimeout(() => rej(new Error('Firestore timeout')), timeoutMs)
      )]);
    }
    return result;
  });
  _fsQueue = p.catch(() => {});
  return p;
}

async function ld(col) {
  const sn = await fsOp(() => db.collection('tenants').doc(S.tid).collection(col).get());
  return sn.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function svDoc(col, id, data) {
  if (id) {
    await fsOp(() => db.collection('tenants').doc(S.tid).collection(col).doc(id).set(data, { merge: true }));
    return id;
  }
  data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  const r = await fsOp(() => db.collection('tenants').doc(S.tid).collection(col).add(data));
  return r.id;
}

async function delDoc(col, id) {
  await fsOp(() => db.collection('tenants').doc(S.tid).collection(col).doc(id).delete());
}
```

---

## Step 3: Generate — Build the Application

### File Structure

Generate exactly **2 files**:
1. `{appname}.html` — The complete SaaS application (landing + app + admin)
2. `portal-{appname}.html` — Client/patient/student self-registration portal (QR target)

Both files must be saved to `/home/z/my-project/download/`.

### Mandatory Architecture (EVERY app must have this)

Every generated HTML file follows this exact structure:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>{AppName} — {Tagline}</title>
  <meta name="description" content="{Description}">
  <meta name="theme-color" content="#000000">
  <!-- PWA -->
  <link rel="manifest" href="manifest.json">
  <!-- Firebase Compat SDK (CDN) -->
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-storage-compat.js"></script>
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
  <!-- QR Code -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
  <!-- jsPDF -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <!-- SheetJS (Excel export) -->
  <script src="https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js"></script>
  <!-- EmailJS -->
  <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <style>
    /* CSS — See references/ui-patterns.md for the complete style system */
  </style>
</head>
<body>
  <!-- 4 top-level sections -->
  <div id="PLOAD">Loading spinner</div>
  <div id="PL" class="hd">Landing/Sales page</div>
  <div id="PA" class="hd">Auth (login/register)</div>
  <div id="PS" class="hd">App Shell (sidebar + main content)</div>

  <script>
    // Complete JS application
  </script>
</body>
</html>
```

### Landing Page Sections (MANDATORY)

Every landing page must include these sections in order:

1. **Hero** — App name, tagline, CTA button ("Essayez gratuitement")
2. **Probleme** — Pain points the app solves (3 cards)
3. **Solution** — Feature overview (6 features in grid)
4. **Comment ca marche** — 3-step process
5. **Tarifs** — 3 pricing tiers with feature comparison
6. **FAQ** — 5-6 common questions
7. **CTA final** — Last call to action
8. **Footer** — Links, contact, legal

### App Shell (MANDATORY)

The authenticated app must include:

- **Sidebar navigation** with icons (collapsible on mobile)
- **Bottom navigation** on mobile (5 most important views)
- **Main content area** that dynamically renders views
- **User menu** (profile, plan, theme toggle, logout)

### Views per Sector (customizable)

Every app gets these **standard views** plus sector-specific ones:

| Standard View | Description | Icon |
|---------------|-------------|------|
| Dashboard | KPIs + charts + quick actions | chart |
| {Entity1} | Main sector entity list + CRUD | sector-specific |
| {Entity2} | Second entity list + CRUD | sector-specific |
| {Entity3} | Third entity list + CRUD | sector-specific |
| Rapports | Financial + operational reports | file-text |
| WhatsApp | Template messages + reminders | message-circle |
| Parametres | Settings, EmailJS, theme, export | settings |

### Theme System (MANDATORY)

Include the dual-layer theme system from ResidencePro:

**Layer 1: Dark/Light mode** via CSS variables on `:root` and `body.light`
**Layer 2: 12 color accent themes** (gold, emerald, sapphire, ruby, amethyst, sunset, ocean, rose, neon, forest, royal, candy)

```css
:root {
  --bg:#0a0a0f; --b2:#111118; --b3:#1a1a24; --cd:rgba(26,26,36,.88);
  --tx:#f0ece2; --t2:#9a9aad; --t3:#5a5a6e;
  --gd:#D4AF37; --gd2:#E5B55A; --gd3:#C8973A;
}
body.light {
  --bg:#f8fafc; --b2:#ffffff; --b3:#f1f5f9; --cd:rgba(255,255,255,.95);
  --tx:#1e293b; --t2:#64748b; --t3:#94a3b8;
}
```

### Authentication Flow (MANDATORY)

```
Landing → Auth (login/register) → Onboarding wizard → App
                                  ↓
                            Trial system (7 days)
                                  ↓
                     Trial expired → Pricing overlay → WhatsApp payment
```

### Onboarding Wizard (3 steps)

1. **Business info** — Name, city, address, phone
2. **Configuration** — Add initial data (rooms, services, etc.)
3. **Done** — Seed demo data, redirect to dashboard

### Seed/Demo Data (MANDATORY)

On first registration, seed realistic demo data so the app looks alive:
- 8-10 items per entity
- Realistic African names and phone numbers (format: +225 XX XX XX XX)
- Varied statuses (active, pending, completed)
- Demo dashboard charts showing meaningful data

### WhatsApp Integration (MANDATORY for African market)

Include:
- Pre-built message templates with `{{VARIABLE}}` placeholders
- One-click send via `wa.me/{phone}?text={encodedMessage}`
- Bulk reminder engine (overdue payments, upcoming appointments, etc.)
- Payment contact button on pricing page

### PDF Generation (MANDATORY)

Using jsPDF, generate sector-specific documents:
- Contracts / agreements
- Invoices / receipts
- Certificates / attestations
- Reports

Each PDF includes: branded header (logo + app name), content, footer with date + page number.

### Excel Export (MANDATORY)

Using SheetJS, allow export of any entity list to `.xlsx` with proper column headers and formatting.

---

## Step 4: Configure — Firebase Setup Instructions

After generating the code, provide the user with clear setup instructions:

1. **Create Firebase project** at console.firebase.google.com
2. **Enable Authentication** → Email/Password + Anonymous
3. **Create Firestore database** → Start in test mode
4. **Enable Storage** → Start in test mode
5. **Copy config** → Replace in the HTML file
6. **Deploy Firestore rules** (provide the rules)
7. **Deploy Storage rules** (provide the rules)
8. **EmailJS setup** (if email notifications needed)
9. **Deploy** → Upload to hosting (Hostinger, Netlify, etc.)

### Firestore Rules Template

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tenants/{tenantId} {
      allow read: if true;
      allow write: if request.auth != null;
      match /{subcol}/{doc} {
        allow read, write: if request.auth != null;
      }
    }
    match /users/{userId} {
      allow read, write: if request.auth != null;
      match /trial/{doc} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

### Storage Rules Template

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tenants/{tenantId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## Step 5: Deliver

Save generated files to `/home/z/my-project/download/`:
- `{appname}.html` — Main application
- `portal-{appname}.html` — Self-registration portal
- `manifest.json` — PWA manifest (if requested)
- `sw.js` — Service worker (if requested)

Report to user:
- File paths and sizes
- Firebase setup instructions
- Deployment steps

---

## Sector Templates

See `references/sectors.md` for pre-built templates covering:

| Sector | Template Name | Core Entities |
|--------|--------------|---------------|
| Hotel / Residence | HotelPro | Clients, Chambres, Reservations, Paiements |
| Restaurant | RestoPro | Clients, Tables, Commandes, Menu, Paiements |
| Clinique / Sante | CliniPro | Patients, Dossiers, Consultations, Rendez-vous |
| Ecole / Formation | EcolePro | Eleves, Classes, Notes, Presences, Paiements |
| Salon / Beauté | SalonPro | Clients, Services, Rendez-vous, Paiements |
| Salle de sport | GymPro | Membres, Abonnements, Seances, Paiements |
| Logistique / Transport | LogisPro | Clients, Vehicules, Expeditions, Livraisons |
| Boutique / Commerce | ShopPro | Clients, Produits, Commandes, Stocks, Ventes |
| Immobilier | ImmoPro | Clients, Biens, Visites, Contrats, Paiements |
| événementiel | EventPro | Clients, Evenements, Prestataires, Reservations |

Each template defines: entities, fields, views, pricing, business rules, and demo data.

---

## Code Quality Rules

1. **NEVER delete working features** — Only add or modify
2. **All operations must have timeouts** — Use `fsOp()` with 15s timeout
3. **Firebase Storage uploads must have fallback** — Base64 in Firestore if upload fails
4. **Progressive enhancement** — App must work even if Storage/EmailJS is not configured
5. **Mobile-first responsive** — Sidebar collapses to bottom nav on mobile
6. **No external API dependencies** — Only Firebase CDN + utility libraries
7. **Single-file architecture** — Everything in one HTML, no separate CSS/JS files
8. **French by default** — All UI text in French unless user specifies otherwise
9. **FCFA currency** — Default currency unless user specifies otherwise
10. **WhatsApp-first communication** — Email is optional, WhatsApp is mandatory

---

## Critical Anti-Patterns (NEVER DO THESE)

- ❌ Using React/Vue/Angular frameworks — Must be vanilla JS
- ❌ Using Firebase Modular SDK — Must use Compat SDK for single-file compat
- ❌ Enabling Firestore persistence — Causes `INTERNAL ASSERTION FAILED` errors
- ❌ Hardcoding admin emails without user consent
- ❌ Generating Stripe/payment gateway integration without user request — Use WhatsApp for African market
- ❌ Creating separate JS/CSS files — Must be single HTML file
- ❌ Using `async/await` without try/catch on Firebase operations
- ❌ Rendering charts without loading Chart.js first
- ❌ Forgetting to handle `null` auth state on page refresh
