# Next Steps - Puncto Phase 1 MVP

## ✅ What's Been Completed

All Phase 1 MVP features have been implemented:
- ✅ Centrifugo real-time infrastructure
- ✅ Calendar integration (.ics files)
- ✅ Messaging infrastructure (WhatsApp, Email)
- ✅ Admin dashboard (all pages)
- ✅ Availability calculation logic
- ✅ Waitlist system
- ✅ React Query integration
- ✅ Analytics dashboard
- ✅ PWA configuration
- ✅ Enhanced booking flow

---

## 🚀 Immediate Next Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all new dependencies including:
- `centrifuge` - WebSocket client
- `ics` - Calendar file generation
- Already installed: `@tanstack/react-query`, `recharts`, etc.

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root with the following:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Centrifugo (can be added later for real-time features)
NEXT_PUBLIC_CENTRIFUGO_URL=wss://your-app.fly.dev/connection/websocket
CENTRIFUGO_TOKEN_HMAC_SECRET=your_hmac_secret

# Messaging (optional for MVP testing)
RESEND_API_KEY=re_...  # For email
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id  # For WhatsApp
WHATSAPP_ACCESS_TOKEN=your_access_token

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000?subdomain=demo` to see the booking page.

**Note:** Some features may not work without proper environment variables:
- Real-time updates require Centrifugo setup
- Messaging requires API keys
- These are optional for initial testing

### 4. Deploy Firestore Rules & Indexes

```bash
firebase login
firebase use --add  # Select your Firebase project
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 🔧 Optional Setup (Can Be Done Later)

### Centrifugo Setup (for Real-time Features)

1. **Install Fly.io CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create Centrifugo config:**
   Create `centrifugo.json`:
   ```json
   {
     "token_hmac_secret_key": "your_secret_from_env",
     "api_key": "your_api_key",
     "allowed_origins": ["http://localhost:3000"],
     "namespaces": [
       {
         "name": "org",
         "publish": true,
         "subscribe_to_publish": true
       }
     ]
   }
   ```

3. **Deploy to Fly.io:**
   ```bash
   fly auth login
   fly launch --name puncto-centrifugo --region gru
   fly deploy
   ```

### Cloud Functions Setup

```bash
cd punctoFunctions
npm install
firebase deploy --only functions
```

**Note:** You may need to update `punctoFunctions/package.json` with required dependencies.

---

## 🐛 Known Issues & Fixes Needed

### 1. Centrifugo Token Route
The JWT signing in `/api/centrifugo/token` uses Node.js crypto. If you encounter issues, consider installing `jsonwebtoken`:
```bash
npm install jsonwebtoken @types/jsonwebtoken
```

### 2. Missing Date-fns Locale
Some date formatting may need locale imports. Update if you see locale errors:
```typescript
import { ptBR } from 'date-fns/locale';
```

### 3. FormData in Email Client
The Mailgun client uses `FormData` which is available in Node.js 18+. If on older Node.js, install:
```bash
npm install form-data
```

---

## 📝 Testing Checklist

Before deploying to production:

- [ ] Install all dependencies
- [ ] Set up `.env.local` with Firebase credentials
- [ ] Test booking flow: `http://localhost:3000?subdomain=demo`
- [ ] Test admin dashboard: `/tenant/admin/dashboard` (requires auth)
- [ ] Verify Firestore rules are deployed
- [ ] Test service creation in admin panel
- [ ] Test calendar download (.ics file)
- [ ] (Optional) Set up Centrifugo for real-time features
- [ ] (Optional) Test WhatsApp/Email messaging

---

## 🎯 Quick Wins

You can start using these features immediately:

1. **Admin Dashboard** - Full CRUD for services, view bookings, analytics
2. **Calendar Integration** - Download .ics files (works without setup)
3. **Availability API** - Calculates time slots (works without external services)
4. **React Query** - Improved data fetching and caching

Features that need additional setup:
- Real-time updates (Centrifugo)
- Messaging (WhatsApp/Email API keys)
- Cloud Functions (Firebase deployment)

---

## 📚 Documentation

Refer to `README.md` for:
- Complete architecture overview
- Database schema
- API documentation
- Deployment guides

---

## 🆘 Troubleshooting

**"Module not found" errors:**
- Run `npm install` to ensure all dependencies are installed

**Firestore permission errors:**
- Deploy Firestore rules: `firebase deploy --only firestore:rules`

**Centrifugo connection errors:**
- This is expected if Centrifugo isn't set up yet. Real-time features will be disabled but other features work.

**Environment variable errors:**
- Ensure `.env.local` exists and has required Firebase variables at minimum

---

## 🚢 Next Phase (Future)

Once Phase 1 is stable:
- Phase 2: Payments integration (Stripe)
- Phase 3: Restaurant management
- Phase 4: Advanced ERP features

For now, focus on testing and refining Phase 1 MVP features!
