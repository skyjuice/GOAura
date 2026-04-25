import { collection, doc, getDoc, getDocs, limit as qLimit, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../firebase.js'

const API_BASE = import.meta.env.VITE_GOAURA_API_BASE || ''

async function requestJson(path, options) {
  if (!API_BASE) {
    throw new Error('API base not configured')
  }

  const url = API_BASE.startsWith('http') ? `${API_BASE}${path}` : `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'content-type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${res.statusText}: ${text || 'request failed'}`);
  }

  return res.json();
}

function asNumber(value, fallback = 0) {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function computeTopSpend(transactions) {
  const totals = new Map()
  for (const t of transactions) {
    if (t.direction !== 'out') continue
    const cat = t.category || 'Other'
    const amt = asNumber(t.amount, 0)
    totals.set(cat, (totals.get(cat) || 0) + amt)
  }
  const rows = [...totals.entries()]
    .map(([cat, amount]) => ({ cat, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
  const totalSpend = rows.reduce((a, b) => a + b.amount, 0) || 1
  const palette = ['#22C55E', '#EF4444', '#3B82F6']
  return rows.map((r, idx) => ({
    ...r,
    pct: Math.round((r.amount / totalSpend) * 100),
    color: palette[idx] || '#64748B',
  }))
}

function computeCoachTip(userId, topSpend, claims) {
  if (userId === 'siti') {
    if (topSpend.some((s) => s.cat === 'Medical') && !claims.mysej) {
      return "You're spending RM 180/month on medical. Switch to MySejahtera panel clinic — pay RM 1 instead of RM 30 per visit. Save RM 26/month instantly."
    }
    if (topSpend.some((s) => s.cat === 'Groceries') && !claims.rahmah) {
      return "On groceries, switch to TNG Pay at Mydin/Giant to activate Rahmah pricing + cashback. You'll save monthly with zero extra effort."
    }
  }
  if (userId === 'ahmad') {
    if (topSpend.some((s) => s.cat === 'Fuel') && !claims.fuel8) {
      return "Fuel tip: concentrate petrol spend at partner stations with TNG Pay to unlock higher cashback and lift your score faster."
    }
  }
  return "I'm reviewing your latest transaction patterns to find the best next action for you."
}

function computeTngScore(baseScore, txCount, claimedCount) {
  const score = baseScore + txCount * 0.8 + claimedCount * 12
  return Math.max(300, Math.min(1000, Math.round(score)))
}

async function fsGetClaims(userId) {
  const snap = await getDocs(collection(db, 'users', userId, 'claims'))
  const claims = {}
  snap.forEach((d) => { claims[d.id] = asNumber(d.data()?.amount, 0) })
  return { claims }
}

async function fsGetBenefits(userId) {
  const [claimsRes, benefitsSnap] = await Promise.all([
    fsGetClaims(userId),
    getDocs(query(collection(db, 'benefits'), where('eligibleFor', 'array-contains', userId))),
  ])
  const claims = claimsRes.claims || {}
  const benefits = benefitsSnap.docs.map((d) => ({ id: d.id, ...d.data(), claimed: !!claims[d.id] }))
  const totalClaimable = benefits.filter((b) => asNumber(b.amount, 0) > 0).reduce((a, b) => a + asNumber(b.amount, 0), 0)
  const totalClaimed = Object.values(claims).reduce((a, b) => a + asNumber(b, 0), 0)
  return {
    benefits,
    claims,
    totals: { claimable: totalClaimable, claimed: totalClaimed, claimedCount: Object.keys(claims).length },
  }
}

async function fsGetTransactions(userId) {
  const txSnap = await getDocs(
    query(collection(db, 'users', userId, 'transactions'), orderBy('ts', 'desc'), qLimit(500))
  )
  return txSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

async function fsGetHome(userId) {
  const [userSnap, claimsRes, benefitsRes, transactions] = await Promise.all([
    getDoc(doc(db, 'users', userId)),
    fsGetClaims(userId),
    fsGetBenefits(userId),
    fsGetTransactions(userId),
  ])
  if (!userSnap.exists()) {
    throw new Error(`Firestore missing users/${userId}. Run npm run seed:cloud first.`)
  }
  const user = userSnap.data() || {}
  const claims = claimsRes.claims || {}
  const benefits = benefitsRes.benefits || []

  const income = asNumber(user.income, 0)
  const spend = asNumber(user.spend, 0)
  const unclaimedPotential = benefits
    .filter((b) => asNumber(b.amount, 0) > 0 && !claims[b.id])
    .reduce((a, b) => a + asNumber(b.amount, 0), 0)

  const topSpend = computeTopSpend(transactions)
  const coachTip = computeCoachTip(userId, topSpend, claims)
  const tngScore = computeTngScore(asNumber(user.baseScore, 650), transactions.length, Object.keys(claims).length)

  return {
    income,
    spend,
    potential: Math.round(unclaimedPotential),
    topSpend,
    coachTip,
    tngScore,
    transactions: transactions.length,
    months: asNumber(user.months, 12),
  }
}

async function fsClaimBenefit(userId, benefitId) {
  const benefitSnap = await getDoc(doc(db, 'benefits', benefitId))
  const benefit = benefitSnap.data()
  if (!benefit) throw new Error('Benefit not found')
  const amount = asNumber(benefit.amount, 0)
  await setDoc(
    doc(db, 'users', userId, 'claims', benefitId),
    { amount, claimedAt: serverTimestamp() },
    { merge: true }
  )
  return fsGetClaims(userId)
}

async function fsGetBudget(userId) {
  const [userSnap, claimsRes, transactions, benefitsRes] = await Promise.all([
    getDoc(doc(db, 'users', userId)),
    fsGetClaims(userId),
    fsGetTransactions(userId),
    getDocs(query(collection(db, 'benefits'), where('eligibleFor', 'array-contains', userId))),
  ])
  if (!userSnap.exists()) {
    throw new Error(`Firestore missing users/${userId}. Run npm run seed:cloud first.`)
  }
  const user = userSnap.data() || {}
  const claims = claimsRes.claims || {}
  const benefits = benefitsRes.docs.map((d) => ({ id: d.id, ...d.data() }))

  const spendByCat = new Map()
  for (const t of transactions) {
    if (t.direction !== 'out') continue
    const cat = t.category || 'Other'
    spendByCat.set(cat, (spendByCat.get(cat) || 0) + asNumber(t.amount, 0))
  }

  const orderedCats = userId === 'ahmad'
    ? ['Rent', 'Fuel', 'Food', 'Prepaid', 'eCommerce', 'Utilities']
    : ['Rent', 'Groceries', 'Medical', 'Transport', 'Utilities']

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
  }

  const lines = orderedCats
    .filter((c) => spendByCat.has(c))
    .map((cat) => {
      const amount = asNumber(spendByCat.get(cat), 0)
      const savingId =
        cat === 'Groceries' ? 'rahmah' :
        cat === 'Medical' ? 'mysej' :
        cat === 'Utilities' ? 'tnb' :
        cat === 'Fuel' ? (userId === 'ahmad' ? 'fuel8' : 'fuel') :
        null
      const saving = savingId ? Math.round(asNumber(benefits.find((b) => b.id === savingId)?.savingMonthly, 0)) : 0
      return { cat: iconMap[cat] || cat, amount, savingId, saving }
    })

  const budgetBenefits = benefits.map((b) => ({
    id: b.id,
    label: b.budgetLabel || b.label,
    amount: asNumber(b.amount, 0),
  }))

  return { income: asNumber(user.income, 0), lines, benefits: budgetBenefits, claims }
}

async function fsGetFinance(userId) {
  const [userSnap, claimsRes, transactions] = await Promise.all([
    getDoc(doc(db, 'users', userId)),
    fsGetClaims(userId),
    fsGetTransactions(userId),
  ])
  if (!userSnap.exists()) {
    throw new Error(`Firestore missing users/${userId}. Run npm run seed:cloud first.`)
  }
  const user = userSnap.data() || {}
  const claims = claimsRes.claims || {}
  const totalClaimed = Object.values(claims).reduce((a, b) => a + asNumber(b, 0), 0)
  const benefitLift = Math.min(250, totalClaimed * 2)
  const baseLimit = asNumber(user.baseLimit, 1000)
  const boostedLimit = asNumber(user.boostedLimit, 1450)
  const limit = Math.min(boostedLimit, baseLimit + benefitLift)
  const repayment = Math.round(limit / 6)
  const tngScore = computeTngScore(asNumber(user.baseScore, 650), transactions.length, Object.keys(claims).length)

  return {
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
  }
}

export async function apiGetHome(userId) {
  if (!API_BASE) return fsGetHome(userId)
  return requestJson(`/users/${encodeURIComponent(userId)}/home`).catch((err) => {
    console.warn('API failed; falling back to Firestore:', err?.message || err)
    return fsGetHome(userId)
  })
}

export function apiGetClaims(userId) {
  if (!API_BASE) return fsGetClaims(userId)
  return requestJson(`/users/${encodeURIComponent(userId)}/claims`).catch(() => fsGetClaims(userId))
}

export function apiGetBenefits(userId) {
  if (!API_BASE) return fsGetBenefits(userId)
  return requestJson(`/users/${encodeURIComponent(userId)}/benefits`).catch(() => fsGetBenefits(userId))
}

export function apiClaimBenefit(userId, benefitId) {
  if (!API_BASE) return fsClaimBenefit(userId, benefitId)
  return requestJson(`/users/${encodeURIComponent(userId)}/claims/${encodeURIComponent(benefitId)}`, {
    method: 'POST',
    body: JSON.stringify({}),
  }).catch(() => fsClaimBenefit(userId, benefitId))
}

export function apiGetBudget(userId) {
  if (!API_BASE) return fsGetBudget(userId)
  return requestJson(`/users/${encodeURIComponent(userId)}/budget`).catch(() => fsGetBudget(userId))
}

export function apiGetFinance(userId) {
  if (!API_BASE) return fsGetFinance(userId)
  return requestJson(`/users/${encodeURIComponent(userId)}/finance`).catch(() => fsGetFinance(userId))
}
