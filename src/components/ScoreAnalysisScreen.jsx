import React, { useMemo, useState } from 'react'
import './ScoreAnalysisScreen.css'

function buildScoreModel(persona) {
  const isAhmad = persona.id === 'ahmad'
  const score = isAhmad ? 714 : 599
  const months = isAhmad ? 6 : 12
  const txns = isAhmad ? 125 : 180

  const signals = isAhmad
    ? {
        walletSpend: { count: 198, amount: 6420 },
        billPay: { count: 22, amount: 980 },
        topup: { count: 34, amount: 1200 },
        transferIn: { count: 28, amount: 4100 },
        transferOut: { count: 31, amount: 3650 },
        payroll: { count: 18, amount: 28600, label: 'Grab payouts' },
      }
    : {
        walletSpend: { count: 96, amount: 3180 },
        billPay: { count: 29, amount: 1120 },
        topup: { count: 18, amount: 650 },
        transferIn: { count: 14, amount: 980 },
        transferOut: { count: 17, amount: 1020 },
        payroll: { count: 12, amount: 25200, label: 'Payroll' },
      }

  const components = [
    {
      id: 'activity',
      label: 'Activity & usage',
      points: isAhmad ? 148 : 132,
      max: 170,
      detail: `${txns} transactions over ${months} months across payments, transfers, and topups.`,
    },
    {
      id: 'income',
      label: 'Income signals',
      points: isAhmad ? 122 : 118,
      max: 140,
      detail: `${signals.payroll.label}: RM ${signals.payroll.amount.toLocaleString()} total.`,
    },
    {
      id: 'bills',
      label: 'Bill payment reliability',
      points: isAhmad ? 82 : 96,
      max: 110,
      detail: `${signals.billPay.count} bill payments with low late/skip risk.`,
    },
    {
      id: 'cashflow',
      label: 'Cashflow stability',
      points: isAhmad ? 94 : 88,
      max: 120,
      detail: `Transfers in/out show predictable weekly patterns and stable outflow ratios.`,
    },
    {
      id: 'risk',
      label: 'Risk & volatility',
      points: isAhmad ? 74 : 64,
      max: 110,
      detail: `Spending concentration and balance dips reduce this component.`,
    },
  ]

  const opportunities = isAhmad
    ? [
        { label: 'Set 1 auto-bill (e.g. Unifi)', gain: 30, eta: '2 min' },
        { label: 'Keep wallet balance > RM 150 avg', gain: 22, eta: '7 days' },
        { label: 'Consolidate fuel to 1–2 merchants', gain: 16, eta: '2 weeks' },
      ]
    : [
        { label: 'Route payroll into TNG', gain: 28, eta: '1 day' },
        { label: 'Use e-wallet for 2 more monthly bills', gain: 24, eta: '1 week' },
        { label: 'Increase weekly transaction consistency', gain: 14, eta: '2 weeks' },
      ]

  const insights = isAhmad
    ? [
        { title: 'Strong activity', body: `High usage (${txns} txns) gives you a bank-like footprint without a bank account.` },
        { title: 'Income is visible', body: `Your ${signals.payroll.label.toLowerCase()} strengthens affordability signals.` },
        { title: 'Main drag: volatility', body: 'Balance dips and scattered merchant patterns reduce stability points.' },
      ]
    : [
        { title: 'Reliable bill pay', body: `${signals.billPay.count} bill payments support repayment discipline signals.` },
        { title: 'Growing footprint', body: `More consistent weekly usage can lift your score quickly.` },
        { title: 'Main drag: income proof', body: 'Routing salary/payouts into TNG improves income confidence.' },
      ]

  return { score, months, txns, signals, components, opportunities, insights }
}

export default function ScoreAnalysisScreen({ persona, onBack }) {
  const model = useMemo(() => buildScoreModel(persona), [persona])
  const [view, setView] = useState('overview') // overview | details | history
  const [expanded, setExpanded] = useState(null)
  const scoreColor = model.score >= 700 ? '#22C55E' : '#F59E0B'

  const scoreBand =
    model.score >= 740 ? 'Excellent'
      : model.score >= 700 ? 'Good'
        : model.score >= 640 ? 'Fair'
          : 'Needs work'

  const weakest = model.components.reduce((acc, c) => {
    const ratio = c.points / c.max
    if (!acc) return { ...c, ratio }
    return ratio < acc.ratio ? { ...c, ratio } : acc
  }, null)

  return (
    <div className="score-screen">
      <div className="score-topbar">
        <button type="button" className="score-back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="score-title">
          <div className="score-title-main">Financial Score Analysis</div>
          <div className="score-title-sub">Built from your TNG transaction history</div>
        </div>
      </div>

      <div className="score-seg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'details', label: 'Breakdown' },
          { id: 'history', label: 'History' },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            className={`score-seg-btn ${view === t.id ? 'active' : ''}`}
            onClick={() => setView(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="score-hero">
        <div className="score-hero-circle" style={{ borderColor: scoreColor }}>
          <div className="score-hero-val" style={{ color: scoreColor }}>{model.score}</div>
          <div className="score-hero-max">/ 1000</div>
        </div>
        <div className="score-hero-info">
          <div className="score-hero-status" style={{ color: scoreColor }}>
            {scoreBand} standing
          </div>
          <div className="score-hero-desc">
            {model.txns} transactions over {model.months} months from wallet payments, bill pay, transfers, topups and payroll.
          </div>
          {weakest && (
            <div className="score-hero-hint">
              Biggest opportunity: <strong>{weakest.label}</strong>
            </div>
          )}
        </div>
      </div>

      {view === 'overview' && (
        <>
          <div className="score-kpis">
            <div className="score-kpi">
              <div className="score-kpi-k">Transactions</div>
              <div className="score-kpi-v">{model.txns}</div>
            </div>
            <div className="score-kpi">
              <div className="score-kpi-k">History</div>
              <div className="score-kpi-v">{model.months} mo</div>
            </div>
            <div className="score-kpi">
              <div className="score-kpi-k">Bill pay</div>
              <div className="score-kpi-v">{model.signals.billPay.count}</div>
            </div>
          </div>

          <div className="score-section-label">KEY TAKEAWAYS</div>
          <div className="score-takeaways">
            {model.insights.map(i => (
              <div key={i.title} className="score-take-card">
                <div className="score-take-title">{i.title}</div>
                <div className="score-take-body">{i.body}</div>
              </div>
            ))}
          </div>

          <div className="score-section-label">NEXT BEST ACTIONS</div>
          <div className="score-wins">
            {model.opportunities.map(item => (
              <div key={item.label} className="score-win-row">
                <div className="score-win-label">
                  {item.label}
                  <span className="score-win-eta"> · {item.eta}</span>
                </div>
                <div className="score-win-gain">+{item.gain} pts</div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'details' && (
        <>
          <div className="score-section-label">SCORE BREAKDOWN</div>
          <div className="score-breakdown">
            {model.components.map(c => {
              const isOpen = expanded === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`score-break-row score-break-row-btn ${isOpen ? 'open' : ''}`}
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                  aria-expanded={isOpen}
                >
                  <div className="score-break-head">
                    <div className="score-break-label">{c.label}</div>
                    <div className="score-break-points">{c.points} / {c.max}</div>
                  </div>
                  <div className="score-break-bar">
                    <div className="score-break-fill" style={{ width: `${Math.min(100, (c.points / c.max) * 100)}%`, background: scoreColor }} />
                  </div>
                  {isOpen && <div className="score-break-detail">{c.detail}</div>}
                  <div className="score-break-chevron">{isOpen ? 'Hide' : 'Explain'}</div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {view === 'history' && (
        <>
          <div className="score-section-label">HISTORY SIGNALS</div>
          <div className="score-signal-grid">
            <div className="score-signal-card">
              <div className="score-signal-k">Wallet spend</div>
              <div className="score-signal-v">{model.signals.walletSpend.count} txns · RM {model.signals.walletSpend.amount.toLocaleString()}</div>
            </div>
            <div className="score-signal-card">
              <div className="score-signal-k">Bill payments</div>
              <div className="score-signal-v">{model.signals.billPay.count} payments · RM {model.signals.billPay.amount.toLocaleString()}</div>
            </div>
            <div className="score-signal-card">
              <div className="score-signal-k">Transfers in</div>
              <div className="score-signal-v">{model.signals.transferIn.count} · RM {model.signals.transferIn.amount.toLocaleString()}</div>
            </div>
            <div className="score-signal-card">
              <div className="score-signal-k">Transfers out</div>
              <div className="score-signal-v">{model.signals.transferOut.count} · RM {model.signals.transferOut.amount.toLocaleString()}</div>
            </div>
            <div className="score-signal-card">
              <div className="score-signal-k">Topups</div>
              <div className="score-signal-v">{model.signals.topup.count} · RM {model.signals.topup.amount.toLocaleString()}</div>
            </div>
            <div className="score-signal-card">
              <div className="score-signal-k">{model.signals.payroll.label}</div>
              <div className="score-signal-v">{model.signals.payroll.count} payouts · RM {model.signals.payroll.amount.toLocaleString()}</div>
            </div>
          </div>
        </>
      )}

      <div className="score-footnote">
        Note: This is a demo scoring view. In production it is computed from your real TNG activity (bill pay, transfers, topups, payroll and wallet spend).
      </div>
      <div style={{ height: 10 }} />
    </div>
  )
}
