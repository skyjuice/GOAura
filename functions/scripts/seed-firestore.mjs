import admin from 'firebase-admin';

const projectId = process.env.GCLOUD_PROJECT || 'goaura-3265d';

function initAdmin() {
  // Emulator: set FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
  // Production: requires valid credentials (e.g. via `gcloud auth application-default login`).
  admin.initializeApp({ projectId });

  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
  if (emulatorHost) {
    const [host, portStr] = emulatorHost.split(':');
    const port = Number(portStr || '8080');
    admin.firestore().settings({ host: `${host}:${port}`, ssl: false });
  }
}

initAdmin();
const db = admin.firestore();

function tsDaysAgo(daysAgo) {
  return admin.firestore.Timestamp.fromDate(new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000));
}

async function upsertDoc(ref, data) {
  await ref.set(data, { merge: true });
}

async function seedUsers() {
  const users = [
    {
      id: 'siti',
      name: 'Siti, 35',
      badge: 'B40 Household',
      role: 'B40 · Single Parent · Klang',
      accentColor: '#7C3AED',
      dotColor: '#A78BFA',
      months: 12,
      income: 2100,
      spend: 1650,
      baseScore: 670,
      baseLimit: 850,
      boostedLimit: 1450,
      ctos: null,
      ccris: null,
      risk: 'Alternative data approved',
      status: 'No CTOS or CCRIS file yet',
      product: 'Essential Cash Advance',
      purpose: 'School fees, clinic visits, groceries',
      reasons: [
        'Consistent monthly wallet inflow around RM 2,100',
        '180 TNG Pay transactions across 12 months',
        'Benefits claimed can improve free cash flow before repayment'
      ],
      suggestions: [
        'Pay TNB and telco bills with TNG for 3 straight months',
        'Activate Rahmah grocery cashback to reduce expense ratio',
        'Keep wallet balance above RM 120 before month end'
      ]
    },
    {
      id: 'ahmad',
      name: 'Ahmad, 28',
      badge: 'Unbanked · Gig Worker',
      role: 'Grab Driver · No Bank Account',
      accentColor: '#F59E0B',
      dotColor: '#FCD34D',
      months: 18,
      income: 3200,
      spend: 2100,
      baseScore: 690,
      baseLimit: 1200,
      boostedLimit: 2300,
      ctos: 548,
      ccris: 'Watchlist',
      risk: 'Blacklisted recovery path',
      status: 'Bank score weak, TNG score usable',
      product: 'Gig Worker Micro Financing',
      purpose: 'Fuel float, vehicle repairs, insurance renewal',
      reasons: [
        '340 mobility and wallet transactions show stable gig income',
        'Fuel spend pattern matches active Grab driver profile',
        'TNG repayment behaviour can rebuild formal credit readiness'
      ],
      suggestions: [
        'Repay RM 300 micro-credit early to lift TNG Score faster',
        'Route Grab cash-outs into TNG wallet for stronger income proof',
        'Settle overdue telco balance before applying to partner banks'
      ]
    }
  ];

  await Promise.all(
    users.map((u) => upsertDoc(db.collection('users').doc(u.id), { ...u, updatedAt: admin.firestore.FieldValue.serverTimestamp() }))
  );
}

async function seedBenefits() {
  const benefits = [
    {
      id: 'mysej',
      eligibleFor: ['siti'],
      icon: 'M',
      label: 'MySejahtera Panel Clinic',
      desc: 'RM 30 → RM 1 per visit · 12 clinics near Klang',
      amount: 28,
      urgency: 'urgent',
      iconBg: '#FEE2E2',
      iconColor: '#991B1B',
      savingMonthly: 26,
      budgetLabel: '💊 MySejahtera savings'
    },
    {
      id: 'bsh',
      eligibleFor: ['siti'],
      icon: 'B',
      label: 'BSH Child Supplement',
      desc: 'RM 240/yr · 2 children · Pre-filled from MyKad',
      amount: 20,
      urgency: 'unclaimed',
      iconBg: '#F5F3FF',
      iconColor: '#5B21B6',
      savingMonthly: 0,
      budgetLabel: '👧 BSH child aid'
    },
    {
      id: 'rahmah',
      eligibleFor: ['siti'],
      icon: 'R',
      label: 'Rahmah Menu Cashback',
      desc: '3% on grocery TNG Pay · RM 15.60/mo auto',
      amount: 15,
      urgency: 'active',
      iconBg: '#DCFCE7',
      iconColor: '#166534',
      savingMonthly: 15,
      budgetLabel: '🛒 Rahmah cashback'
    },
    {
      id: 'tnb',
      eligibleFor: ['siti'],
      icon: 'T',
      label: 'TNB B40 Electricity Rebate',
      desc: 'RM 30/mo · Pay TNB via TNG to trigger',
      amount: 30,
      urgency: 'available',
      iconBg: '#EFF6FF',
      iconColor: '#1E40AF',
      savingMonthly: 30,
      budgetLabel: '⚡ TNB rebate'
    },
    {
      id: 'fuel',
      eligibleFor: ['siti'],
      icon: 'F',
      label: 'Fuel Cashback 5%',
      desc: 'Auto-applied on all petrol TNG Pay txns',
      amount: 15,
      urgency: 'available',
      iconBg: '#FEF3C7',
      iconColor: '#92400E',
      savingMonthly: 15,
      budgetLabel: '⛽ Fuel cashback'
    },
    {
      id: 'fuel8',
      eligibleFor: ['ahmad'],
      icon: 'F',
      label: 'Fuel Cashback 8%',
      desc: 'PETRONAS Shell · TNG Pay · Auto-applied',
      amount: 54,
      urgency: 'active',
      iconBg: '#FEF3C7',
      iconColor: '#92400E',
      savingMonthly: 54,
      budgetLabel: '⛽ Fuel cashback 8%'
    },
    {
      id: 'pa',
      eligibleFor: ['ahmad'],
      icon: 'P',
      label: 'Personal Accident Cover',
      desc: 'RM 10,000 · Free for 100+ txn users',
      amount: 0,
      urgency: 'active',
      iconBg: '#F5F3FF',
      iconColor: '#5B21B6',
      savingMonthly: 0,
      budgetLabel: '🛡️ PA cover value'
    },
    {
      id: 'micro',
      eligibleFor: ['ahmad'],
      icon: 'C',
      label: 'Micro-Credit RM 300',
      desc: 'Repay via wallet · Builds TNG Score',
      amount: 300,
      urgency: 'available',
      iconBg: '#DCFCE7',
      iconColor: '#166534',
      savingMonthly: 0,
      budgetLabel: '💳 Micro-credit saved'
    },
    {
      id: 'invest',
      eligibleFor: ['ahmad'],
      icon: 'I',
      label: 'Micro-Invest from RM 1',
      desc: 'Round-up savings on every transaction',
      amount: 12,
      urgency: 'available',
      iconBg: '#EFF6FF',
      iconColor: '#1E40AF',
      savingMonthly: 12,
      budgetLabel: '📈 Micro-invest earn'
    },
    {
      id: 'bank',
      eligibleFor: ['ahmad'],
      icon: 'B',
      label: 'Bank Account Referral',
      desc: 'TNG Score 750+ → Pre-approved by partners',
      amount: 0,
      urgency: 'locked',
      iconBg: '#F3F4F6',
      iconColor: '#9CA3AF',
      savingMonthly: 0,
      budgetLabel: '🏦 Bank referral'
    }
  ];

  await Promise.all(
    benefits.map((b) => upsertDoc(db.collection('benefits').doc(b.id), { ...b, updatedAt: admin.firestore.FieldValue.serverTimestamp() }))
  );
}

async function seedTransactions() {
  const sitiTx = [
    { direction: 'in',  category: 'Income',    merchant: 'Grab Wallet Cash-out', amount: 2100, ts: tsDaysAgo(14) },
    { direction: 'out', category: 'Rent',      merchant: 'Landlord Transfer',    amount: 600,  ts: tsDaysAgo(13) },
    { direction: 'out', category: 'Groceries', merchant: 'Mydin',                amount: 180,  ts: tsDaysAgo(12) },
    { direction: 'out', category: 'Groceries', merchant: 'Giant',                amount: 340,  ts: tsDaysAgo(11) },
    { direction: 'out', category: 'Medical',   merchant: 'Klinik Maju',          amount: 60,   ts: tsDaysAgo(10) },
    { direction: 'out', category: 'Medical',   merchant: 'Pharmacy',             amount: 120,  ts: tsDaysAgo(9) },
    { direction: 'out', category: 'Transport', merchant: 'RapidKL',              amount: 50,   ts: tsDaysAgo(8) },
    { direction: 'out', category: 'Transport', merchant: 'Grab',                 amount: 90,   ts: tsDaysAgo(7) },
    { direction: 'out', category: 'Utilities', merchant: 'TNB',                  amount: 210,  ts: tsDaysAgo(6) },
    { direction: 'out', category: 'Food',      merchant: 'Warung',               amount: 0,    ts: tsDaysAgo(5) }
  ];

  const ahmadTx = [
    { direction: 'in',  category: 'Income',    merchant: 'Grab Wallet Cash-out', amount: 3200, ts: tsDaysAgo(14) },
    { direction: 'out', category: 'Rent',      merchant: 'Room Rent',            amount: 800,  ts: tsDaysAgo(13) },
    { direction: 'out', category: 'Fuel',      merchant: 'PETRONAS',             amount: 380,  ts: tsDaysAgo(12) },
    { direction: 'out', category: 'Fuel',      merchant: 'Shell',                amount: 300,  ts: tsDaysAgo(11) },
    { direction: 'out', category: 'Food',      merchant: 'Mamaks',               amount: 120,  ts: tsDaysAgo(10) },
    { direction: 'out', category: 'Food',      merchant: 'Kopitiam',             amount: 190,  ts: tsDaysAgo(9) },
    { direction: 'out', category: 'Prepaid',   merchant: 'Celcom',               amount: 80,   ts: tsDaysAgo(8) },
    { direction: 'out', category: 'eCommerce', merchant: 'Shopee',               amount: 140,  ts: tsDaysAgo(7) },
    { direction: 'out', category: 'eCommerce', merchant: 'Lazada',               amount: 70,   ts: tsDaysAgo(6) },
    { direction: 'out', category: 'Utilities', merchant: 'Unifi',                amount: 20,   ts: tsDaysAgo(5) }
  ];

  const batches = [
    { userId: 'siti', txns: sitiTx },
    { userId: 'ahmad', txns: ahmadTx }
  ];

  for (const { userId, txns } of batches) {
    const col = db.collection('users').doc(userId).collection('transactions');
    const writeBatch = db.batch();
    txns.forEach((t, idx) => {
      const id = String(idx + 1).padStart(2, '0');
      writeBatch.set(col.doc(id), { ...t, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    });
    await writeBatch.commit();
  }
}

async function main() {
  await seedUsers();
  await seedBenefits();
  await seedTransactions();
}

await main();
// eslint-disable-next-line no-console
console.log(`Seeded Firestore for project "${projectId}".`);

