import React, { useEffect, useState } from 'react'
import './HomeScreen.css'
import { apiGetHome } from '../api/goauraApi.js'

const SITI_DATA = {
  income: 2100, spend: 1650, potential: 308,
  topSpend: [
    { cat: 'Groceries', amount: 520, pct: 32, color: '#22C55E' },
    { cat: 'Medical',   amount: 180, pct: 11, color: '#EF4444' },
    { cat: 'Transport', amount: 140, pct: 9,  color: '#3B82F6' },
  ],
  coachTip: "You're spending RM 180/month on medical. Switch to MySejahtera panel clinic — pay RM 1 instead of RM 30 per visit. Save RM 26/month instantly.",
}

const AHMAD_DATA = {
  income: 3210, spend: 2100, potential: 144,
  topSpend: [
    { cat: 'Fuel',       amount: 680, pct: 32, color: '#F59E0B' },
    { cat: 'Food',       amount: 310, pct: 15, color: '#EF4444' },
    { cat: 'eCommerce',  amount: 210, pct: 10, color: '#8B5CF6' },
  ],
  coachTip: "You spent RM 680 on fuel last month at 4 different stations. Sticking to PETRONAS + TNG Pay unlocks 8% cashback — that's RM 54 back next cycle.",
}

export default function HomeScreen({ persona, claimed, totalClaimed, onNavigate }) {
  const fallback = persona.id === 'siti' ? SITI_DATA : AHMAD_DATA
  const [home, setHome] = useState(() => ({
    income: fallback.income,
    spend: fallback.spend,
    potential: fallback.potential,
    topSpend: fallback.topSpend,
    coachTip: fallback.coachTip,
    tngScore: persona.id === 'ahmad' ? 714 : 599,
    transactions: persona.id === 'ahmad' ? 125 : 180,
    months: persona.id === 'ahmad' ? 6 : 12,
  }))

  useEffect(() => {
    let cancelled = false
    setHome({
      income: fallback.income,
      spend: fallback.spend,
      potential: fallback.potential,
      topSpend: fallback.topSpend,
      coachTip: fallback.coachTip,
      tngScore: persona.id === 'ahmad' ? 714 : 599,
      transactions: persona.id === 'ahmad' ? 125 : 180,
      months: persona.id === 'ahmad' ? 6 : 12,
    })
    apiGetHome(persona.id)
      .then((data) => {
        if (cancelled) return
        setHome({
          income: data.income,
          spend: data.spend,
          potential: data.potential,
          topSpend: data.topSpend,
          coachTip: data.coachTip,
          tngScore: persona.id === 'ahmad' ? 714 : 599,
          transactions: persona.id === 'ahmad' ? 125 : 180,
          months: persona.id === 'ahmad' ? 6 : 12,
        })
      })
      .catch(() => {
        // Keep fallback demo data if backend isn't available.
        if (cancelled) return
        setHome((prev) => ({ ...prev, ...fallback }))
      })
    return () => { cancelled = true }
  }, [persona.id])

  const scoreColor = home.tngScore >= 700 ? '#22C55E' : '#F59E0B'
  const expenseTotal = Math.max(1, home.spend || home.topSpend.reduce((sum, item) => sum + item.amount, 0))

  return (
    <div className="home-screen">
      {/* summary row */}
      <div className="summary-row">
        <div className="summary-chip">
          <div className="chip-val">RM {home.income.toLocaleString()}</div>
          <div className="chip-lbl">Income</div>
        </div>
        <div className="summary-chip">
          <div className="chip-val" style={{ color: '#EF4444' }}>RM {home.spend.toLocaleString()}</div>
          <div className="chip-lbl">Expenses</div>
        </div>
        <div className="summary-chip highlight">
          <div className="chip-val" style={{ color: '#22C55E' }}>RM {home.potential}</div>
          <div className="chip-lbl">Potential saves</div>
        </div>
      </div>

      {/* TNG score */}
      <div className="section-label">YOUR TNG FINANCIAL SCORE</div>
      <button
        type="button"
        className="score-card score-card-clickable"
        onClick={() => onNavigate?.('score')}
        aria-label="Open full financial score analysis"
      >
        <div className="score-circle" style={{ borderColor: scoreColor }}>
          <span className="score-val" style={{ color: scoreColor }}>{home.tngScore}</span>
        </div>
        <div className="score-info">
          <div className="score-status" style={{ color: scoreColor }}>
            {home.tngScore >= 700 ? 'Good' : 'Fair'}
          </div>
          <div className="score-desc">
            Built from <strong>{home.transactions} transactions</strong> over {home.months} months.
          </div>
          <div className="score-bar-wrap">
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${(home.tngScore / 1000) * 100}%`, background: scoreColor }} />
            </div>
            <span className="score-max">/ 1000</span>
          </div>
          <div className="score-link">Tap for full analysis →</div>
        </div>
      </button>

      {/* coach tip */}
      <div className="section-label">AI COACH TIP</div>
      <div className="coach-tip-card" onClick={() => onNavigate('coach')}>
        <div className="coach-avatar">AI</div>
        <div className="coach-bubble">{home.coachTip}</div>
        <div className="coach-cta">Tap to chat →</div>
      </div>

      {/* top spend */}
      <div className="section-label">TOP SPENDING</div>
      <div className="spend-card">
        {home.topSpend.map(s => (
          <div key={s.cat} className="spend-row">
            <div className="spend-cat">{s.cat}</div>
            <div className="spend-bar-wrap">
              <div className="spend-bar">
                <div className="spend-fill" style={{ width: `${Math.min(100, (s.amount / expenseTotal) * 100)}%`, background: s.color }} />
              </div>
            </div>
            <div className="spend-amount">RM {s.amount}</div>
          </div>
        ))}
      </div>

      {/* quick nav */}
      <div className="section-label">QUICK ACTIONS</div>
      <div className="quick-nav">
        {[
          { label: 'Claim benefits', sub: `RM ${home.potential} available`, screen: 'benefits', color: '#22C55E' },
          { label: 'Ask my coach',   sub: 'Get personalised tips',          screen: 'coach',    color: '#7C3AED' },
          { label: 'View budget',    sub: `+RM ${totalClaimed} gained`,     screen: 'budget',   color: '#3B82F6' },
        ].map(a => (
          <button key={a.screen} className="quick-btn" onClick={() => onNavigate(a.screen)}>
            <div className="quick-dot" style={{ background: a.color }} />
            <div>
              <div className="quick-label">{a.label}</div>
              <div className="quick-sub">{a.sub}</div>
            </div>
            <span className="quick-arrow">→</span>
          </button>
        ))}
      </div>
      <div style={{ height: 16 }} />
    </div>
  )
}
