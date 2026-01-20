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

## 🏗️ Multi-Instance Architecture

Puncto consists of **4 distinct instances** served from the same Next.js application using domain-based routing:

### 1. Institutional Website (`puncto.com.br`)
**Purpose:** Marketing and lead generation  
**Access:** Public (no authentication required)  
**Route:** `src/app/(marketing)/`  
**Domain:** `puncto.com.br`, `www.puncto.com.br`

**Features:**
- Landing pages and pricing information
- Feature showcases and industry-specific pages
- Blog, resources, support
- Lead capture forms

### 2. Platform Admin (`admin.puncto.com.br`)
**Purpose:** Puncto team internal dashboard  
**Access:** Platform administrators only  
**Route:** `src/app/platform/`  
**Domain:** `admin.puncto.com.br`

**Features:**
- View/manage all businesses
- View/manage all users
- Subscription and billing oversight
- Support ticket management
- Platform analytics and metrics
- Feature flag management
- Business onboarding/offboarding
- System configuration

### 3. Client Admin Dashboard (`{business-slug}.puncto.com.br/admin`)
**Purpose:** Business owners/managers manage their operations  
**Access:** Authenticated business staff (owner, manager, professional)  
**Route:** `src/app/tenant/admin/`  
**Domain:** `{business-slug}.puncto.com.br/admin`

**Features:**
- Booking management
- Service catalog
- Professional/staff management
- Customer database (CRM)
- Financial reports
- Menu management (restaurants)
- Inventory management
- Time clock management
- Settings and configuration

### 4. Client's Clients (End Users) (`{business-slug}.puncto.com.br`)
**Purpose:** Customers book services, view orders, manage their account  
**Access:** Public booking, authenticated for personal portal  
**Route:** `src/app/tenant/`  
**Domain:** `{business-slug}.puncto.com.br`

**Features:**
- Public booking page (PWA)
- Service browsing and appointment booking
- Order placement (restaurants)
- Table ordering (QR code access)
- Personal booking history
- Profile management
- Calendar integration

### Routing Logic

The middleware (`middleware.ts`) handles subdomain-based routing:

```typescript
// Extract subdomain from hostname and route accordingly:
if (subdomain === 'admin') → /platform/* (Platform admin)
if (no subdomain || subdomain === 'www') → /(marketing)/* (Institutional site)
if (subdomain === '{business-slug}') → /tenant/* (Client instance)
```

---

## 🔐 Authentication & Authorization

### Separate Authentication Flows

Puncto implements **three completely separate authentication flows** to prevent unauthorized access and ensure security:

#### 1. Platform Admin (Internal Team Only)
- **Access:** Manual creation via script only
- **Login:** `/auth/platform/login`
- **Features:** Full platform access, manage all businesses, subscription oversight

**Creating Platform Admin:**
```bash
npm run create-admin
```
Interactive prompts will guide you through creating a platform administrator with the appropriate access level (super_admin, support, or analyst).

**For existing users, grant admin access:**
```bash
npm run set-admin email@puncto.com.br
```
**Note:** Users must sign out and sign in again after the claim is set for it to take effect.

#### 2. Business Owner (Self-Service)
- **Signup:** `/auth/business/signup`
- **Login:** `/auth/business/login`
- **Flow:** Signup → Business Onboarding → Plan Selection → Payment → Auto-assignment

**Automatic Role Assignment:**
When a business owner completes the onboarding and payment process, the system automatically:
- Assigns `userType: 'business_user'`
- Grants `businessRoles[businessId]: 'owner'`
- Sets `primaryBusinessId: businessId`
- Creates business with selected subscription tier

**No manual intervention required** - business owners are fully self-service.

#### 3. Customer (Self-Service)
- **Signup:** `/auth/customer/signup`
- **Login:** `/auth/customer/login`
- **Flow:** Quick signup → Immediate access (no onboarding)

**Automatic Assignment:**
- Assigns `userType: 'customer'`
- Grants access to booking history and profile
- No business admin access

### User Types & Custom Claims

| User Type | Custom Claims | Access Level |
|-----------|--------------|--------------|
| **Platform Admin** | `userType: 'platform_admin'`<br>`platformAdmin: true`<br>`platformRole: 'super_admin' \| 'support' \| 'analyst'` | Full platform access |
| **Business Owner** | `userType: 'business_user'`<br>`businessRoles: {businessId: 'owner'}`<br>`primaryBusinessId: businessId` | Full access to their business(es) |
| **Business Manager** | `userType: 'business_user'`<br>`businessRoles: {businessId: 'manager'}` | Limited admin access (configurable) |
| **Professional** | `userType: 'business_user'`<br>`businessRoles: {businessId: 'professional'}` | Read-only, manage own bookings |
| **Customer** | `userType: 'customer'`<br>`customerId: userId` | Own bookings and profile only |

### Security Enforcement

**Multi-Layer Protection:**
1. **Middleware** - Validates JWT custom claims before page load
2. **Layout Components** - `<ProtectedRoute>` enforces role requirements
3. **API Routes** - Server-side validation on all endpoints

**Access Control Rules:**
- ❌ Customers **cannot** access business admin areas
- ❌ Business owners **cannot** access platform admin areas
- ❌ Business owners **cannot** access other businesses' admin areas
- ✅ Platform admins have full access when needed
- ✅ All access attempts are logged and monitored

### Authentication URLs

| User Type | Signup | Login | Dashboard |
|-----------|--------|-------|-----------|
| **Platform Admin** | Manual script | `/auth/platform/login` | `/platform/dashboard` |
| **Business Owner** | `/auth/business/signup` | `/auth/business/login` | `/{slug}/admin/dashboard` |
| **Customer** | `/auth/customer/signup` | `/auth/customer/login` | `/my-bookings` |

**Development Access:**
- Platform Admin: `http://localhost:3000?subdomain=admin`
- Business: `http://localhost:3000?subdomain={slug}`
- Customer: `http://localhost:3000?subdomain={slug}`

**Production Access:**
- Platform Admin: `https://admin.puncto.com.br`
- Business: `https://{slug}.puncto.com.br`
- Customer: `https://{slug}.puncto.com.br`

For detailed authentication documentation, see [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md).
For a quick start guide, see [QUICK_START.md](QUICK_START.md).

---

## 🎯 Feature Access Control

Features are controlled by **two dimensions**:

### 1. Subscription Tier
- `free` - Limited features
- `basic` (Starter) - Core scheduling features
- `pro` (Growth) - Restaurant + scheduling
- `enterprise` (Pro/Enterprise) - All features

### 2. Business Type/Industry

Different industries get access to relevant modules:

```typescript
type BusinessType = 
  | 'salon'           // Beauty salons, barbershops
  | 'clinic'          // Medical/dental/aesthetic clinics
  | 'restaurant'      // Restaurants, cafes
  | 'bakery'          // Bakeries, confectioneries
  | 'event'           // Event spaces
  | 'general';        // General service businesses
```

**Feature mapping by business type:**

| Feature | Salon | Clinic | Restaurant | Subscription Required |
|---------|-------|--------|------------|----------------------|
| Scheduling | ✅ | ✅ | ✅ | Basic+ |
| Payments | ✅ | ✅ | ✅ | Growth+ |
| CRM | ✅ | ✅ | ⚠️* | Pro+ |
| Restaurant Menu | ❌ | ❌ | ✅ | Growth+ |
| Table Ordering | ❌ | ❌ | ✅ | Growth+ |
| Inventory | ❌ | ⚠️* | ✅ | Pro+ |
| Time Clock | ⚠️* | ⚠️* | ✅ | Pro+ |

*⚠️ Available but not primary use case - can be enabled manually

### Using Feature Guards

**In Client Components:**
```tsx
import { FeatureGuard } from '@/components/features/FeatureGuard';

export default function MenuPage() {
  return (
    <FeatureGuard feature="restaurantMenu">
      <RestaurantMenu />
    </FeatureGuard>
  );
}
```

**Using Hook:**
```tsx
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess';

export default function MyComponent() {
  const hasMenu = useFeatureAccess('restaurantMenu');
  
  if (!hasMenu) {
    return <UpgradePrompt />;
  }
  
  return <RestaurantMenu />;
}
```

### API Feature Validation

All API routes validate feature access server-side:

```typescript
// Example: Restaurant menu endpoint
const featureCheck = await verifyBusinessFeatureAccess(businessId, 'restaurantMenu');
if (!featureCheck?.hasAccess) {
  return NextResponse.json(
    { error: 'Feature not available', message: '...' },
    { status: 403 }
  );
}
```

**Security Guarantee:**
- ❌ A Salon business **CANNOT** access restaurant endpoints (403 Forbidden)
- ✅ Server-side validation prevents bypass via Postman or direct API calls

---

## 💳 Onboarding & Payment Flow

### Mandatory Payment Onboarding

All new businesses must complete payment before accessing the platform:

```
User Signup → Business Info → Plan Selection → Stripe Checkout → Webhook Activation → Dashboard Access
```

### Flow Details

1. **User Signup** (`/auth/signup`)
   - Creates Firebase Auth user
   - Creates user document in Firestore
   - Redirects to business onboarding

2. **Business Information** (`/onboarding/business`)
   - Collects business details (name, legal name, tax ID, industry, contact info)
   - Auto-formatting for CPF/CNPJ and phone numbers
   - Industry selection for feature access control

3. **Plan Selection** (`/onboarding/plan`)
   - Displays available subscription plans
   - Creates business with `pending_payment` status
   - Generates Stripe Checkout session

4. **Payment** (Stripe Checkout)
   - Hosted payment page
   - Supports PIX, credit cards, etc.
   - Secure payment processing

5. **Activation** (Webhook)
   - Stripe webhook confirms payment
   - Changes business status from `pending_payment` to `active`
   - Only then can users access dashboard

6. **Dashboard Access**
   - Protected by `PaymentGuard` component
   - Verifies subscription status
   - Redirects to payment page if pending

### Environment Variables Required

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Stripe Price IDs for subscription plans
STRIPE_PRICE_ID_STARTER=price_starter_...
STRIPE_PRICE_ID_GROWTH=price_growth_...
STRIPE_PRICE_ID_PRO=price_pro_...

# Application URL for Stripe redirects
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

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

### Platform Admin Implementation ✅ **COMPLETED**

The platform admin instance provides comprehensive management tools for the Puncto team.

#### Dashboard Features
- Real-time platform metrics (total businesses, active businesses, user counts)
- Subscription tier distribution visualization
- Industry distribution analytics
- Recent signups tracking (last 30 days)
- Quick action links to manage businesses and users

#### Business Management
- **List View** (`/platform/businesses`)
  - Filter by status (active, suspended, cancelled)
  - Filter by tier (free, basic, pro, enterprise)
  - Filter by industry (salon, clinic, restaurant, etc.)
  - Search by name, email, or slug
  - Pagination support
  
- **Detail View** (`/platform/businesses/[id]`)
  - Complete business information
  - Subscription details and history
  - Quick links to public site and admin dashboard
  - Suspend/activate controls
  
- **Business Creation**
  - API endpoint for creating new businesses
  - Requires business type (industry) selection
  - Automatic slug generation
  - Stripe customer creation

#### User Management
- **User List** (`/platform/users`)
  - View all users across all businesses
  - Filter by business, role, search
  - Shows platform admin status
  - Shows business roles and memberships
  - Pagination support

#### API Routes (All Platform Admin Protected)
- `/api/platform/businesses` - List and create businesses
- `/api/platform/businesses/[id]` - Business detail and updates
- `/api/platform/users` - User management
- `/api/platform/stats` - Platform statistics

#### Security
- All routes verify `platformAdmin` custom claim
- Supports both JWT token (Bearer) and session cookie
- Client-side protection via `ProtectedRoute` component
- Data isolation enforced by Firestore security rules

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

### Recent Additions to Project Structure

**Platform Admin Routes:**
- `src/app/platform/dashboard/page.tsx` - Platform admin dashboard
- `src/app/platform/businesses/page.tsx` - Business list and management
- `src/app/platform/businesses/[id]/page.tsx` - Business detail view
- `src/app/platform/users/page.tsx` - User management
- `src/app/platform/billing/page.tsx` - Billing and subscriptions

**Onboarding Routes:**
- `src/app/onboarding/business/page.tsx` - Business information form
- `src/app/onboarding/plan/page.tsx` - Plan selection
- `src/app/onboarding/success/page.tsx` - Payment success
- `src/app/onboarding/payment/page.tsx` - Payment pending

**Platform Admin API Routes:**
- `src/app/api/platform/businesses/route.ts` - List/create businesses
- `src/app/api/platform/businesses/[id]/route.ts` - Business management
- `src/app/api/platform/users/route.ts` - User management
- `src/app/api/platform/stats/route.ts` - Platform statistics

**Onboarding API Routes:**
- `src/app/api/onboarding/create-business/route.ts` - Create business with payment
- `src/app/api/onboarding/get-checkout-session/route.ts` - Retrieve checkout session

**Feature Access Control:**
- `src/lib/features/businessTypeFeatures.ts` - Business type feature mapping
- `src/lib/hooks/useFeatureAccess.ts` - Feature access hook
- `src/lib/api/featureValidation.ts` - Server-side feature validation
- `src/components/features/FeatureGuard.tsx` - Feature guard component
- `src/components/business/PaymentGuard.tsx` - Payment status guard

**Scripts:**
- `scripts/set-admin.ts` - Set platform admin access

---

## 🗄️ Database Schema (Firestore)

### Core Collections

```typescript
// businesses/{businessId}
{
  id: string;
  displayName: string;
  legalName: string;
  slug: string;                    // URL-friendly (e.g., "salon-beauty")
  taxId: string;                   // CPF or CNPJ
  email: string;
  phone: string;
  industry: "salon" | "clinic" | "restaurant" | "bakery" | "event" | "general"; // Business type for feature access
  subscription: {
    tier: "free" | "basic" | "pro" | "enterprise";
    status: "active" | "trial" | "suspended" | "cancelled" | "pending_payment"; // pending_payment for new businesses
    stripeCustomerId: string;
    stripeSubscriptionId: string | null;
    stripeCheckoutSessionId: string | null; // For pending payments
    stripePriceId: string;
    currentPeriodStart: Timestamp;
    currentPeriodEnd: Timestamp;
  };
  features: {
    scheduling: boolean;
    payments: boolean;
    restaurantMenu: boolean;
    tableOrdering: boolean;
    inventoryManagement: boolean;
    timeClock: boolean;
    // ... other features based on tier and industry
  };
  settings: {
    timezone: string;              // e.g., "America/Sao_Paulo"
    currency: "BRL";
    locale: "pt-BR" | "en-US" | "es-ES";
    confirmationChannels: ["whatsapp", "email", "sms"];
    cancellationPolicy: {
      hours: 24;
      refundPercent: 50;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Note: Businesses are created with status "pending_payment" during onboarding
// and only activated to "active" when Stripe webhook confirms payment

// businesses/{businessId}/units/{unitId}
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

// businesses/{businessId}/services/{serviceId}
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

// businesses/{businessId}/professionals/{professionalId}
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

// businesses/{businessId}/customers/{customerId}
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

// businesses/{businessId}/bookings/{bookingId}
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

// businesses/{businessId}/products/{productId} (Restaurant)
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

// businesses/{businessId}/orders/{orderId} (Restaurant)
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

// businesses/{businessId}/clockins/{clockinId} (Time Clock)
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
  businessId: string;
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
    
    function belongsToBusiness(businessId) {
      return isAuthenticated() && request.auth.token.businessId == businessId;
    }
    
    function hasRole(role) {
      return isAuthenticated() && request.auth.token.role == role;
    }
    
    // Organizations
    match /businesses/{businessId} {
      allow read: if belongsToBusiness(businessId);
      allow write: if belongsToBusiness(businessId) && hasRole('owner');
      
      // Subcollections
      match /bookings/{bookingId} {
        allow read: if belongsToBusiness(businessId);
        allow create: if true;  // Public can book
        allow update, delete: if belongsToBusiness(businessId) && 
          (hasRole('owner') || hasRole('manager'));
      }
      
      match /customers/{customerId} {
        allow read, write: if belongsToBusiness(businessId);
      }
      
      match /orders/{orderId} {
        allow read: if belongsToBusiness(businessId);
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
- **JWT tokens** with `businessId` and `role` claims
- **Platform Admin** - Custom claim `platformAdmin: true` for Puncto team access
  - Access via `npm run set-admin email@puncto.com.br`
  - Must sign out and sign in after claim is set
  - Full access to all businesses and users
- **MFA** for owners and managers
- **Secure sessions** with httpOnly cookies + JWT
- **API key rotation** for third-party integrations

### API Feature Validation

All API routes validate feature access server-side using business type and subscription tier:

```typescript
// Server-side validation in API routes
const featureCheck = await verifyBusinessFeatureAccess(businessId, 'restaurantMenu');
if (!featureCheck?.hasAccess) {
  return NextResponse.json(
    { error: 'Feature not available', message: '...' },
    { status: 403 }
  );
}
```

**Protected Endpoints:**
- `/api/menu` - Validates `restaurantMenu` feature
- `/api/orders` - Validates `tableOrdering` feature
- `/api/platform/*` - Validates platform admin access

**Security Guarantee:**
- ❌ Salon businesses cannot access restaurant endpoints (403 Forbidden)
- ❌ Cannot be bypassed via Postman or direct API calls
- ✅ Server-side validation prevents unauthorized access

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
| `npm run set-admin` | Set platform admin access for a user (requires email) |
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

### Testing Onboarding Flow

1. **User Signup:**
   ```
   http://localhost:3000/auth/signup
   ```
   - Create a new account
   - Should redirect to `/onboarding/business`

2. **Business Information:**
   - Fill in business details
   - Select industry (important for feature access)
   - Should redirect to `/onboarding/plan`

3. **Plan Selection:**
   - Select a subscription plan
   - Should create business with `pending_payment` status
   - Should redirect to Stripe Checkout

4. **Payment:**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete payment
   - Webhook should activate business

5. **Dashboard Access:**
   - Should redirect to `/admin`
   - `PaymentGuard` verifies subscription status

### Testing Platform Admin

1. **Set Platform Admin Access:**
   ```bash
   npm run set-admin your@email.com
   ```

2. **Sign Out and Sign In:**
   - Must sign out and sign in for claim to take effect

3. **Access Platform Admin:**
   ```
   http://localhost:3000?subdomain=admin
   # or
   http://admin.puncto.local:3000
   ```

4. **Test Features:**
   - View dashboard with platform metrics
   - List all businesses
   - Filter by status, tier, industry
   - View business details
   - Manage users

### Testing Feature Access Control

1. **Create Different Business Types:**
   ```bash
   # Create a salon business
   # Create a restaurant business
   ```

2. **Test API Access:**
   ```bash
   # Try accessing restaurant menu with salon business
   curl -X GET "http://localhost:3000/api/menu?businessId=salon-id"
   # Should return 403 Forbidden
   
   # Access with restaurant business
   curl -X GET "http://localhost:3000/api/menu?businessId=restaurant-id"
   # Should work if tier includes feature
   ```

3. **Test UI Guards:**
   - Log in as salon business
   - Menu option should not appear in navigation
   - Direct access to `/admin/menu` should show upgrade prompt

### Testing Stripe Webhooks Locally

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/subscriptions/webhook

# In another terminal, trigger test event
stripe trigger checkout.session.completed
```

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

**Status Summary:** Phases 1-5 have been successfully completed. All core features, APIs, integrations, scale features, and marketing website are implemented and operational. Phases 6, 7, and 8 are planned for future development.

---

### ✅ Phase 1: Foundation (Months 1-3) - **COMPLETED**

| Feature | Status | Implementation |
|---------|--------|----------------|
| Multi-tenant architecture | ✅ | Subdomain-based routing with tenant detection |
| Subdomain routing | ✅ | `middleware.ts` with `?subdomain=` fallback |
| Public booking page | ✅ | `src/app/tenant/page.tsx`, `BookingPublicPage.tsx` |
| Firestore integration | ✅ | `src/lib/firebase.ts`, `firebaseAdmin.ts` |
| Security rules | ✅ | `firestore.rules` with RBAC |
| Personal calendar integration (.ics) | ✅ | `src/lib/calendar/ics.ts`, `AddToCalendar.tsx` |
| Real-time updates (Centrifugo) | ✅ | `src/lib/centrifugo/`, `CentrifugoProvider.tsx` |
| WhatsApp/email reminders | ✅ | `src/lib/messaging/`, Firebase Functions |
| Admin dashboard | ✅ | `src/app/tenant/admin/` (bookings, services, professionals, customers, analytics) |
| Availability calculation | ✅ | `src/lib/utils/slots.ts`, `useAvailability.ts` |
| Waitlist system | ✅ | `/api/waitlist/route.ts` |
| React Query integration | ✅ | `src/lib/queries/`, `QueryProvider.tsx` |
| PWA configuration | ✅ | `public/manifest.json` |

---

### ✅ Phase 2: Payments + Financial Reports (Months 4-6) - **COMPLETED**

| Feature | Status | Implementation |
|---------|--------|----------------|
| Stripe integration | ✅ | `src/lib/stripe/` (Checkout, Billing, Payment Links) |
| Payment at booking | ✅ | `PaymentStep.tsx`, `/api/payments/create-checkout/` |
| Virtual POS with QR codes | ✅ | `PaymentLinkForm.tsx`, `/api/payments/create-payment-link/` |
| SaaS subscriptions | ✅ | `src/lib/stripe/subscriptions.ts`, `/api/subscriptions/` |
| Cancellation policies | ✅ | `src/lib/stripe/refunds.ts`, automatic refund calculation |
| Commission splits (Stripe Connect) | ✅ | `src/lib/stripe/connect.ts`, `/api/stripe-connect/` |
| Financial reports (P&L, Cash Flow) | ✅ | `/api/reports/pnl/`, `/api/reports/cashflow/` |
| Bank reconciliation | ✅ | `/api/reconciliation/import/` (OFX/CSV) |
| Internal ledger | ✅ | `src/lib/ledger/entries.ts` (double-entry bookkeeping) |
| Accounting integrations | ✅ | `/api/accounting/sped-export/` |

---

### ✅ Phase 3: Restaurant + ERP (Months 7-10) - **COMPLETED**

**Restaurant/Café Module:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| Digital menu with QR codes | ✅ | `src/app/tenant/admin/menu/`, `QRCodeGenerator.tsx` |
| Table ordering (PWA) | ✅ | `src/app/tenant/table/[tableId]/`, `useCart.ts`, `CartDrawer.tsx` |
| Real-time virtual tab | ✅ | `VirtualTab.tsx`, `KitchenQueue.tsx`, Centrifugo channels |
| Split payments | ✅ | `SplitPaymentModal.tsx`, `/api/orders/[orderId]/split/` |
| Order status tracking | ✅ | `/api/orders/[orderId]/status/`, `/api/orders/[orderId]/items/[itemIndex]/status/` |
| Thermal printer integration | ✅ | `src/lib/printing/thermal.ts` (ESC/POS) |
| NFC-e tax invoices | ✅ | `src/lib/tax/nfce.ts`, `/api/tax/nfce/generate/` |

**ERP Module:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| Inventory management | ✅ | `src/app/tenant/admin/inventory/`, `/api/inventory/` |
| Purchases & suppliers | ✅ | `src/app/tenant/admin/purchases/`, `/api/purchases/`, `/api/suppliers/` |
| Cost per dish (CSP) | ✅ | `src/lib/erp/costCalculation.ts`, `/api/recipes/` |
| Cost centers & budgets | ✅ | `/api/budgets/` |

**Time Clock Module:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| Clock in/out (PIN/biometric) | ✅ | `src/app/tenant/time-clock/`, `/api/time-clock/clock/` |
| Break tracking | ✅ | `src/types/timeClock.ts`, clock API |
| Geolocation support | ✅ | Location capture in clock-in |
| Shift management | ✅ | `/api/time-clock/shifts/` |
| Time bank & overtime | ✅ | `src/lib/time-clock/calculations.ts` (Brazilian law) |
| Attendance reports | ✅ | `/api/time-clock/reports/` (CSV/Excel export) |

**CRM & Marketing Module:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| Customer segmentation | ✅ | `src/lib/crm/segmentation.ts`, `/api/crm/segments/` |
| Loyalty programs | ✅ | `src/app/tenant/admin/loyalty/`, `/api/loyalty/` |
| Targeted campaigns | ✅ | `src/app/tenant/admin/campaigns/`, `/api/campaigns/` |
| Birthday reminders | ✅ | `src/lib/crm/birthdays.ts`, Firebase scheduled function |

**Firebase Functions (Phase 3):**
| Function | Status | Trigger |
|----------|--------|---------|
| `onOrderCreate` | ✅ | Auto-print, inventory update, real-time publish |
| `onOrderPaid` | ✅ | NFC-e generation, loyalty points |
| `onClockIn` | ✅ | Shift validation |
| `checkInventoryAlerts` | ✅ | Daily scheduled (low stock alerts) |
| `sendBirthdayReminders` | ✅ | Daily scheduled |

---

### ✅ Phase 4: Scale (Months 11-14) - **COMPLETED**

| Feature | Status | Implementation |
|---------|--------|----------------|
| Multi-language (pt-BR, en-US, es-ES) | ✅ | `src/i18n/`, `src/messages/`, next-intl |
| Locale switcher | ✅ | `LocaleSwitcher.tsx` |
| Public REST API v1 | ✅ | `/api/v1/bookings/`, `/api/v1/services/` |
| GraphQL API | ✅ | `/api/graphql/`, `src/lib/graphql/` (Apollo Server) |
| API key management | ✅ | `/api/api-keys/`, `src/lib/api/authentication.ts` |
| API authentication middleware | ✅ | `src/lib/api/middleware.ts` |
| Rate limiting | ✅ | `src/lib/api/rateLimiting.ts` |
| Webhooks system | ✅ | `/api/webhooks/register/`, `/api/webhooks/test/`, `onWebhookDeliveryCreated` |
| Advanced BI dashboards | ✅ | `/api/dashboards/`, `AnalyticsDashboard.tsx` |
| Franchise management | ✅ | `src/app/tenant/admin/franchise/`, `/api/franchise/` |
| Marketplace | ✅ | `src/app/marketplace/`, `/api/marketplace/` |
| White-label branding | ✅ | `/api/branding/`, `BrandingProvider.tsx`, `BrandingWrapper.tsx` |

**Pending Enhancements:**
| Feature | Status | Notes |
|---------|--------|-------|
| Multi-region architecture | ⚠️ | Planned for high-scale deployment |
| Public API SDK (JS/Python) | ⚠️ | Planned |
| Comprehensive API docs | ⚠️ | In progress |

---

### ✅ Phase 5: Marketing Website & Brand - **COMPLETED**

**Website & Landing Pages:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| Brand guidelines | ✅ | `src/lib/brand/guidelines.ts` (colors, typography, spacing) |
| Landing page | ✅ | `src/app/(marketing)/page.tsx` with Hero, Features, Testimonials |
| Pricing page | ✅ | `src/app/(marketing)/pricing/page.tsx` |
| Industry pages | ✅ | `src/app/(marketing)/industries/[slug]/` (salons, restaurants, clinics, bakeries) |
| Features page | ✅ | `src/app/(marketing)/features/page.tsx` |
| About page | ✅ | `src/app/(marketing)/about/page.tsx` |
| Contact page | ✅ | `src/app/(marketing)/contact/page.tsx` |
| Blog | ✅ | `src/app/(marketing)/blog/`, `src/content/blog.ts` |
| Legal pages | ✅ | `/legal/terms/`, `/legal/privacy/`, `/legal/lgpd/`, `/legal/cookies/` |
| Press/Media kit | ✅ | `src/app/(marketing)/press/page.tsx` |

**Lead Generation:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| Lead capture forms | ✅ | `LeadCaptureForm.tsx`, `/api/contact/`, `/api/demo-request/` |
| Newsletter subscription | ✅ | `/api/newsletter/` |
| Demo request page | ✅ | `src/app/(marketing)/demo/page.tsx` |
| Exit-intent popups | ✅ | `ExitIntentPopup.tsx` |
| CTA sections | ✅ | `CTASection.tsx` |

**Analytics & Tracking:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| Google Analytics 4 | ✅ | `GoogleAnalytics.tsx` |
| Facebook Pixel | ✅ | `FacebookPixel.tsx` |
| Hotjar heatmaps | ✅ | `HotjarAnalytics.tsx` |
| LinkedIn Insight Tag | ✅ | `LinkedInInsightTag.tsx` |
| A/B testing framework | ✅ | `src/lib/ab-testing/index.ts` |
| Conversion tracking | ✅ | Event tracking functions |

**SEO:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| JSON-LD structured data | ✅ | `src/lib/seo/jsonld.ts` |
| Sitemap | ✅ | `next-sitemap.config.js` |
| robots.txt | ✅ | `public/robots.txt` |
| Meta tags & Open Graph | ✅ | Metadata on all pages |

**Marketing Components:**
| Component | Status | File |
|-----------|--------|------|
| Hero | ✅ | `Hero.tsx` |
| FeatureCard | ✅ | `FeatureCard.tsx` |
| PricingCard | ✅ | `PricingCard.tsx` |
| TestimonialCard/Carousel | ✅ | `TestimonialCard.tsx`, `TestimonialCarousel.tsx` |
| FAQAccordion | ✅ | `FAQAccordion.tsx` |
| CustomerLogos | ✅ | `CustomerLogos.tsx` |
| StatsCounter | ✅ | `StatsCounter.tsx` |
| TrustBadges | ✅ | `TrustBadges.tsx` |
| ReviewWidgets | ✅ | `ReviewWidgets.tsx` |
| CertificationBadges | ✅ | `CertificationBadges.tsx` |
| CookieConsent | ✅ | `CookieConsent.tsx` |
| VideoPlayer | ✅ | `VideoPlayer.tsx` |
| Header/Footer | ✅ | `Header.tsx`, `Footer.tsx` |

**Integrations:**
| Integration | Status | Implementation |
|-------------|--------|----------------|
| HubSpot CRM | ✅ | `src/lib/integrations/hubspot.ts` |
| SendGrid email | ✅ | `src/lib/integrations/sendgrid.ts` |

**Video Content:**
| Feature | Status | Implementation |
|---------|--------|----------------|
| Videos page | ✅ | `src/app/(marketing)/videos/page.tsx` |
| Webinars page | ✅ | `src/app/(marketing)/webinars/page.tsx` |
| Resources page | ✅ | `src/app/(marketing)/resources/page.tsx` |

**Pending (Optional Enhancements):**
| Feature | Status | Notes |
|---------|--------|-------|
| Logo design | ⏳ | Requires design work |
| Google Business Profile | ⏳ | Local SEO setup pending |
| Explainer animations | ⏳ | Pending design assets |
| Video testimonials | ⏳ | Pending recordings |
| YouTube channel | ⏳ | Pending setup |

### 🏨 Phase 6: Hospitality Platform (Future)
- [ ] Property listings (hotels, pousadas, vacation rentals, hostels)
- [ ] Multi-property management for chains
- [ ] Room/unit type configuration
- [ ] Floor plans and visual maps
- [ ] Property amenities catalog
- [ ] Real-time availability calendar
- [ ] Instant booking and booking requests
- [ ] Multi-channel booking engine
- [ ] Group reservations
- [ ] Dynamic pricing engine
- [ ] Seasonal rates and promotions
- [ ] Channel manager integration (Booking.com, Airbnb, Expedia)
- [ ] Guest portal and mobile app
- [ ] Digital check-in/check-out
- [ ] Digital room keys (smart lock integration)
- [ ] In-room service requests
- [ ] Digital concierge
- [ ] Guest communication hub
- [ ] Review and rating system
- [ ] Housekeeping management
- [ ] Room status tracking
- [ ] Maintenance request system
- [ ] Staff scheduling
- [ ] Inventory management (linens, amenities)
- [ ] Laundry tracking
- [ ] Dynamic pricing algorithms
- [ ] Deposit collection and refunds
- [ ] Extras and upsells
- [ ] Multi-currency support
- [ ] Channel commission tracking
- [ ] Revenue management reports (ADR, RevPAR, occupancy)
- [ ] OTA synchronization
- [ ] Direct booking website
- [ ] Booking widget
- [ ] Meta-search integration (Google Hotels, Trivago)
- [ ] Rate parity monitoring

### 🚚 Phase 7: Delivery (Future)
- [ ] Own delivery platform
- [ ] Real-time driver tracking (GPS)
- [ ] Route optimization
- [ ] Driver app
- [ ] Commission management
- [ ] Gamification system

### 🚗 Phase 8: Ride-Hailing Platform (Future)
- [ ] Multi-city ride-hailing platform
- [ ] Driver and rider mobile apps
- [ ] Real-time GPS tracking and navigation
- [ ] Intelligent driver-rider matching algorithm
- [ ] Multiple vehicle categories (economy, comfort, premium, XL)
- [ ] Instant ride requests
- [ ] Scheduled rides (advance booking)
- [ ] Shared rides (carpool) with route optimization
- [ ] Multi-stop rides
- [ ] Ride estimation (price, time, distance)
- [ ] Real-time ride status updates
- [ ] In-app chat between driver and rider
- [ ] SOS emergency button with location sharing
- [ ] Driver onboarding and verification (background checks, documents)
- [ ] Driver dashboard (earnings, trips, performance)
- [ ] Shift management (online/offline status)
- [ ] Acceptance rate and cancellation tracking
- [ ] Driver ratings and feedback system
- [ ] Vehicle inspection and documentation
- [ ] Earnings withdrawal system
- [ ] Driver incentives and bonuses
- [ ] Dynamic pricing (surge pricing during high demand)
- [ ] Distance and time-based fare calculation
- [ ] Multiple payment methods (PIX, cards, cash, wallet)
- [ ] Automatic fare splitting among riders
- [ ] Toll and parking fee handling
- [ ] Tipping system
- [ ] Promo codes and referral discounts
- [ ] Invoice generation for corporate accounts
- [ ] Real-time ride monitoring and alerts
- [ ] Emergency contact integration
- [ ] Ride sharing (share trip details with contacts)
- [ ] Driver and vehicle verification system
- [ ] Insurance integration
- [ ] Incident reporting and resolution
- [ ] LGPD compliance for personal data
- [ ] Audio recording (optional, for safety)
- [ ] Partner with fleet owners
- [ ] Vehicle assignment and tracking
- [ ] Maintenance scheduling
- [ ] Fuel consumption tracking
- [ ] Vehicle availability management
- [ ] Corporate fleet solutions
- [ ] Heat maps for demand prediction
- [ ] Driver performance analytics
- [ ] Revenue reports (per driver, per region, per vehicle type)
- [ ] Ride completion rates
- [ ] Peak hours analysis
- [ ] Customer retention metrics
- [ ] Churn prediction
- [ ] Rider profile and preferences
- [ ] Favorite locations
- [ ] Ride history and receipts
- [ ] Lost and found system
- [ ] Customer support chat/tickets
- [ ] Rating and review system
- [ ] Loyalty program (points, discounts)
- [ ] Accessibility features (wheelchair-accessible vehicles)
- [ ] Business accounts for companies
- [ ] Expense management and reporting
- [ ] Employee ride credits
- [ ] Monthly invoicing
- [ ] Centralized billing
- [ ] Driver mobile app (React Native)
- [ ] Rider mobile app (React Native)
- [ ] Real-time geolocation and mapping (Google Maps, Mapbox)
- [ ] Route optimization algorithms
- [ ] Matching algorithm (distance, ratings, vehicle type)
- [ ] Push notifications for ride updates
- [ ] WebSocket for real-time location tracking
- [ ] ML models for demand forecasting and surge pricing
- [ ] Background location tracking (battery-optimized)
- [ ] Offline mode for drivers
- [ ] Admin dashboard for operations team
- [ ] Fraud detection system
- [ ] Integration with traffic APIs (real-time traffic data)

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