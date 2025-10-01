import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !endpointSecret) {
    return new Response('Stripe not configured', { status: 500 });
  }
  const stripe = new Stripe(secretKey);
  const sig = req.headers.get('stripe-signature') || '';
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'setup_intent.succeeded') {
    const si = event.data.object as Stripe.SetupIntent;
    const customerId = si.customer as string;
    if (customerId) {
      const db = getFirestore();
      // Optional: mark hasPaymentMethod true for any user matching this customerId
      const snap = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({ hasPaymentMethod: true });
      }
    }
  }

  return new Response('OK', { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

