# Puncto - Complete Management Platform

A comprehensive multi-tenant SaaS platform for service-based and food establishments, offering scheduling, automated confirmations, payments, restaurant management, time tracking, and full ERP capabilities.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🌟 Overview

Puncto simplifies daily operations for small and medium businesses in beauty, aesthetics, restaurants, and food services, transforming empty time slots into revenue and building loyal customer relationships through accessible, integrated technology.

### Key Value Propositions

- ✅ **Smart Scheduling** - 24/7 booking with intelligent confirmations and automated waitlist
- 📅 **Personal Calendar Integration** - Automatic sync with Google/Apple/Outlook Calendar
- 📉 **No-Show Reduction** - Multi-channel reminders reduce no-shows from 15-20% to <5%
- 💳 **Integrated Payments** - PIX, credit cards, commission splits via Stripe
- 🍽️ **Digital Menu & Virtual Tabs** - Table ordering with QR codes and real-time updates
- ⏰ **Electronic Time Clock** - Biometric/PIN time tracking with shift management
- 📊 **Unified Management** - Single system for scheduling, sales, inventory, and team
- 🇧🇷 **Brazil-Ready** - Tax invoices (NFS-e/NFC-e), PIX, bank reconciliation, LGPD compliance

---

## 🎯 Target Market

### Phase 1-2 (Initial Focus)
- Beauty salons, barbershops, nail studios
- Aesthetic/dermatology clinics
- Bakeries/confectioneries (custom orders)

### Phase 3-4 (Expansion)
- Restaurants and coffee shops
- General ambulatory clinics
- Event spaces

### Future
- Own delivery platform (Phase 5)

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- **Web:** Next.js 14+ (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand + React Query (TanStack Query)
- **Forms:** React Hook Form + Zod
- **Real-time:** Centrifuge-js client
- **Calendar:** react-add-to-calendar, ics.js
- **Hosting:** Vercel (Edge Functions + ISR)

**Backend:**
- **API:** Next.js API Routes (serverless)
- **Language:** TypeScript
- **Validation:** Zod
- **Documentation:** Swagger/OpenAPI

**Real-time Infrastructure:**
- **Centrifugo Server** (self-hosted on Fly.io)
  - WebSocket protocol
  - Ultra-low latency (<100ms)
  - Pub/Sub for schedules, orders, tabs, time clock
  - JWT authentication via Firebase

**Database & Persistence:**
- **Firestore (Firebase)** - Primary NoSQL database
- **Redis (Upstash)** - Cache, rate limiting, job queues
- **Firebase Storage** - Images and file uploads

**Workers/Jobs:**
- **Cloud Functions (Firebase) 2nd Gen** - Scheduled reminders, webhooks, async processing

**Integrations:**
- **Messaging:** WhatsApp Business Platform (Meta), Email (Resend/Mailgun), SMS (Twilio/Zenvia)
- **Payments:** Stripe (Checkout, Billing, Connect for splits)
- **Calendar:** iCalendar (.ics), Google Calendar API
- **Tax:** TecnoSpeed, eNotas, PlugNotas (Brazilian tax invoices)
- **Printing:** ESC/POS for thermal printers

**Infrastructure:**
- **Hosting:** Vercel (Web), Fly.io (Centrifugo), Firebase (Functions, Auth)
- **CDN:** Vercel CDN + Cloudflare (optional)
- **Monitoring:** Sentry (errors), LogTail/Axiom (logs), Vercel Analytics
- **CI/CD:** GitHub Actions

---

## 🚀 Features by Phase

### Phase 1 — Scheduling + Confirmations (MVP) ✅ **COMPLETED**
**Timeline:** Months 1-3

✅ **Core Features:**
- Multi-tenant architecture with subdomain routing (`{slug}.puncto.app`)
- Service catalog (duration, price, buffer time)
- Professional/room scheduling with blocks, holidays, multiple locations
- Public booking page (responsive PWA)
- Multi-channel reminders (WhatsApp/SMS/email) at T-48h, T-24h, T-3h
- **Personal calendar integration** - Auto-send .ics files, "Add to Calendar" buttons
- Real-time updates via Centrifugo WebSocket
- Basic dashboard: occupancy, no-shows, NPS, CSV export
- Role-based access control (Owner, Manager, Professional, Attendant)
- Automatic waitlist for canceled slots
- LGPD/GDPR compliant

**Tech Deliverables:**
- Vercel + Firebase/Firestore infrastructure
- Centrifugo on Fly.io for WebSocket
- Messaging templates (WhatsApp/email)
- Offline-first PWA with service workers

---

### Phase 2 — Payments + Financial Reports ✅ **COMPLETED**
**Timeline:** Months 4-6

💳 **Payment Features:**
- Payment at booking (PIX, credit/debit cards via Stripe)
- Deposit charges and configurable cancellation policies
- Virtual POS (payment links) with QR codes
- Commission splits for professionals (Stripe Connect)
- Subscriptions and service packages

💰 **Financial Features:**
- Bank reconciliation (OFX/CSV import)
- Financial reports: Simplified P&L, cash flow, defaults
- **SaaS subscription management** (Stripe Billing)
- Accounting integrations (SPED export, API)
- Internal ledger (double-entry bookkeeping)

**Tech Deliverables:**
- Full Stripe integration (Checkout, Payment Links, Billing, Connect)
- Webhooks for automatic reconciliation
- Financial module with internal ledger

---

### Phase 3 — Restaurant Management + Mini-ERP ✅ **COMPLETED**
**Timeline:** Months 7-10

🍽️ **Restaurant/Café Module:**
- Digital menu with categories, photos, allergen info
- QR code per table for instant menu access
- Table ordering via PWA (add to cart, notes per item)
- **Real-time virtual tab** (kitchen + waiter + customer views)
- Order status tracking: pending → preparing → ready → delivered
- Split payments (equal, by item, custom)
- Table management and waitlist
- Thermal printer integration for kitchen orders
- Tip management (percentage or fixed)
- Automatic tax invoice (NFC-e)

📦 **ERP Module:**
- Inventory management (supplies/products, ins/outs, min stock, alerts)
- Purchases and suppliers (quotes, purchase orders, receiving)
- Cost per service/dish (CSP) and suggested pricing
- Brazilian tax compliance (NFS-e/NFC-e by municipality)
- Cost centers and budget targets

⏰ **Electronic Time Clock:**
- Clock in/out with PIN or biometric
- Break tracking (start/end)
- Shift and schedule management
- Time bank and overtime (automatic calculation)
- Geolocation for mobile clock-ins
- Attendance reports (monthly, by employee)
- Payroll export (CSV/Excel)
- eSocial integration preparation

🎯 **CRM & Marketing:**
- Customer history and segmentation
- Loyalty programs (points, cashback)
- Targeted campaigns (email, WhatsApp, push)
- Birthday reminders

**Tech Deliverables:**
- Specialized modules by business type
- Tax integrations (TecnoSpeed/eNotas)
- Kitchen queue system with real-time notifications
- Hardware support (thermal printers, table tablets)
- Geolocation APIs for mobile time clock

---

### Phase 4 — Expansion and Scale ✅ **COMPLETED**
**Timeline:** Months 11-14

🌎 **Scale Features:**
- ✅ Multi-language support (Portuguese, English, Spanish) with next-intl
- ✅ Locale switcher component and message translations
- ✅ Franchise management (create franchise groups, add units, centralized + per-unit views, aggregated metrics)
- ✅ Professional/establishment marketplace (full search, filters, discovery UI with establishment and professional cards)
- ✅ Advanced BI dashboards (customizable dashboard API and widgets)
- ✅ Analytics dashboard with charts and visualizations
- ✅ Public REST API v1 (bookings, services endpoints)
- ✅ GraphQL API (Apollo Server with complete schema)
- ✅ API key management (generation, rotation, expiration tracking)
- ✅ API authentication middleware with rate limiting support
- ✅ White-label for partners (branding customization UI, custom CSS injection, favicon, hide Puncto branding)
- ✅ Webhooks for third-party integrations (registration, management, testing endpoints)

**Tech Deliverables:**
- ✅ next-intl integration for i18n
- ✅ Public REST API with authentication
- ✅ GraphQL API with Apollo Server
- ✅ API key system with secure hashing
- ✅ Webhook registration and management system
- ✅ Customizable dashboard system
- ⚠️ Multi-region architecture (planned)
- ⚠️ Public API SDK (JavaScript/Python - planned)
- ⚠️ Comprehensive API documentation (in progress)
- ✅ API rate limiting and quota support structure

---

### Phase 5 — Own Delivery (Future)
**Timeline:** 15+ months

🚚 **Delivery Features:**
- Integrated delivery system (iFood alternative)
- Real-time driver tracking (GPS)
- Optimized route management
- Driver app (accept/reject orders, navigation)
- Commissions and gamification

**Tech Deliverables:**
- Geolocation module
- Routing algorithms
- Map integrations (Google Maps, OpenStreetMap)

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Firebase account** (Blaze plan for Cloud Functions)
- **Fly.io account** (for Centrifugo hosting)
- **Stripe account** (for payments)
- **Meta Business account** (for WhatsApp Business API)
- **Firebase CLI:** `npm install -g firebase-tools`
- **Wrangler CLI** (if using Cloudflare Workers): `npm install -g wrangler`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourorg/puncto.git
cd puncto
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Firebase Client SDK (from Firebase Console > Project Settings > Web App)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (from Service Account JSON)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Centrifugo (WebSocket server on Fly.io)
NEXT_PUBLIC_CENTRIFUGO_URL=wss://your-app.fly.dev/connection/websocket
CENTRIFUGO_API_KEY=your_centrifugo_api_key
CENTRIFUGO_TOKEN_HMAC_SECRET=your_hmac_secret

# Stripe (Payments & Subscriptions)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# WhatsApp Business Platform (Meta Cloud API)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token

# Email (Resend or Mailgun)
RESEND_API_KEY=re_...
# OR
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=mg.yourdomain.com

# SMS (Optional - Twilio)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**To get Firebase Admin credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Project Settings → Service Accounts
3. Click "Generate new private key"
4. Copy values from downloaded JSON to `.env.local`

### 4. Deploy Firestore Rules & Indexes

```bash
firebase login
firebase use --add  # Select your Firebase project
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Set Up Centrifugo on Fly.io

Create `centrifugo.json` config:

```json
{
  "token_hmac_secret_key": "your_hmac_secret_from_env",
  "api_key": "your_api_key_from_env",
  "admin_password": "your_admin_password",
  "admin_secret": "your_admin_secret",
  "allowed_origins": ["http://localhost:3000", "https://puncto.com.br"],
  "namespaces": [
    {
      "name": "org",
      "publish": true,
      "subscribe_to_publish": true,
      "presence": true,
      "join_leave": true,
      "history_size": 10,
      "history_ttl": "300s"
    }
  ]
}
```

Deploy to Fly.io:

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login and create app
fly auth login
fly launch --name puncto-centrifugo --region gru  # São Paulo region

# Deploy
fly deploy
```

### 6. Seed the Database

Populate Firestore with demo business data:

```bash
npm run seed
```

This creates:
- **1 Demo business** (slug: `demo`)
- **3 Professionals** (with schedules)
- **6 Services** (with pricing and durations)
- **2 Locations** (main + branch)
- **Sample products** (for restaurant demo)

### 7. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 8. Test the Application

**Public booking page:**
```
http://localhost:3000?subdomain=demo
```

**Admin dashboard (Phase 2+):**
```
http://localhost:3000?subdomain=demo/admin
```

**Platform admin (Phase 5):**
```
http://localhost:3000/platform
```

---

## 📁 Project Structure

```
Puncto/
├── src/
│   ├── app/
│   │   ├── tenant/                    # Business subdomain routes
│   │   │   ├── layout.tsx             # Fetches business by slug
│   │   │   ├── page.tsx               # Public booking page
│   │   │   ├── admin/                 # Business dashboard
│   │   │   │   ├── dashboard/         # Analytics & KPIs
│   │   │   │   ├── bookings/          # Appointment management
│   │   │   │   ├── services/          # Service catalog
│   │   │   │   ├── professionals/     # Staff management
│   │   │   │   ├── customers/         # Customer database
│   │   │   │   ├── menu/              # Digital menu (restaurant)
│   │   │   │   ├── orders/            # Order management
│   │   │   │   ├── inventory/         # Stock control
│   │   │   │   ├── time-clock/        # Employee time tracking
│   │   │   │   ├── financial/         # Reports & reconciliation
│   │   │   │   └── settings/          # Business settings
│   │   │   ├── menu/                  # Public digital menu
│   │   │   ├── table/[tableId]/       # Table ordering page
│   │   │   └── my-bookings/           # Customer portal
│   │   ├── platform/                  # Platform admin (superadmin)
│   │   │   ├── businesses/            # All businesses
│   │   │   ├── users/                 # All users
│   │   │   ├── support/               # Support tickets
│   │   │   ├── billing/               # Subscription management
│   │   │   └── analytics/             # Platform metrics
│   │   ├── (marketing)/               # Marketing site (puncto.com.br)
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── pricing/               # Pricing plans
│   │   │   ├── features/              # Feature pages
│   │   │   └── about/                 # About us
│   │   ├── auth/                      # Authentication
│   │   │   ├── login/                 # Login page
│   │   │   ├── signup/                # Business signup
│   │   │   ├── forgot-password/       # Password recovery
│   │   │   └── verify-email/          # Email verification
│   │   └── api/                       # API routes
│   │       ├── bookings/              # Booking endpoints
│   │       ├── payments/              # Stripe webhooks
│   │       ├── webhooks/              # Third-party webhooks
│   │       ├── notifications/         # Send messages
│   │       └── centrifugo/            # WebSocket auth
│   ├── components/
│   │   ├── booking/                   # Booking flow components
│   │   │   ├── ServiceSelector.tsx
│   │   │   ├── ProfessionalSelector.tsx
│   │   │   ├── TimeSlotPicker.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── admin/                     # Admin dashboard components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BookingCalendar.tsx
│   │   │   ├── ServiceForm.tsx
│   │   │   └── AnalyticsDashboard.tsx
│   │   ├── restaurant/                # Restaurant-specific
│   │   │   ├── MenuCard.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── OrderStatusTracker.tsx
│   │   │   └── VirtualTab.tsx
│   │   ├── time-clock/                # Time clock components
│   │   │   ├── ClockInOut.tsx
│   │   │   ├── ShiftSchedule.tsx
│   │   │   └── AttendanceReport.tsx
│   │   ├── shared/                    # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── providers/                 # Context providers
│   │       ├── AuthProvider.tsx
│   │       ├── BusinessProvider.tsx
│   │       └── CentrifugoProvider.tsx
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client.ts              # Client SDK
│   │   │   ├── admin.ts               # Admin SDK
│   │   │   └── auth.ts                # Auth helpers
│   │   ├── centrifugo/
│   │   │   ├── client.ts              # Centrifuge client
│   │   │   └── auth.ts                # JWT generation
│   │   ├── stripe/
│   │   │   ├── client.ts              # Stripe client
│   │   │   ├── webhooks.ts            # Webhook handlers
│   │   │   └── subscriptions.ts       # Subscription logic
│   │   ├── messaging/
│   │   │   ├── whatsapp.ts            # WhatsApp API
│   │   │   ├── email.ts               # Email sender
│   │   │   └── sms.ts                 # SMS sender
│   │   ├── utils/
│   │   │   ├── tenant.ts              # Tenant detection
│   │   │   ├── date.ts                # Date utilities
│   │   │   ├── currency.ts            # Currency formatting
│   │   │   └── slots.ts               # Availability calculation
│   │   └── hooks/
│   │       ├── useAuth.ts             # Auth hook
│   │       ├── useBusiness.ts         # Business context hook
│   │       ├── useRealtime.ts         # Centrifugo hook
│   │       └── useBooking.ts          # Booking flow hook
│   ├── types/
│   │   ├── business.ts                # Business types
│   │   ├── booking.ts                 # Booking types
│   │   ├── user.ts                    # User types
│   │   ├── restaurant.ts              # Restaurant types
│   │   ├── payment.ts                 # Payment types
│   │   ├── timeClocking.ts            # Time clock types
│   │   └── features.ts                # Feature flags
│   └── styles/
│       └── globals.css                # Global styles
├── functions/                         # Firebase Cloud Functions
│   ├── src/
│   │   ├── scheduled/                 # Scheduled functions
│   │   │   ├── reminders.ts           # Booking reminders
│   │   │   └── reports.ts             # Daily reports
│   │   ├── webhooks/                  # Webhook handlers
│   │   │   ├── stripe.ts              # Stripe webhooks
│   │   │   └── whatsapp.ts            # WhatsApp webhooks
│   │   ├── triggers/                  # Firestore triggers
│   │   │   ├── onBookingCreate.ts     # New booking actions
│   │   │   └── onOrderUpdate.ts       # Order status changes
│   │   └── index.ts                   # Function exports
│   ├── package.json
│   └── tsconfig.json
├── scripts/
│   ├── seed.ts                        # Database seeding
│   ├── migrate.ts                     # Migration scripts
│   └── backup.ts                      # Backup utilities
├── public/
│   ├── images/                        # Static images
│   ├── fonts/                         # Custom fonts
│   └── manifest.json                  # PWA manifest
├── firestore.rules                    # Security rules
├── firestore.indexes.json             # Composite indexes
├── firebase.json                      # Firebase config
├── middleware.ts                      # Next.js middleware (subdomain routing)
├── next.config.js                     # Next.js config
├── tailwind.config.ts                 # Tailwind config
├── tsconfig.json                      # TypeScript config
├── package.json
└── README.md
```

---

## 🗄️ Database Schema (Firestore)

### Core Collections

```typescript
// organizations/{orgId}
{
  id: string;
  name: string;
  slug: string;                    // URL-friendly (e.g., "salon-beauty")
  type: "salon" | "clinic" | "restaurant" | "bakery";
  plan: "starter" | "growth" | "pro" | "enterprise";
  stripeCustomerId: string;
  subscriptionStatus: "active" | "trialing" | "canceled" | "past_due";
  settings: {
    timezone: string;              // e.g., "America/Sao_Paulo"
    currency: "BRL";
    locale: "pt-BR";
    confirmationChannels: ["whatsapp", "email", "sms"];
    cancellationPolicy: {
      hours: 24;
      refundPercent: 50;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// organizations/{orgId}/units/{unitId}
{
  id: string;
  name: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  workingHours: {
    monday: { open: "09:00", close: "18:00" };
    // ... other days
  };
}

// organizations/{orgId}/services/{serviceId}
{
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  bufferMinutes: number;           // Time between appointments
  price: number;
  category: string;
  resourceIds: string[];           // Rooms/equipment needed
  eligibleProfessionalIds: string[];
  active: boolean;
}

// organizations/{orgId}/professionals/{professionalId}
{
  id: string;
  userId: string;                  // Link to users collection
  name: string;
  serviceIds: string[];
  schedule: {
    monday: { start: "09:00", end: "18:00" };
    // ... other days
  };
  commissionPercent: number;
}

// organizations/{orgId}/customers/{customerId}
{
  id: string;
  name: string;
  email: string;
  phone: string;
  consents: {
    marketing: { given: boolean; at: Timestamp };
    reminders: { given: boolean; at: Timestamp };
  };
  preferences: {
    calendar: "google" | "apple" | "outlook" | null;
  };
}

// organizations/{orgId}/bookings/{bookingId}
{
  id: string;
  serviceId: string;
  professionalId: string;
  customerId: string;
  unitId: string;
  startAt: Timestamp;
  endAt: Timestamp;
  status: "pending" | "confirmed" | "completed" | "canceled" | "no_show";
  price: number;
  paymentId?: string;
  calendarEventSent: boolean;
  notes: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// organizations/{orgId}/products/{productId} (Restaurant)
{
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  allergens: string[];
  available: boolean;
  variations: Array<{
    name: string;
    options: Array<{ name: string; price: number }>;
  }>;
}

// organizations/{orgId}/orders/{orderId} (Restaurant)
{
  id: string;
  tableId: string;
  status: "open" | "paid" | "canceled";
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    notes: string;
    status: "pending" | "preparing" | "ready" | "delivered";
  }>;
  subtotal: number;
  tip: number;
  total: number;
  paymentId?: string;
  createdAt: Timestamp;
  closedAt?: Timestamp;
}

// organizations/{orgId}/clockins/{clockinId} (Time Clock)
{
  id: string;
  userId: string;
  type: "in" | "out" | "break_start" | "break_end";
  timestamp: Timestamp;
  location?: GeoPoint;
  deviceId: string;
  validated: boolean;
}

// users/{userId}
{
  id: string;
  email: string;
  name: string;
  role: "owner" | "manager" | "professional" | "attendant";
  orgId: string;
  unitIds: string[];
  createdAt: Timestamp;
}
```

---

## 🔐 Security

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function belongsToOrg(orgId) {
      return isAuthenticated() && request.auth.token.orgId == orgId;
    }
    
    function hasRole(role) {
      return isAuthenticated() && request.auth.token.role == role;
    }
    
    // Organizations
    match /organizations/{orgId} {
      allow read: if belongsToOrg(orgId);
      allow write: if belongsToOrg(orgId) && hasRole('owner');
      
      // Subcollections
      match /bookings/{bookingId} {
        allow read: if belongsToOrg(orgId);
        allow create: if true;  // Public can book
        allow update, delete: if belongsToOrg(orgId) && 
          (hasRole('owner') || hasRole('manager'));
      }
      
      match /customers/{customerId} {
        allow read, write: if belongsToOrg(orgId);
      }
      
      match /orders/{orderId} {
        allow read: if belongsToOrg(orgId);
        allow create, update: if true;  // Public can order
      }
      
      // Other subcollections follow similar patterns
    }
    
    // Users
    match /users/{userId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == userId || hasRole('owner') || hasRole('manager'));
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

### Authentication & Authorization

- **Firebase Auth** with custom claims for RBAC
- **JWT tokens** with `orgId` and `role` claims
- **MFA** for owners and managers
- **Secure sessions** with httpOnly cookies + JWT
- **API key rotation** for third-party integrations

### Data Privacy (LGPD/GDPR)

- Data minimization by design
- Pseudonymization in analytics
- Configurable retention periods
- Data export capabilities (CSV/JSON)
- Right to be forgotten implementation
- Consent management with audit logs
- Designated DPO (Data Protection Officer)

---

## 📊 Subscription Plans

| Feature | Starter | Growth | Pro | Enterprise |
|---------|---------|--------|-----|------------|
| **Price (BRL/month)** | R$ 99 | R$ 249 | R$ 499 | Custom |
| **Locations** | 1 | 3 | Unlimited | Unlimited |
| **Professionals** | 5 | 15 | 50 | Unlimited |
| **Monthly Bookings** | Unlimited | Unlimited | Unlimited | Unlimited |
| **WhatsApp Reminders** | ✅ | ✅ | ✅ | ✅ |
| **Calendar Integration** | ✅ | ✅ | ✅ | ✅ |
| **Payments (PIX/Card)** | ❌ | ✅ | ✅ | ✅ |
| **Commission Splits** | ❌ | ✅ | ✅ | ✅ |
| **Digital Menu** | ❌ | ✅ | ✅ | ✅ |
| **Virtual Tab** | ❌ | ✅ | ✅ | ✅ |
| **Time Clock** | ❌ | ❌ | ✅ | ✅ |
| **Inventory Management** | ❌ | ❌ | ✅ | ✅ |
| **Tax Invoices (NFS-e)** | ❌ | ❌ | ✅ | ✅ |
| **CRM & Campaigns** | ❌ | ❌ | ✅ | ✅ |
| **API Access** | ❌ | ❌ | ✅ | ✅ |
| **White-label** | ❌ | ❌ | ❌ | ✅ |
| **Priority Support** | ❌ | ✅ | ✅ | ✅ |
| **Dedicated Success Manager** | ❌ | ❌ | ❌ | ✅ |

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run seed` | Seed database with demo data |
| `npm run migrate` | Run database migrations |
| `npm test` | Run unit tests (Jest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |

---

## 🧪 Testing

### Local Testing with Subdomains

**Option 1: Query Parameter (Easiest)**
```
http://localhost:3000?subdomain=demo
```

**Option 2: Hosts File**

**macOS/Linux:** Edit `/etc/hosts`
```
127.0.0.1 puncto.local
127.0.0.1 demo.puncto.local
127.0.0.1 admin.puncto.local
```

**Windows:** Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator
```
127.0.0.1 puncto.local
127.0.0.1 demo.puncto.local
127.0.0.1 admin.puncto.local
```

Then visit: `http://demo.puncto.local:3000`

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test with coverage
npm test -- --coverage
```

---

## 🚀 Deployment

### Vercel (Web App)

1. **Connect Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import Git Repository
   - Select your repo

2. **Configure Environment Variables:**
   - Add all variables from `.env.local`
   - Separate environments: Production, Preview, Development

3. **Deploy:**
   ```bash
   # Via Vercel CLI
   npm install -g vercel
   vercel --prod
   ```

4. **Custom Domain:**
   - Add domain in Vercel dashboard: `puncto.com.br`
   - Configure DNS:
     ```
     @ A 76.76.21.21
     www CNAME cname.vercel-dns.com
     * CNAME cname.vercel-dns.com  # Wildcard for subdomains
     ```

### Fly.io (Centrifugo)

```bash
# Deploy Centrifugo
fly deploy

# View logs
fly logs

# Scale instances
fly scale count 2 --region gru,gig  # São Paulo + Rio
```

### Firebase (Cloud Functions)

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:sendBookingReminder
```

---

## 📈 Monitoring & Observability

### Application Performance

- **Vercel Analytics** - Web Vitals, page views
- **Sentry** - Error tracking and performance monitoring
- **LogTail/Axiom** - Structured logging
- **Firebase Performance** - Function execution times

### Real-time Metrics

- **Centrifugo admin panel** - WebSocket connections, pub/sub stats
- **Custom metrics API** - Business KPIs (no-shows, bookings, revenue)

### Alerts

- **Sentry** - Critical errors → Slack/email
- **Vercel** - Deployment failures
- **Fly.io** - Centrifugo downtime → PagerDuty
- **Firebase** - Function errors, quota limits

---

## 🗺️ Roadmap

**Status Summary:** Phases 1-4 have been successfully completed. All core features, APIs, integrations, and scale features are implemented and operational. Phase 5 (Delivery Platform) is planned for future development.

### ✅ Phase 1: Foundation (Months 1-3) - **COMPLETED**
- [x] Multi-tenant architecture
- [x] Subdomain routing
- [x] Public booking page
- [x] Firestore integration
- [x] Security rules
- [x] Personal calendar integration (.ics)
- [x] Real-time updates (Centrifugo)
- [x] WhatsApp/email reminders
- [x] Admin dashboard (bookings, services, professionals, customers, analytics)
- [x] Availability calculation logic
- [x] Waitlist system
- [x] React Query integration
- [x] PWA configuration

### ✅ Phase 2: Payments + Financial Reports (Months 4-6) - **COMPLETED**
- [x] Stripe integration (Checkout, Billing, Payment Links)
- [x] Payment at booking (deposit/full)
- [x] Virtual POS (payment links) with QR codes
- [x] SaaS subscriptions management (Stripe Billing)
- [x] Cancellation policies with automatic refund calculation
- [x] Commission splits (Stripe Connect)
- [x] Financial reports (P&L, Cash Flow)
- [x] Bank reconciliation (OFX/CSV import)
- [x] Internal ledger (double-entry bookkeeping)
- [x] Accounting integrations (SPED export API endpoint)

### ✅ Phase 3: Restaurant + ERP (Months 7-10) - **COMPLETED**
- [x] Digital menu with QR codes
- [x] Table ordering (PWA with cart system)
- [x] Real-time virtual tab (kitchen + waiter + customer views)
- [x] Split payments (equal, by-item, custom)
- [x] Electronic time clock (PIN/biometric, breaks, geolocation)
- [x] Inventory management (stock tracking, movements, low stock alerts)
- [x] Purchases & suppliers (purchase orders, receiving workflow)
- [x] Cost per dish (CSP) and recipe management
- [x] Cost centers & budgets
- [x] Tax invoices (NFC-e generation with TecnoSpeed/eNotas/PlugNotas integration)
- [x] Thermal printer integration (ESC/POS for kitchen orders)
- [x] Time bank & overtime calculation (Brazilian law compliance)
- [x] Attendance reports & payroll export (CSV/Excel)
- [x] CRM & customer segmentation
- [x] Loyalty programs (points, cashback, tier-based rewards)
- [x] Targeted campaigns (email, WhatsApp, SMS, push)
- [x] Birthday reminders (automated campaigns)

### ✅ Phase 4: Scale (Months 11-14) - **COMPLETED**
- [x] Multi-language support (pt-BR, en-US, es-ES) with next-intl
- [x] Locale switcher component and i18n configuration
- [x] Public REST API v1 (bookings, services endpoints with authentication)
- [x] GraphQL API (Apollo Server with schema and resolvers)
- [x] API key management (generation, rotation, expiration)
- [x] API authentication middleware
- [x] Webhooks for third-party integrations (registration, management, testing)
- [x] Advanced BI dashboards (customizable dashboards API)
- [x] Analytics dashboard component with charts and visualizations
- [x] Franchise management (create groups, add units, aggregated metrics dashboard)
- [x] Professional/establishment marketplace (search, filters, discovery UI)
- [x] White-label (branding customization UI, custom CSS, favicon, hide branding option)

### 🚚 Phase 5: Delivery (15+ months)
- [ ] Own delivery platform
- [ ] Driver app
- [ ] GPS tracking
- [ ] Route optimization

---

## 🤝 Contributing

This project is currently private. If you have access:

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m "Add amazing feature"`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Style

- Follow TypeScript strict mode
- Use Prettier for formatting (run `npm run format`)
- Follow ESLint rules (run `npm run lint`)
- Write tests for new features
- Update documentation

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

Copyright © 2026 Puncto. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support

- **Documentation:** [docs.puncto.com.br](https://docs.puncto.com.br)
- **Email:** support@puncto.com.br
- **Discord:** [discord.gg/puncto](https://discord.gg/puncto)
- **Status Page:** [status.puncto.com.br](https://status.puncto.com.br)

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Centrifugo](https://centrifugal.dev/)
- [Stripe](https://stripe.com/)
- [Vercel](https://vercel.com/)
- [Fly.io](https://fly.io/)

---

**Made with ❤️ in Brazil**