# Cursor ServiceHub

Production-ready Next.js + Firebase App Hosting application with Firebase Auth, Firestore, Storage, and Stripe payment method setup.

## Prerequisites
- Node 18+ (Node 22 supported)
- Firebase CLI (`npm i -g firebase-tools`)
- Stripe account (test mode is fine)

## Environment Variables
Create a `.env.local` (for local dev) and configure secrets in Firebase App Hosting for production.

Required:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional if not using default ADC
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Install & Develop
```
npm ci
npm run dev
```

## Type/Lint/Build
```
npm run typecheck
npm run lint
npm run build
```

## Firebase Setup
1) Login and enable frameworks (for local previews):
```
firebase login
firebase experiments:enable webframeworks
```

2) Deploy security rules and hosting:
```
firebase deploy --only firestore:rules,storage:rules,hosting
```

3) After first run, create any prompted Firestore indexes in the console (notifications userId+isRead, chats jobId+providerId+timestamp, bids providerId collectionGroup, job_posts status+category as needed).

## Stripe Webhook
Set your webhook endpoint to:
```
https://<your-host>/api/payments/webhook
```
Subscribe to at least:
- `setup_intent.succeeded`

## Payment Flow
- Users add a card on `Dashboard → Settings → Payment` via Stripe Elements.
- Server verifies Firebase ID token, creates/looks up Stripe Customer, returns SetupIntent.
- On success, we set `users/{uid}.hasPaymentMethod=true` (webhook also sets as a fallback).
- Job posting is blocked server-side if `hasPaymentMethod` is false.

## Repo Init
```
git init
git add .
git commit -m "Initial import from ServiceHub"
git branch -M main
git remote add origin <your_repo_url>
git push -u origin main
```

## Notes
- Demo imagery is shown only when `NEXT_PUBLIC_DEMO_MODE=true`.
- Genkit AI flows are present; ensure API keys and backend support if enabling them.
