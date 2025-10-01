import { NextRequest } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500 });
  }
  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });
  try {
    const { customerId } = await req.json();
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
      payment_method_types: ['card'],
    });
    return new Response(JSON.stringify({ clientSecret: setupIntent.client_secret }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Failed to create SetupIntent' }), { status: 400 });
  }
}

