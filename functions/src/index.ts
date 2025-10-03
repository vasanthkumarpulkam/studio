import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();
const db = admin.firestore();

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
const stripe = new Stripe(STRIPE_SECRET || '', { apiVersion: '2023-10-16' } as any);

// Helper to charge a percent fee
async function chargeFee(customerId: string, amountCents: number, metadata: Record<string,string>) {
  if (!STRIPE_SECRET) throw new Error('Stripe secret not configured');
  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'usd',
    customer: customerId,
    confirm: true,
    off_session: true,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
  return intent;
}

// onUserCreated: scaffold profile doc (defensive)
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const userRef = db.collection('users').doc(user.uid);
  const existing = await userRef.get();
  if (!existing.exists) {
    await userRef.set({
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      role: 'customer',
      language: 'en',
      joinedOn: new Date().toISOString(),
      status: 'active',
      hasPaymentMethod: false,
    }, { merge: true });
  }
});

// onBidAccepted: set job status and reject others, create/upgrade chat thread
export const onBidAccepted = functions.firestore
  .document('job_posts/{jobId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after) return;
    if (before.acceptedBid === after.acceptedBid) return;
    const jobId = context.params.jobId;
    const acceptedBidId = after.acceptedBid;
    if (!acceptedBidId) return;

    // Set status to pending-confirmation
    await change.after.ref.update({ status: 'pending-confirmation' });

    // Reject other bids
    const bidsSnap = await change.after.ref.collection('bids').get();
    const batch = db.batch();
    bidsSnap.forEach((doc) => {
      if (doc.id !== acceptedBidId) batch.update(doc.ref, { status: 'rejected' });
      else batch.update(doc.ref, { status: 'accepted' });
    });
    await batch.commit();

    // Create chat thread placeholder (one thread per awarded pair)
    const acceptedBid = (await change.after.ref.collection('bids').doc(acceptedBidId).get()).data() as any;
    if (acceptedBid) {
      const posterUid = after.postedBy;
      const providerUid = acceptedBid.providerId;
      const participants = [posterUid, providerUid].sort();
      const threadId = `${jobId}__${participants.join('_')}`;
      await db.collection('chats').doc(threadId).set({ jobId, participants, lastMessageAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    }
  });

// onJobCompleted: compute and charge platform fee from both sides
export const onJobCompleted = functions.firestore
  .document('job_posts/{jobId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after) return;
    if (before.status === 'completed' || after.status !== 'completed') return;

    const jobId = context.params.jobId;
    const postedBy = after.postedBy as string;
    const acceptedBidId = after.acceptedBid as string | undefined;
    if (!acceptedBidId) return;
    const bidSnap = await change.after.ref.collection('bids').doc(acceptedBidId).get();
    const bid = bidSnap.data() as any;
    if (!bid) return;

    const feePercent = 0.10;
    const amount = Math.round((bid.amount || 0) * 100);
    const feeAmount = Math.round(amount * feePercent);

    const feeRecordRef = db.collection('fees').doc();
    await feeRecordRef.set({
      jobId,
      customerUid: postedBy,
      providerUid: bid.providerId,
      percentCustomer: feePercent,
      percentProvider: feePercent,
      amountCustomer: feeAmount / 100,
      amountProvider: feeAmount / 100,
      status: 'pending',
      attempts: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await chargeBothSides(feeRecordRef.id);
  });

async function chargeBothSides(feeId: string) {
  const ref = db.collection('fees').doc(feeId);
  const snap = await ref.get();
  const fee = snap.data() as any;
  if (!fee) return;

  try {
    const [customerStripeId, providerStripeId] = await Promise.all([
      getStripeCustomerId(fee.customerUid),
      getStripeCustomerId(fee.providerUid),
    ]);

    const [chargeCustomer, chargeProvider] = await Promise.all([
      chargeFee(customerStripeId, Math.round(fee.amountCustomer * 100), { role: 'customer', jobId: fee.jobId, feeId: ref.id }),
      chargeFee(providerStripeId, Math.round(fee.amountProvider * 100), { role: 'provider', jobId: fee.jobId, feeId: ref.id }),
    ]);

    await ref.update({
      status: 'charged',
      receipts: { customer: chargeCustomer.id, provider: chargeProvider.id },
      lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
      attempts: admin.firestore.FieldValue.increment(1),
    });
  } catch (e) {
    await ref.update({
      status: 'failed',
      lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
      attempts: admin.firestore.FieldValue.increment(1),
    });
  }
}

async function getStripeCustomerId(uid: string): Promise<string> {
  const userRef = db.collection('users').doc(uid);
  const user = (await userRef.get()).data() as any;
  if (user?.stripeCustomerId) return user.stripeCustomerId as string;
  if (!STRIPE_SECRET) throw new Error('Stripe secret not configured');
  const customer = await stripe.customers.create({
    email: user?.email,
    name: user?.name,
    metadata: { uid },
  });
  await userRef.update({ stripeCustomerId: customer.id });
  return customer.id;
}

// Scheduled retry for failed fees
export const retryFailedFees = functions.pubsub.schedule('every 6 hours').onRun(async () => {
  const q = await db.collection('fees').where('status', '==', 'failed').where('attempts', '<', 3).get();
  const promises: Promise<any>[] = [];
  q.forEach(doc => promises.push(chargeBothSides(doc.id)));
  await Promise.all(promises);
});

