import React, { useMemo, useState } from 'react'
import './FinanceScreen.css'

const FINANCE_DATA = {
  siti: {
    income: 2100,
    spend: 1650,
    tngScore: 698,
    ctos: null,
    ccris: null,
    transactions: 180,
    months: 12,
    baseLimit: 850,
    boostedLimit: 1450,
    risk: 'Alternative data approved',
    status: 'No CTOS or CCRIS file yet',
    product: 'Essential Cash Advance',
    purpose: 'School fees, clinic visits, groceries',
    reasons: [
      'Consistent monthly wallet inflow around RM 2,100',
      '180 TNG Pay transactions across 12 months',
      'Benefits claimed can improve free cash flow before repayment',
    ],
    suggestions: [
      'Pay TNB and telco bills with TNG for 3 straight months',
      'Activate Rahmah grocery cashback to reduce expense ratio',
      'Keep wallet balance above RM 120 before month end',
    ],
  },
  ahmad: {
    income: 3200,
    spend: 2100,
    tngScore: 714,
    ctos: 548,
    ccris: 'Watchlist',
    transactions: 340,
    months: 18,
    baseLimit: 1200,
    boostedLimit: 2300,
    risk: 'Blacklisted recovery path',
    status: 'Bank score weak, TNG score usable',
    product: 'Gig Worker Micro Financing',
    purpose: 'Fuel float, vehicle repairs, insurance renewal',
    reasons: [
      '340 mobility and wallet transactions show stable gig income',
      'Fuel spend pattern matches active Grab driver profile',
      'TNG repayment behaviour can rebuild formal credit readiness',
    ],
    suggestions: [
      'Repay RM 300 micro-credit early to lift TNG Score faster',
      'Route Grab cash-outs into TNG wallet for stronger income proof',
      'Settle overdue telco balance before applying to partner banks',
    ],
  },
}

function ScoreCard({ label, value, score, tone, note }) {
  const pct = typeof score === 'number' ? Math.min(100, Math.max(0, (score / 850) * 100)) : 0

  return (
    <div className={`finance-score-card ${tone || ''}`}>
      <div className="finance-score-top">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="finance-meter">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p>{note}</p>
    </div>
  )
}

export default function FinanceScreen({ persona, claimed, totalClaimed }) {
  const [extraData, setExtraData] = useState({ payslip: false, bank: false })
  const data = FINANCE_DATA[persona.id] || FINANCE_DATA.siti
  const addedDataCount = Object.values(extraData).filter(Boolean).length
  const benefitLift = Math.min(250, totalClaimed * 2)
  const dataLift = addedDataCount * 300
  const limit = Math.min(data.boostedLimit, data.baseLimit + benefitLift + dataLift)
  const repayment = Math.round(limit / 6)
  const readiness = useMemo(() => {
    const scorePoints = data.tngScore >= 700 ? 42 : 34
    const txnPoints = data.transactions >= 300 ? 22 : 16
    const dataPoints = addedDataCount * 9
    const benefitPoints = totalClaimed > 0 ? 8 : 0
    return Math.min(92, scorePoints + txnPoints + dataPoints + benefitPoints)
  }, [addedDataCount, data.tngScore, data.transactions, totalClaimed])

  const toggleData = (key) => {
    setExtraData(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="finance-screen">
      <section className="finance-hero" style={{ background: persona.accentColor }}>
        <div>
          <div className="finance-eyebrow">GOFinance Eligibility</div>
          <h2>Up to RM {limit.toLocaleString()}</h2>
          <p>{data.product}</p>
        </div>
      </section>

      <div className="finance-summary-grid">
        <div className="finance-mini-card">
          <span>Monthly income</span>
          <strong>RM {data.income.toLocaleString()}</strong>
        </div>
        <div className="finance-mini-card">
          <span>Est. repayment</span>
          <strong>RM {repayment}/mo</strong>
        </div>
        <div className="finance-mini-card">
          <span>Txn history</span>
          <strong>{data.months} mo</strong>
        </div>
      </div>

      <div className="section-lbl">SCORING VIEW</div>
      <div className="finance-score-list">
        <ScoreCard
          label="TNG Integrated Score"
          value={data.tngScore}
          score={data.tngScore}
          tone="strong"
          note={`${data.transactions} wallet transactions used when bank files are thin or damaged.`}
        />
        <ScoreCard
          label="CTOS"
          value={data.ctos || 'No file'}
          score={data.ctos}
          note={data.ctos ? 'Traditional bureau signal included in partner review.' : 'New-to-credit user, so TNG behaviour becomes the primary signal.'}
        />
        <ScoreCard
          label="CCRIS"
          value={data.ccris || 'No file'}
          score={data.ccris === 'Watchlist' ? 390 : 0}
          tone={data.ccris === 'Watchlist' ? 'warn' : ''}
          note={data.ccris === 'Watchlist' ? 'Blacklisted users can start with controlled limits and rebuild through repayments.' : 'No loan repayment history found yet.'}
        />
      </div>

      <div className="section-lbl">WHY THIS LIMIT</div>
      <div className="finance-card">
        <div className="finance-status-row">
          <span>{data.risk}</span>
          <strong>{data.status}</strong>
        </div>
        {data.reasons.map(reason => (
          <div key={reason} className="finance-check-row">
            <span>✓</span>
            <p>{reason}</p>
          </div>
        ))}
      </div>

      <div className="section-lbl">INCREASE LIMIT</div>
      <div className="finance-upload-grid">
        <button
          className={`finance-upload ${extraData.payslip ? 'active' : ''}`}
          onClick={() => toggleData('payslip')}
          type="button"
        >
          <span>Payslip</span>
          <strong>{extraData.payslip ? '+RM 300 added' : '+RM 300'}</strong>
        </button>
        <button
          className={`finance-upload ${extraData.bank ? 'active' : ''}`}
          onClick={() => toggleData('bank')}
          type="button"
        >
          <span>Bank statement</span>
          <strong>{extraData.bank ? '+RM 300 added' : '+RM 300'}</strong>
        </button>
      </div>

      <div className="section-lbl">AI SCORE COACH</div>
      <div className="finance-ai-card">
        <div className="finance-ai-avatar" style={{ background: persona.accentColor }}>AI</div>
        <div>
          <strong>Next best actions</strong>
          {data.suggestions.map(item => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>

      <button className="finance-apply-btn" style={{ background: persona.accentColor }} type="button">
        Apply for RM {limit.toLocaleString()}
      </button>

      <div className="finance-note">
        Purpose: {data.purpose}. Final approval depends on partner checks and consented document verification.
      </div>
      <div style={{ height: 16 }} />
    </div>
  )
}
