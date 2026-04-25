const cors = require('cors');
const express = require('express');
const { z } = require('zod');

const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

// Allow the same Express app to work behind Firebase Hosting rewrites (where the path keeps `/api/...`)
// and when called directly as a Cloud Function (where the function name is already `api`).
app.use((req, _res, next) => {
  if (req.url === '/api' || req.url.startsWith('/api/')) {
    req.url = req.url.slice('/api'.length) || '/';
  }
  next();
});

const UserIdSchema = z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/i);
const BenefitIdSchema = z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/i);

function asNumber(value, fallback = 0) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function getUserDoc(userId) {
  const ref = db.collection('users').doc(userId);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

async function getClaimsMap(userId) {
  const claimsSnap = await db.collection('users').doc(userId).collection('claims').get();
  const claims = {};
  claimsSnap.forEach((doc) => {
    const d = doc.data() || {};
    claims[doc.id] = asNumber(d.amount, 0);
  });
  return claims;
}

async function getEligibleBenefits(userId) {
  const benefitsSnap = await db.collection('benefits').where('eligibleFor', 'array-contains', userId).get();
  return benefitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getTransactions(userId, limit = 200) {
  const txSnap = await db
    .collection('users')
    .doc(userId)
    .collection('transactions')
    .orderBy('ts', 'desc')
    .limit(limit)
    .get();
  return txSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function computeTopSpend(transactions) {
  const totals = new Map();
  for (const t of transactions) {
    if (t.direction !== 'out') continue;
    const cat = t.category || 'Other';
    const amt = asNumber(t.amount, 0);
    totals.set(cat, (totals.get(cat) || 0) + amt);
  }
  const rows = [...totals.entries()]
    .map(([cat, amount]) => ({ cat, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);
  const totalSpend = rows.reduce((a, b) => a + b.amount, 0) || 1;
  const palette = ['#22C55E', '#EF4444', '#3B82F6'];
  return rows.map((r, idx) => ({
    ...r,
    pct: Math.round((r.amount / totalSpend) * 100),
    color: palette[idx] || '#64748B',
  }));
}

function computeCoachTip(userId, topSpend, claims) {
  if (userId === 'siti') {
    if (topSpend.some((s) => s.cat === 'Medical') && !claims.mysej) {
      return "You're spending RM 180/month on medical. Switch to MySejahtera panel clinic — pay RM 1 instead of RM 30 per visit. Save RM 26/month instantly.";
    }
    if (topSpend.some((s) => s.cat === 'Groceries') && !claims.rahmah) {
      return "On groceries, switch to TNG Pay at Mydin/Giant to activate Rahmah pricing + cashback. You'll save monthly with zero extra effort.";
    }
  }
  if (userId === 'ahmad') {
    if (topSpend.some((s) => s.cat === 'Fuel') && !claims.fuel8) {
      return "Fuel tip: concentrate petrol spend at partner stations with TNG Pay to unlock higher cashback and lift your score faster.";
    }
  }
  return "I'm reviewing your latest transaction patterns to find the best next action for you.";
}

function computeTngScore(baseScore, txCount, claimedCount) {
  const score = baseScore + txCount * 0.8 + claimedCount * 12;
  return Math.max(300, Math.min(850, Math.round(score)));
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/users', async (_req, res) => {
  const snap = await db.collection('users').get();
  const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  res.json({ users });
});

app.get('/users/:userId/profile', async (req, res) => {
  const parsed = UserIdSchema.safeParse(req.params.userId);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid userId' });
  const user = await getUserDoc(parsed.data);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

app.get('/users/:userId/claims', async (req, res) => {
  const parsed = UserIdSchema.safeParse(req.params.userId);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid userId' });
  const claims = await getClaimsMap(parsed.data);
  res.json({ claims });
});

app.post('/users/:userId/claims/:benefitId', async (req, res) => {
  const userIdP = UserIdSchema.safeParse(req.params.userId);
  const benefitIdP = BenefitIdSchema.safeParse(req.params.benefitId);
  if (!userIdP.success) return res.status(400).json({ error: 'Invalid userId' });
  if (!benefitIdP.success) return res.status(400).json({ error: 'Invalid benefitId' });

  const benefitSnap = await db.collection('benefits').doc(benefitIdP.data).get();
  if (!benefitSnap.exists) return res.status(404).json({ error: 'Benefit not found' });
  const benefit = benefitSnap.data() || {};
  const amount = asNumber(benefit.amount, 0);

  await db
    .collection('users')
    .doc(userIdP.data)
    .collection('claims')
    .doc(benefitIdP.data)
    .set(
      {
        amount,
        claimedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  const claims = await getClaimsMap(userIdP.data);
  res.json({ ok: true, claims });
});

app.get('/users/:userId/home', async (req, res) => {
  const userIdP = UserIdSchema.safeParse(req.params.userId);
  if (!userIdP.success) return res.status(400).json({ error: 'Invalid userId' });
  const userId = userIdP.data;

  const user = await getUserDoc(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const [claims, benefits, transactions] = await Promise.all([
    getClaimsMap(userId),
    getEligibleBenefits(userId),
    getTransactions(userId, 500),
  ]);

  const income = asNumber(user.income, 0) || transactions.filter((t) => t.direction === 'in').reduce((a, b) => a + asNumber(b.amount, 0), 0);
  const spend = asNumber(user.spend, 0) || transactions.filter((t) => t.direction === 'out').reduce((a, b) => a + asNumber(b.amount, 0), 0);
  const unclaimedPotential = benefits
    .filter((b) => asNumber(b.amount, 0) > 0 && !claims[b.id])
    .reduce((a, b) => a + asNumber(b.amount, 0), 0);

  const topSpend = computeTopSpend(transactions);
  const coachTip = computeCoachTip(userId, topSpend, claims);
  const tngScore = computeTngScore(asNumber(user.baseScore, 650), transactions.length, Object.keys(claims).length);

  res.json({
    income,
    spend,
    potential: Math.round(unclaimedPotential),
    topSpend,
    coachTip,
    tngScore,
    transactions: transactions.length,
    months: asNumber(user.months, 12),
  });
});

app.get('/users/:userId/benefits', async (req, res) => {
  const userIdP = UserIdSchema.safeParse(req.params.userId);
  if (!userIdP.success) return res.status(400).json({ error: 'Invalid userId' });
  const userId = userIdP.data;

  const user = await getUserDoc(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const [claims, benefits] = await Promise.all([getClaimsMap(userId), getEligibleBenefits(userId)]);

  const list = benefits
    .map((b) => ({
      id: b.id,
      icon: b.icon,
      label: b.label,
      desc: b.desc,
      amount: asNumber(b.amount, 0),
      urgency: b.urgency,
      iconBg: b.iconBg,
      iconColor: b.iconColor,
      claimed: !!claims[b.id],
    }))
    .sort((a, b) => {
      const score = (x) => (x.claimed ? 9 : x.urgency === 'urgent' ? 0 : x.urgency === 'unclaimed' ? 1 : x.urgency === 'available' ? 2 : 5);
      return score(a) - score(b);
    });

  const totalClaimable = list.filter((b) => b.amount > 0).reduce((a, b) => a + b.amount, 0);
  const totalClaimed = Object.values(claims).reduce((a, b) => a + asNumber(b, 0), 0);

  res.json({
    accentColor: user.accentColor || '#7C3AED',
    benefits: list,
    claims,
    totals: {
      claimable: totalClaimable,
      claimed: totalClaimed,
      claimedCount: Object.keys(claims).length,
    },
  });
});

app.get('/users/:userId/budget', async (req, res) => {
  const userIdP = UserIdSchema.safeParse(req.params.userId);
  if (!userIdP.success) return res.status(400).json({ error: 'Invalid userId' });
  const userId = userIdP.data;

  const user = await getUserDoc(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const [claims, transactions, benefits] = await Promise.all([
    getClaimsMap(userId),
    getTransactions(userId, 500),
    getEligibleBenefits(userId),
  ]);

  const income = asNumber(user.income, 0) || transactions.filter((t) => t.direction === 'in').reduce((a, b) => a + asNumber(b.amount, 0), 0);
  const spendByCat = new Map();
  for (const t of transactions) {
    if (t.direction !== 'out') continue;
    const cat = t.category || 'Other';
    spendByCat.set(cat, (spendByCat.get(cat) || 0) + asNumber(t.amount, 0));
  }

  // Provide stable ordering that matches the UI design.
  const orderedCats = userId === 'ahmad'
    ? ['Rent', 'Fuel', 'Food', 'Prepaid', 'eCommerce', 'Utilities']
    : ['Rent', 'Groceries', 'Medical', 'Transport', 'Utilities'];

  const iconMap = {
    Rent: '🏠 Rent',
    Groceries: '🛒 Groceries',
    Medical: '🏥 Medical',
    Transport: '🚌 Transport',
    Utilities: '⚡ Utilities',
    Fuel: '⛽ Fuel',
    Food: '🍜 Food',
    Prepaid: '📱 Prepaid',
    eCommerce: '🛒 eCommerce',
    Other: '• Other',
  };

  const lines = orderedCats
    .filter((c) => spendByCat.has(c))
    .map((cat) => {
      const amount = asNumber(spendByCat.get(cat), 0);
      const savingId =
        cat === 'Groceries' ? 'rahmah' :
        cat === 'Medical' ? 'mysej' :
        cat === 'Utilities' ? 'tnb' :
        cat === 'Fuel' ? (userId === 'ahmad' ? 'fuel8' : 'fuel') :
        null;
      const saving = savingId ? Math.round(asNumber(benefits.find((b) => b.id === savingId)?.savingMonthly, 0)) : 0;
      return { cat: iconMap[cat] || cat, amount, savingId, saving };
    });

  const budgetBenefits = benefits
    .filter((b) => asNumber(b.amount, 0) >= 0)
    .map((b) => ({
      id: b.id,
      label: b.budgetLabel || b.label,
      amount: asNumber(b.amount, 0),
    }));

  res.json({
    income,
    lines,
    benefits: budgetBenefits,
    claims,
  });
});

app.get('/users/:userId/finance', async (req, res) => {
  const userIdP = UserIdSchema.safeParse(req.params.userId);
  if (!userIdP.success) return res.status(400).json({ error: 'Invalid userId' });
  const userId = userIdP.data;

  const user = await getUserDoc(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const [claims, transactions] = await Promise.all([
    getClaimsMap(userId),
    getTransactions(userId, 500),
  ]);

  const totalClaimed = Object.values(claims).reduce((a, b) => a + asNumber(b, 0), 0);
  const benefitLift = Math.min(250, totalClaimed * 2);
  const baseLimit = asNumber(user.baseLimit, 850);
  const boostedLimit = asNumber(user.boostedLimit, 1450);
  const limit = Math.min(boostedLimit, baseLimit + benefitLift);
  const repayment = Math.round(limit / 6);
  const tngScore = computeTngScore(asNumber(user.baseScore, 650), transactions.length, Object.keys(claims).length);

  res.json({
    income: asNumber(user.income, 0),
    spend: asNumber(user.spend, 0),
    tngScore,
    ctos: user.ctos ?? null,
    ccris: user.ccris ?? null,
    transactions: transactions.length,
    months: asNumber(user.months, 12),
    baseLimit,
    boostedLimit,
    limit,
    repayment,
    risk: user.risk || 'Alternative data approved',
    status: user.status || 'No CTOS or CCRIS file yet',
    product: user.product || 'Essential Cash Advance',
    purpose: user.purpose || 'School fees, clinic visits, groceries',
    reasons: Array.isArray(user.reasons) ? user.reasons : [],
    suggestions: Array.isArray(user.suggestions) ? user.suggestions : [],
  });
});

exports.api = onRequest({ cors: true }, app);
