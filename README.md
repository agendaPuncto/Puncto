# Puncto - Multi-Tenant Scheduling Platform

A comprehensive SaaS scheduling platform for clinics, beauty salons, restaurants, and any business that needs appointment management with WhatsApp confirmations.

## 🌟 Features

- **Multi-tenant architecture** - Each business gets their own subdomain
- **Public booking pages** - Customers can book appointments online
- **Role-based access control** - Owner, Manager, Professional roles
- **WhatsApp/SMS/Email reminders** - Automated booking confirmations
- **Service catalog** - Duration, pricing, and professional assignment
- **Multiple locations** - Support for businesses with multiple branches
- **Analytics dashboard** - Occupancy rates, no-shows, NPS
- **Data export** - CSV export for customer and booking data
- **LGPD/GDPR compliant** - Full data ownership and export capabilities

## 🏗️ Architecture

### Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions)
- **Hosting:** Vercel
- **DNS/SSL:** Cloudflare
- **Notifications:** Evolution API (WhatsApp), SendGrid (Email)

### Multi-Tenancy Model

- **Subdomain routing:** `{businessSlug}.puncto.app`
- **Platform admin:** `admin.puncto.app`
- **Marketing site:** `puncto.app`
- **Firestore subcollections** for data isolation per business
- **Security rules** enforcing tenant boundaries

## 📋 Prerequisites

- Node.js 18+
- Firebase account (Blaze plan for Cloud Functions)
- Firebase CLI: `npm install -g firebase-tools`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/agendaPuncto/Puncto.git
cd puncto
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Edit `.env.local` with your Firebase credentials:

```env
# Firebase Client SDK (from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (from downloaded service account JSON)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**To get Firebase Admin credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Open the downloaded JSON file and copy:
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

### 4. Deploy Firestore Rules & Indexes

```bash
firebase login
firebase use --add  # Select your project
firebase deploy --only firestore
```

### 5. Seed the Database

Populate Firestore with demo business data:

```bash
npm run seed
```

This creates:
- **1 Demo business** (slug: `demo`)
- **3 Professionals** (Andreia, Rafael, Bianca)
- **6 Services** (Corte Feminino, Coloração, Corte Masculino, etc.)

### 6. Run Development Server

```bash
npm run dev
```

### 7. Test the Application

Open your browser:
```
http://localhost:3000?subdomain=demo
```

You should see the demo business booking page!

## 📁 Project Structure

```
puncto/
├── src/
│   ├── app/
│   │   ├── tenant/              # Business subdomain routes
│   │   │   ├── layout.tsx       # Fetches business by slug
│   │   │   ├── page.tsx         # Public booking page
│   │   │   ├── admin/           # Business dashboard (Phase 2+)
│   │   │   └── my-bookings/     # Customer portal (Phase 4)
│   │   ├── platform/            # Platform admin (Phase 5)
│   │   ├── (marketing)/         # Landing page (Phase 6)
│   │   └── auth/                # Login/signup (Phase 2)
│   ├── components/
│   │   ├── booking/             # Booking flow components
│   │   ├── admin/               # Admin dashboard components
│   │   └── shared/              # Shared UI components
│   ├── lib/
│   │   ├── firebase.ts          # Client SDK
│   │   ├── firebaseAdmin.ts     # Server SDK
│   │   ├── tenant.ts            # Tenant detection
│   │   └── contexts/            # React contexts
│   └── types/
│       ├── business.ts          # Business types
│       ├── booking.ts           # Booking types
│       ├── user.ts              # User types
│       └── features.ts          # Feature flags
├── scripts/
│   └── seed.ts                  # Database seeding script
├── middleware.ts                # Subdomain routing
├── firestore.rules              # Security rules
├── firestore.indexes.json       # Composite indexes
└── firebase.json                # Firebase config
```

## 🗄️ Database Schema

### Collections

```
businesses/
  └─ {businessId}/
      ├─ locations/              # Business locations
      ├─ professionals/          # Staff members
      ├─ services/               # Service catalog
      ├─ bookings/               # Appointments
      ├─ customers/              # Customer records
      └─ staff/                  # Staff roles & permissions

users/                           # Global user accounts
platformAdmins/                  # Platform administrators
auditLogs/                       # Audit trail
supportTickets/                  # Support system
featureFlags/                    # Feature overrides
subscriptionPlans/               # Subscription tiers
```

## 🔐 Security

- **Firestore Security Rules** enforce tenant isolation
- **Role-based access control** via custom claims
- **Server-side validation** in Cloud Functions
- **Environment variables** never committed to Git
- **LGPD/GDPR compliance** with data export/deletion

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with demo data |

## 🧪 Testing Locally with Subdomains

### Option 1: Query Parameter (Easiest)
```
http://localhost:3000?subdomain=demo
```

### Option 2: Hosts File (Windows)
Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator:
```
127.0.0.1 puncto.local
127.0.0.1 demo.puncto.local
127.0.0.1 admin.puncto.local
```

Then visit: `http://demo.puncto.local:3000`

### Firebase Functions (Coming in Phase 7)

```bash
firebase deploy --only functions
```

## 📊 Subscription Tiers

| Feature | Free | Basic | Pro | Enterprise |
|---------|------|-------|-----|------------|
| **Locations** | 1 | 1 | 5 | Unlimited |
| **Professionals** | 2 | 5 | 20 | Unlimited |
| **Monthly Bookings** | 50 | 200 | 1000 | Unlimited |
| **WhatsApp Reminders** | ❌ | ✅ | ✅ | ✅ |
| **Custom Branding** | ❌ | ✅ | ✅ | ✅ |
| **Advanced Reports** | ❌ | ❌ | ✅ | ✅ |
| **API Access** | ❌ | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ❌ | ✅ | ✅ |

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Completed)
- Multi-tenant architecture
- Subdomain routing
- Public booking page
- Firestore integration
- Security rules

### 🔄 Phase 2: Authentication (In Progress)
- Firebase Auth integration
- Custom claims system
- Staff invitation flow
- Role-based permissions

### 📅 Phase 3: Business Dashboard
- Services management
- Professional scheduling
- Bookings calendar
- Customer management

### 👥 Phase 4: Customer Portal
- Customer accounts
- Booking history
- Dependent management
- Profile settings

### 🛠️ Phase 5: Platform Admin
- Business management
- Support ticket system
- Audit logs
- Feature flags

### 💳 Phase 6: Subscriptions & Billing
- Stripe integration
- Subscription tiers
- Payment webhooks
- Billing dashboard

### 📱 Phase 7: Notifications
- WhatsApp reminders (Evolution API)
- Email notifications (SendGrid)
- SMS support
- Scheduled jobs

### 📈 Phase 8: Advanced Features
- Analytics dashboards
- NPS surveys
- Data export (CSV/Excel)
- Multi-location support

### 🎨 Phase 9: Polish & Optimization
- Performance tuning
- Mobile responsiveness
- Accessibility (WCAG 2.1 AA)
- Security audit

### 🚀 Phase 10: Launch
- Production deployment
- Beta testing
- Documentation
- Marketing site

## 🤝 Contributing

This is a private project. If you have access and want to contribute:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "Add your feature"`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request
