import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';

// Uses the provided web credentials (from `src/firebase.js` / Firebase Console).
const firebaseConfig = {
  apiKey: "AIzaSyCtzYfQgh2FjD0Bx4qMXef_pRidh8fjBQs",
  authDomain: "goaura-3265d.firebaseapp.com",
  projectId: "goaura-3265d",
  storageBucket: "goaura-3265d.firebasestorage.app",
  messagingSenderId: "776019690907",
  appId: "1:776019690907:web:75fcbc47fade8999744d3e",
  measurementId: "G-YZBFSX1F1W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
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
      ],
      updatedAt: serverTimestamp()
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
      ],
      updatedAt: serverTimestamp()
    }
  ];

  await Promise.all(users.map((u) => setDoc(doc(db, 'users', u.id), u, { merge: true })));
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
      budgetLabel: '💊 MySejahtera savings',
      updatedAt: serverTimestamp()
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
      budgetLabel: '👧 BSH child aid',
      updatedAt: serverTimestamp()
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
      budgetLabel: '🛒 Rahmah cashback',
      updatedAt: serverTimestamp()
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
      budgetLabel: '⚡ TNB rebate',
      updatedAt: serverTimestamp()
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
      budgetLabel: '⛽ Fuel cashback',
      updatedAt: serverTimestamp()
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
      budgetLabel: '⛽ Fuel cashback 8%',
      updatedAt: serverTimestamp()
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
      budgetLabel: '🛡️ PA cover value',
      updatedAt: serverTimestamp()
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
      budgetLabel: '💳 Micro-credit saved',
      updatedAt: serverTimestamp()
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
      budgetLabel: '📈 Micro-invest earn',
      updatedAt: serverTimestamp()
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
      budgetLabel: '🏦 Bank referral',
      updatedAt: serverTimestamp()
    }
  ];

  await Promise.all(benefits.map((b) => setDoc(doc(db, 'benefits', b.id), b, { merge: true })));
}

async function seedTransactions() {
  const sitiTx = [
    { direction: 'in',  category: 'Income',    merchant: 'Grab Wallet Cash-out', amount: 2100, ts: daysAgo(14) },
    { direction: 'out', category: 'Rent',      merchant: 'Landlord Transfer',    amount: 600,  ts: daysAgo(13) },
    { direction: 'out', category: 'Groceries', merchant: 'Mydin',                amount: 180,  ts: daysAgo(12) },
    { direction: 'out', category: 'Groceries', merchant: 'Giant',                amount: 340,  ts: daysAgo(11) },
    { direction: 'out', category: 'Medical',   merchant: 'Klinik Maju',          amount: 60,   ts: daysAgo(10) },
    { direction: 'out', category: 'Medical',   merchant: 'Pharmacy',             amount: 120,  ts: daysAgo(9) },
    { direction: 'out', category: 'Transport', merchant: 'RapidKL',              amount: 50,   ts: daysAgo(8) },
    { direction: 'out', category: 'Transport', merchant: 'Grab',                 amount: 90,   ts: daysAgo(7) },
    { direction: 'out', category: 'Utilities', merchant: 'TNB',                  amount: 210,  ts: daysAgo(6) },
    { direction: 'out', category: 'Food',      merchant: 'Warung',               amount: 110,  ts: daysAgo(5) }
  ];

  const ahmadTx = [
    { direction: 'in',  category: 'Income',    merchant: 'Grab Wallet Cash-out', amount: 3200, ts: daysAgo(14) },
    { direction: 'out', category: 'Rent',      merchant: 'Room Rent',            amount: 800,  ts: daysAgo(13) },
    { direction: 'out', category: 'Fuel',      merchant: 'PETRONAS',             amount: 380,  ts: daysAgo(12) },
    { direction: 'out', category: 'Fuel',      merchant: 'Shell',                amount: 300,  ts: daysAgo(11) },
    { direction: 'out', category: 'Food',      merchant: 'Mamaks',               amount: 120,  ts: daysAgo(10) },
    { direction: 'out', category: 'Food',      merchant: 'Kopitiam',             amount: 190,  ts: daysAgo(9) },
    { direction: 'out', category: 'Prepaid',   merchant: 'Celcom',               amount: 80,   ts: daysAgo(8) },
    { direction: 'out', category: 'eCommerce', merchant: 'Shopee',               amount: 140,  ts: daysAgo(7) },
    { direction: 'out', category: 'eCommerce', merchant: 'Lazada',               amount: 70,   ts: daysAgo(6) },
    { direction: 'out', category: 'Utilities', merchant: 'Unifi',                amount: 20,   ts: daysAgo(5) }
  ];

  const writeUserTx = async (userId, txns) => {
    const batch = writeBatch(db);
    const col = collection(db, 'users', userId, 'transactions');
    txns.forEach((t, idx) => {
      const id = String(idx + 1).padStart(2, '0');
      batch.set(doc(col, id), { ...t, updatedAt: serverTimestamp() }, { merge: true });
    });
    await batch.commit();
  };

  await writeUserTx('siti', sitiTx);
  await writeUserTx('ahmad', ahmadTx);
}

async function main() {
  await seedUsers();
  await seedBenefits();
  await seedTransactions();
}

await main();
// eslint-disable-next-line no-console
console.log('Seeded Firestore via client SDK.');
