import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { verifyIdToken } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500 });
  }
  const stripe = new Stripe(secretKey);
  try {
    const authHeader = req.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    const decoded = await verifyIdToken(idToken);
    const uid = decoded.uid;

    // Retrieve or create Stripe customer for this user
    const db = getFirestore();
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return new Response(JSON.stringify({ error: 'User profile not found' }), { status: 404 });
    const userData = userSnap.data() as any;
    let stripeCustomerId = userData.stripeCustomerId as string | undefined;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        name: userData.name,
        metadata: { uid },
      });
      stripeCustomerId = customer.id;
      await userRef.update({ stripeCustomerId });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      usage: 'off_session',
      payment_method_types: ['card'],
    });
    return new Response(JSON.stringify({ clientSecret: setupIntent.client_secret }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Failed to create SetupIntent' }), { status: 400 });
  }
}

