---
name: smart-home-platform
description: "Build premium smart home e-commerce platforms like VORA — complete Next.js 16 web applications with product catalog, pack/bundle system, admin dashboard, IoT device control, Firebase auth, and African market features (FCFA pricing, Orange Money/Wave/MTN payments, WhatsApp integration). Use this skill whenever the user wants to create a smart home store, IoT e-commerce platform, connected home shop, domotics marketplace, or any premium product catalog with IoT features. Triggers on: 'smart home platform', 'smart home store', 'IoT e-commerce', 'connected home shop', 'platforme domotique', 'maison connectee', 'plateforme IoT', 'site comme VORA', 'site e-commerce domotique', 'build a VORA-like site', 'smart home marketplace'. ALWAYS use this skill when building smart home or IoT product platforms with admin dashboards and product management."
---

# Smart Home Platform Builder

## Overview

This skill generates **complete, production-ready smart home e-commerce platforms** built with Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Firebase, and Framer Motion. The architecture is proven in production (VORA Smart Home, Cote d'Ivoire) and follows a premium design pattern with glassmorphism, 3D animations, and African market optimization.

The goal is to deliver a **fully functional platform**, not a prototype. Every generated site includes: dynamic SPA routing, premium landing page with carousel + animations, product catalog with variants/bundles, pack system, shopping cart with promo codes, multi-step checkout with mobile money, Firebase authentication, massive admin dashboard, IoT device control panel, blog, FAQ, support, PWA support, and WhatsApp integration.

## When to Use This Skill

Use whenever the user wants to create:
- A smart home / IoT product e-commerce platform
- A connected home store with device management
- A domotics marketplace with pack/bundle system
- A premium product catalog with IoT dashboard features
- An African-market e-commerce platform for tech products
- Any "VORA-like" smart home platform

## Generation Workflow

```
1. INTERVIEW    → Gather brand, products, market, features, branding
2. PLAN         → Define data model, pages, store architecture, components
3. INITIALIZE   → Set up Next.js project via fullstack-dev skill
4. SCAFFOLD     → Create directory structure, stores, types, mock data
5. BUILD        → Generate components (landing, shop, admin, IoT, pages)
6. STYLE        → Apply premium CSS animations, glassmorphism, themes
7. CONFIGURE    → Set up Firebase, PWA, SEO metadata
8. VERIFY       → Test with Agent Browser, fix issues
9. DELIVER      → Report completion, provide deployment instructions
```

---

## Step 1: Interview — Capture Requirements

Ask the user for these details (adapt language to user):

| Question | Example | Default if not provided |
|----------|---------|------------------------|
| **Platform name** | "VORA", "SmartHome CI", "DomoTech" | "SmartHome" + country code |
| **Tagline** | "Votre maison intelligente, simplifiee" | "La maison connectee a portee de main" |
| **Target country** | Cote d'Ivoire, Senegal, Cameroon, etc. | Cote d'Ivoire |
| **Currency** | FCFA, USD, EUR | FCFA |
| **Core products** | Cameras, bulbs, thermostats, sensors, locks | 12 smart home products |
| **Pack types** | Studio, Chambre, Bureau, 2 Pieces, 3 Pieces | 5 packs (studio → 3 pieces) |
| **Payment methods** | Orange Money, MTN, Wave, Visa, PayPal | All African mobile money + cards |
| **Shipping** | Free in capital, 2000 FCFA elsewhere | Free in main city, flat rate elsewhere |
| **Language** | French, English, bilingual | French |
| **Admin email** | For super-admin access | Ask user |
| **WhatsApp number** | For customer support | Ask user |
| **Brand colors** | Primary navy, secondary blue, accent cyan | Navy #071E5A, Blue #0066FF, Cyan #00D4FF |
| **Firebase config** | apiKey, projectId | Provide setup instructions |
| **Domain** | vora-africa.com | Provide Vercel deployment |
| **Logo** | File path or description | Generate with AI image tool |

If the user just says "create a smart home platform", use defaults for everything else and proceed.

---

## Step 2: Plan — Data Model & Architecture

### Core Data Entities

```
Products:        id, name, slug, category, price, promoPrice, images[], variants[],
                 features[], specifications[], bundles[], description, shortDescription,
                 rating, reviewCount, inStock, isNew, isFeatured

Packs:           id, name, description, price, originalPrice, image, items[],
                 features[], savings, popular

Orders:          id, clientName, clientEmail, clientPhone, items[], total,
                 shippingAddress, shippingMethod, paymentMethod, status, createdAt

Clients:         id, name, email, phone, address, city, orders[], totalSpent, status

CarouselSlides:  id, title, subtitle, image, ctaText, ctaLink, order, active

FlashAnnouncements: id, text, type (info/promo/urgent), active, order

PromoCodes:      id, code, discount, type (percentage/fixed), minOrder, maxUses,
                 usedCount, expiresAt, active

BlogPosts:       id, title, slug, excerpt, content, image, author, category, tags[],
                 published, createdAt

IoTDevices:      id, name, type, room, status, value, icon, controllable

Rooms:           id, name, devices[], icon

ContactSettings: phone, email, whatsapp, address, socialMedia{}

SiteSettings:    key-value pairs for configurable site settings
```

### Page Architecture (SPA via Zustand)

The entire site runs as a single-page application using Zustand for client-side routing. All pages are rendered through a single `page.tsx` with a switch statement.

```
Page IDs:
  home, shop, shop-product, packs, cart, checkout,
  login, register, dashboard, iot,
  about, support, contact, blog, faq, devis,
  admin-overview, admin-clients, admin-orders, admin-products,
  admin-packs, admin-stock, admin-invoices, admin-quotes,
  admin-sav, admin-technicians, admin-blog, admin-marketing,
  admin-carousel, admin-flash, admin-settings, admin-profile
```

### Store Architecture (Zustand + localStorage persistence)

```
navigation-store  → currentPage, selectedProductId, navigate(page, productId?)
auth-store        → user, isAdmin, loading, error, login(), register(), logout()
product-store     → products[], promoCodes[], CRUD operations, version + migration
cart-store        → items[], wishlist[], add/remove/update/total
```

---

## Step 3: Initialize — Project Setup

1. Invoke the `fullstack-dev` skill to initialize the Next.js project
2. Install additional dependencies:

```bash
bun add zustand firebase framer-motion recharts next-cloudinary
     next-themes sonner date-fns uuid @dnd-kit/core @dnd-kit/sortable
     react-hook-form @hookform/resolvers zod
```

3. Set up shadcn/ui components (these should already exist from fullstack-dev):
   - button, card, input, label, select, dialog, sheet, tabs, badge,
   - avatar, dropdown-menu, accordion, separator, toast, slider,
   - checkbox, radio-group, textarea, table, chart, popover, command

---

## Step 4: Scaffold — Directory Structure & Files

Create this directory structure:

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, ThemeProvider, PWA)
│   ├── page.tsx                # SPA entry point → PageRenderer
│   ├── globals.css             # Full CSS: variables, animations, utilities
│   └── api/                    # API routes if needed
│
├── components/
│   ├── ui/                     # shadcn/ui components (pre-existing)
│   └── {brand}/                # All custom components (use platform name)
│       ├── shared/             # Header, Footer, InfoBar, WhatsAppButton
│       ├── landing/            # Hero, Features, Products, Packs, Why, Testimonials, FAQ, Newsletter
│       ├── shop/               # ShopPage, ProductDetailPage, CartPage, CheckoutPage
│       ├── auth/               # LoginPage, RegisterPage
│       ├── dashboard/          # AdminDashboard (massive multi-section component)
│       ├── iot/                # IotDashboard
│       └── pages/              # About, Blog, Contact, Devis, FAQ, Support
│
├── store/
│   ├── navigation-store.ts     # SPA router
│   ├── auth-store.ts           # Firebase auth
│   ├── product-store.ts        # Product CRUD + variants/bundles/promo
│   └── cart-store.ts           # Cart + wishlist
│
├── data/
│   └── mock-data.ts            # All static data + TypeScript interfaces
│
├── hooks/
│   ├── use-mobile.ts           # Mobile breakpoint detection
│   ├── use-scroll-animation.ts # Intersection Observer animations
│   └── use-toast.ts            # Toast notification system
│
├── lib/
│   ├── firebase.ts             # Firebase init
│   ├── utils.ts                # cn() utility
│   └── db.ts                   # Prisma client (if using database)
│
public/
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker
├── robots.txt                  # SEO
├── logo.svg                    # SVG logo
└── images/                     # Product/pack/brand images
```

---

## Step 5: Build — Component Generation

### 5.1 PageRenderer (page.tsx)

The core SPA router. Read `currentPage` from navigation store, render the matching component via switch statement. Wrap in `AnimatePresence` for page transitions.

Key rules:
- Header/Footer hidden on: dashboard, iot, login, register pages
- Firebase auth initialized on mount
- Scroll to top on page change
- `AnimatePresence` with fade + slide transitions

### 5.2 Shared Components

**Header.tsx** — Fixed navigation bar:
- Logo (from localStorage for admin customizability)
- Desktop nav with dropdown menus
- Search, theme toggle, user menu, wishlist, cart with count badge
- Mobile slide-out menu with hamburger toggle
- Transparent on home, solid on other pages

**Footer.tsx** — Full footer:
- Newsletter signup
- 4-column grid: brand+social, navigation, categories, contact
- Payment method badges (Orange Money, MTN, Wave, Visa, MasterCard)
- Bottom legal links

**InfoBar.tsx** — Top announcement bar:
- Rotating flash announcements (4s interval)
- Contact info, WhatsApp button
- Reads announcements from localStorage (admin-editable)

**WhatsAppButton.tsx** — Floating button:
- Bottom-right fixed position
- Expandable chat card with pre-filled message
- Pulse animation

### 5.3 Landing Page Sections (8 sections, all premium animated)

**1. HeroSection** (~600 lines) — Full-viewport hero:
- Auto-rotating carousel (5s interval) with admin-editable slides
- Typewriter title effect
- Mouse-follow radial gradient light
- Floating decorative particles
- Parallax scrolling on background
- Animated stats counter (clients, products, installations, satisfaction)
- Trust badges row
- Glassmorphism CTA buttons

**2. FeaturesSection** (~200 lines) — 4 feature cards:
- 3D tilt effect on mouse move (card-tilt CSS class)
- Animated stat counters per feature
- Shimmer hover effect
- Parallax background
- Icons: Security, Energy, Installation, Remote Control

**3. ProductsSection** (~200 lines) — Horizontal scrollable product carousel:
- First 6 featured products from product store
- Star ratings with fill animation
- Wishlist heart toggle with animation
- Add to cart with bounce animation
- "Voir le produit" link to detail page

**4. PacksSection** (~200 lines) — Pack grid:
- 5 packs (Studio → 3 Pieces) with color-coded cards
- Animated prices (count up on scroll)
- Savings badges
- Shimmer hover effect
- "Commander" CTA buttons

**5. WhyVoraSection** (~270 lines) — Two-part section:
- "Why Choose Us" with 4 benefit cards
- "Professional Installation" with 4-step process
- Glass cards, dashed connectors, rotating ring decorations

**6. TestimonialsSection** (~220 lines) — Customer testimonials:
- 3 testimonial cards with 3D tilt
- Auto-rotating active highlight (4s)
- Star fill animations
- Partner ecosystem compatibility badges

**7. FAQSection** (~130 lines) — Accordion FAQ:
- 8 FAQ items with smooth height animation
- Numbered badges
- Support CTA at bottom

**8. NewsletterSection** (~180 lines) — Email subscription:
- Magnetic button effect
- Input glow on focus
- Success confetti animation
- Rotating decorative rings

### 5.4 Shop Components

**ShopPage.tsx** (~560 lines):
- Sidebar filters (categories, price range slider)
- Grid/list view toggle
- Sort options (price, name, newest, popular)
- Search bar
- Mobile filter sheet (bottom sheet)
- Promo code banner
- Product cards with quick actions

**ProductDetailPage.tsx** (~920 lines) — Shopify-like product page:
- Image gallery with zoom on hover
- Thumbnail strip navigation
- Variant selector (color, size, type)
- Quantity picker with +/- buttons
- Add to cart / Buy now buttons
- Promo code input with validation
- Bundle offers section
- Delivery info (free in main city, flat rate elsewhere)
- Features grid (4 columns)
- Specifications table
- Related products carousel

**CartPage.tsx** (~210 lines):
- Item list with image, name, variant, price
- Quantity controls (+/-)
- Remove item with animation
- Promo code input + apply
- Order summary (subtotal, shipping, TVA 18%)
- Empty state with CTA

**CheckoutPage.tsx** (~710 lines) — Multi-step checkout:
- Step 1: Shipping address (with city auto-detect for free shipping)
- Step 2: Shipping method selection
- Step 3: Payment (Orange Money, MTN Mobile Money, Wave, Visa, MasterCard, PayPal)
- Step 4: Order confirmation with summary
- Form validation with Zod
- Progress stepper UI

### 5.5 Auth Components

**LoginPage.tsx** (~240 lines):
- Split-screen layout: left brand panel with animated particles, right form
- Email/password fields
- Register page toggle
- Forgot password flow
- Firebase auth integration

**RegisterPage.tsx** (~160 lines):
- Similar split-screen with name, email, phone, password, confirm password
- Terms checkbox
- Firebase auth + Firestore user creation

### 5.6 Admin Dashboard

**AdminDashboard.tsx** (~5000 lines) — The massive admin panel:

This is the largest component. It contains 16+ sub-sections, each defined as a local function component within the main component. Use a sidebar navigation pattern:

**Sections:**
1. **Overview** — KPI cards (revenue, orders, clients, products sold, open tickets), revenue line chart (Recharts), category pie chart, alerts panel, recent orders table
2. **Clients** — Client list with search/filter, CRUD modal, CSV export, relance SMS/email actions
3. **Orders** — Order list with status filters, detail modal, status update, invoice generation
4. **Products** — 6-tab product editor: General (name, category, price, description), Images (upload, reorder, primary), Variants (add/edit/delete with price modifier), Features (key-value pairs), Specifications (table), Bundles (cross-sell with discount)
5. **Packs** — Pack CRUD with composition editor, pricing, image, features
6. **Stock** — Inventory management, stock alerts, low-stock indicators
7. **Invoices** — Invoice list, generation, PDF export
8. **Quotes (Devis)** — Quote request management
9. **SAV** — Support ticket management, status workflow
10. **Technicians** — Technician assignment, schedule
11. **Blog** — Blog post CRUD with rich text, categories, tags
12. **Marketing** — Newsletter campaigns, affiliate tracking, push notifications, SMS campaigns, tracking pixels
13. **Carousel** — Hero carousel slide CRUD (add, edit, reorder, toggle active)
14. **Flash Announcements** — Scrolling announcement management (text, type, active toggle)
15. **Settings** — Contact info, WhatsApp number, social media, site settings
16. **Profile** — Admin profile management

**Admin Dashboard UI pattern:**
- Left sidebar with icon + label navigation (collapsible on mobile)
- Top bar with search, notifications, user menu
- Main content area that switches based on selected section
- Modal dialogs for create/edit operations
- All data persisted via localStorage (upgrade to Firestore/Prisma later)

### 5.7 IoT Dashboard

**IotDashboard.tsx** (~390 lines):
- Quick scene buttons (Night, Away, Cinema, Eco) with icons
- Room grid with device counts and status
- Device control list: toggle switches, brightness/temperature sliders
- Energy consumption ring chart (Recharts)
- Security status panel (camera feeds placeholder, alarm status)
- All device state managed in localStorage

### 5.8 Static Pages

**AboutPage.tsx** — Mission, values (4 cards), team section, CTA
**BlogPage.tsx** — Featured post hero, blog grid (6 posts)
**ContactPage.tsx** — Contact cards + contact form
**DevisPage.tsx** — Quote request form (name, email, phone, project type, surface, rooms, budget, services, description)
**FAQPage.tsx** — Search bar + accordion FAQ
**SupportPage.tsx** — Help category cards + support form + FAQ links

---

## Step 6: Style — Premium CSS & Animations

The CSS system is critical for the premium feel. Generate `globals.css` with these sections:

### CSS Variables (oklch color space)

```css
:root {
  --primary: oklch(0.25 0.08 260);       /* Navy */
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.55 0.2 255);      /* Blue */
  --secondary-foreground: oklch(0.98 0 0);
  --accent: oklch(0.75 0.15 195);         /* Cyan */
  --accent-foreground: oklch(0.15 0.08 260);
  --background: oklch(0.98 0.002 260);    /* Light */
  --foreground: oklch(0.15 0.08 260);
  --card: oklch(1 0 0);
  --muted: oklch(0.96 0.005 260);
  --border: oklch(0.9 0.01 260);
  --destructive: oklch(0.55 0.2 25);
  --ring: oklch(0.55 0.2 255);
  --radius: 0.75rem;
}

.dark {
  --background: oklch(0.13 0.02 260);
  --foreground: oklch(0.95 0 0);
  --card: oklch(0.18 0.02 260);
  --muted: oklch(0.22 0.02 260);
  --border: oklch(0.25 0.02 260);
}
```

### Brand Color Utilities

```css
.vora-gradient { background: linear-gradient(135deg, var(--primary), var(--secondary)); }
.vora-gradient-cyan { background: linear-gradient(135deg, var(--secondary), var(--accent)); }
.text-vora-gradient { background: linear-gradient(135deg, var(--secondary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
```

### Glassmorphism Utilities

```css
.glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.12); }
.glass-dark { background: rgba(0,0,0,0.3); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
.glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; }
```

### 25+ Animation Keyframes

Generate these essential animations (see `references/animations-catalog.md` for full code):

| Animation | Purpose | Duration |
|-----------|---------|----------|
| fade-up | Scroll reveal elements | 0.6s |
| fade-left / fade-right | Slide in from sides | 0.6s |
| scale-in | Pop in effect | 0.5s |
| blur-in | Focus reveal | 0.6s |
| float / float-slow / float-diagonal | Floating decorative elements | 3-6s infinite |
| pulse-glow | Glowing accent elements | 2s infinite |
| pulse-ring | Expanding ring effect | 2s infinite |
| shimmer | Loading/card shimmer | 2s infinite |
| gradient-x | Moving gradient | 3s infinite |
| hero-gradient | Hero background shift | 8s infinite |
| slide-up | Slide from bottom | 0.5s |
| bounce-subtle | Gentle bounce | 0.6s |
| typewriter-cursor | Blinking cursor | 1s step-end infinite |
| whatsapp-pulse | WhatsApp button pulse | 2s infinite |
| marquee | Scrolling announcements | 20s linear infinite |
| cart-bounce | Cart add feedback | 0.4s |
| glow-pulse | Button glow | 2s infinite |
| gradient-shift | Background gradient shift | 4s infinite |
| rotate-slow | Slow rotation (decorations) | 20s linear infinite |
| confetti-burst | Success celebration | 1s |
| success-pop | Success feedback | 0.5s |
| star-fill | Star rating fill | 0.3s |
| input-glow | Input focus glow | 0.3s |
| faq-active-pulse | Active FAQ item | 2s infinite |

### Hover Effects

```css
.hover-lift { transition: all 0.3s; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }

.card-tilt { transition: transform 0.3s; transform-style: preserve-3d; perspective: 1000px; }
.card-tilt:hover { transform: rotateY(5deg) rotateX(5deg); }

.magnetic-hover { transition: transform 0.2s; }
.magnetic-hover:hover { transform: scale(1.05); }
.magnetic-hover:active { transform: scale(0.97); }

.glow-border-hover { position: relative; }
.glow-border-hover::after { content: ''; position: absolute; inset: -2px; background: linear-gradient(135deg, var(--secondary), var(--accent)); border-radius: inherit; z-index: -1; opacity: 0; transition: opacity 0.3s; }
.glow-border-hover:hover::after { opacity: 1; }
```

### Scroll Reveal System

```css
.reveal-hidden { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.4,0,0.2,1); }
.reveal-visible { opacity: 1; transform: translateY(0); }
```

Use `use-scroll-animation.ts` hook (Intersection Observer) to toggle these classes on scroll.

---

## Step 7: Configure — Firebase, PWA, SEO

### Firebase Setup

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### PWA Manifest (public/manifest.json)

```json
{
  "name": "{PlatformName}",
  "short_name": "{ShortName}",
  "description": "{Tagline}",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#071E5A",
  "theme_color": "#0066FF",
  "icons": [
    { "src": "/images/logo-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/images/logo-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Layout.tsx SEO

```typescript
export const metadata: Metadata = {
  title: '{PlatformName} — {Tagline}',
  description: '{Description}',
  manifest: '/manifest.json',
  openGraph: {
    title: '{PlatformName}',
    description: '{Tagline}',
    url: 'https://{domain}',
    siteName: '{PlatformName}',
    type: 'website',
  },
};
```

### Service Worker (public/sw.js)

Generate a cache-first service worker for offline support. Cache static assets, API responses, and images.

---

## Step 8: Verify — Testing & Fixes

After generating all components:

1. Run `bun run lint` to check for TypeScript/ESLint errors
2. Check `/home/z/my-project/dev.log` for runtime errors
3. Use Agent Browser to verify:
   - Landing page loads with all animations
   - Navigation between pages works (SPA routing)
   - Product catalog displays with images
   - Product detail page with variant selection
   - Cart add/remove works
   - Checkout flow completes
   - Admin dashboard loads with all sections
   - Login/Register forms work with Firebase
   - Mobile responsive layout
   - Dark/Light mode toggle
4. Fix any issues found during verification

---

## Step 9: Deliver

Report to user:
- Platform URL (preview link)
- File structure summary
- Key features implemented
- Firebase setup instructions (if not pre-configured)
- Deployment instructions (Vercel via GitHub)
- Admin access credentials
- Customization guide (how to modify products, packs, carousel, etc.)

---

## Critical Architecture Rules

### SPA Router Pattern (MANDATORY)

The entire site uses Zustand for client-side routing, NOT Next.js file-system routing. All pages render through a single `page.tsx` with a switch statement. This is intentional and must be preserved — it enables smooth animated transitions and shared state.

```typescript
// navigation-store.ts
type PageId = 'home' | 'shop' | 'shop-product' | 'packs' | 'cart' | 'checkout' | ...;
interface NavigationStore {
  currentPage: PageId;
  selectedProductId: string | null;
  navigate: (page: PageId, productId?: string) => void;
}
```

### Product Store with Migration (MANDATORY)

Products are managed via Zustand with localStorage persistence. Include version number and migration function for backward compatibility:

```typescript
// product-store.ts
interface ProductStore {
  products: Product[];
  promoCodes: PromoCode[];
  version: number;
  // CRUD methods...
}

// In persist middleware:
persist(
  (state) => ({ ...state, version: 1 }),
  {
    name: '{brand}-products',
    version: 1,
    migrate: (persistedState: any, version: number) => {
      // Migration logic for adding new fields
      return migrateProducts(persistedState);
    }
  }
)
```

### Admin-Editable Content (MANDATORY)

These elements must be editable from the admin dashboard and persist in localStorage:
- Carousel slides (HeroSection)
- Flash announcements (InfoBar)
- Contact info and WhatsApp number
- Logo
- Products, packs, promo codes

### African Market Requirements (MANDATORY for African target)

- **Currency**: FCFA (West African CFA franc)
- **Price formatting**: "X FCFA" or "XK FCFA" for compact display
- **Payment methods**: Orange Money, MTN Mobile Money, Wave, Visa, MasterCard, PayPal
- **Phone format**: +225 XX XX XX XX (Cote d'Ivoire), adapt for other countries
- **Shipping**: Free in capital/main city, flat rate elsewhere (e.g., 2,000 FCFA)
- **TVA**: 18% (applied at checkout)
- **WhatsApp**: Primary communication channel, mandatory floating button
- **Language**: French by default, bilingual option

### Radix UI / shadcn Rules (CRITICAL)

- NEVER use `SelectItem` with `value=""` (empty string) — Radix UI forbids this. Use `value="none"` with conversion logic instead.
- NEVER use `value={undefined}` or `value={null}` in Select components — always use string values.
- When a field is optional, use a sentinel value like `"none"` and convert: `v === 'none' ? undefined : v`

### Animation Performance (IMPORTANT)

- Use CSS transforms and opacity for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` directly
- Use `will-change` sparingly on animated elements
- Framer Motion for complex orchestrated animations only
- CSS keyframes for simple repeating animations
- `Intersection Observer` for scroll-triggered animations (not scroll event listeners)

### Component Size Management

The AdminDashboard will be very large (3000-5000+ lines). This is acceptable because:
- It's a single component with local function sub-components
- Each sub-section is clearly separated with comments
- It avoids prop drilling and context complexity
- Alternative: If file becomes too large, split into `admin/` directory with separate section components, but keep the pattern of one main dashboard with sidebar + content area

---

## Customization by Sector

While this skill is optimized for smart home platforms, it can be adapted for:

| Sector | Product Examples | Pack Examples | IoT Features |
|--------|-----------------|---------------|--------------|
| Smart Home | Cameras, bulbs, sensors, locks | Studio, Chambre, Bureau packs | Full IoT dashboard |
| Solar Energy | Solar panels, batteries, inverters | Residential, Commercial kits | Energy monitoring |
| Security | Cameras, alarms, access control | Home, Business, Enterprise | Camera feeds, alerts |
| Home Automation | Smart switches, thermostats, blinds | Room, Floor, House packs | Device control dashboard |
| Office Tech | Printers, network, video conferencing | Startup, SME, Enterprise | Network monitoring |

When adapting, modify the product catalog, pack compositions, and IoT dashboard accordingly. The core architecture (SPA routing, Zustand stores, admin dashboard, premium animations) stays the same.

---

## Deployment Checklist

Before going live, ensure:

1. [ ] Firebase project created and configured
2. [ ] Firebase Auth enabled (Email/Password)
3. [ ] Firestore rules deployed
4. [ ] Admin email configured in auth-store
5. [ ] WhatsApp number set in contact settings
6. [ ] Logo and favicon generated and placed in public/
7. [ ] Product images uploaded to Cloudinary or public/images/
8. [ ] PWA manifest icons generated (192x192, 512x512)
9. [ ] Service worker tested offline
10. [ ] Domain configured on Vercel
11. [ ] Environment variables set in Vercel dashboard
12. [ ] SEO meta tags verified
13. [ ] Mobile responsiveness tested
14. [ ] All payment methods configured
15. [ ] Shipping rules correct (free in main city, flat rate elsewhere)

---

## References

- `references/animations-catalog.md` — Complete CSS animation code for all 25+ keyframes
- `references/admin-sections.md` — Detailed spec for each admin dashboard section
- `references/african-payments.md` — Payment integration patterns for Orange Money, MTN, Wave
- `references/checkout-flow.md` — Multi-step checkout implementation details
