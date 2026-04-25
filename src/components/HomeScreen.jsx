import React from 'react'
import './HomeScreen.css'

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
  income: 3200, spend: 2100, potential: 144,
  topSpend: [
    { cat: 'Fuel',       amount: 680, pct: 32, color: '#F59E0B' },
    { cat: 'Food',       amount: 310, pct: 15, color: '#EF4444' },
    { cat: 'eCommerce',  amount: 210, pct: 10, color: '#8B5CF6' },
  ],
  coachTip: "You spent RM 680 on fuel last month at 4 different stations. Sticking to PETRONAS + TNG Pay unlocks 8% cashback — that's RM 54 back next cycle.",
}

export default function HomeScreen({ persona, claimed, totalClaimed, onNavigate }) {
  const data = persona.id === 'siti' ? SITI_DATA : AHMAD_DATA
  const tngScore = persona.id === 'ahmad' ? 714 : 698
  const scoreColor = tngScore >= 700 ? '#22C55E' : '#F59E0B'

  return (
    <div className="home-screen">
      {/* summary row */}
      <div className="summary-row">
        <div className="summary-chip">
          <div className="chip-val">RM {data.income.toLocaleString()}</div>
          <div className="chip-lbl">Income</div>
        </div>
        <div className="summary-chip">
          <div className="chip-val" style={{ color: '#EF4444' }}>RM {data.spend.toLocaleString()}</div>
          <div className="chip-lbl">Expenses</div>
        </div>
        <div className="summary-chip highlight">
          <div className="chip-val" style={{ color: '#22C55E' }}>RM {data.potential}</div>
          <div className="chip-lbl">Potential saves</div>
        </div>
      </div>

      {/* TNG score */}
      <div className="section-label">YOUR TNG FINANCIAL SCORE</div>
      <div className="score-card">
        <div className="score-circle" style={{ borderColor: scoreColor }}>
          <span className="score-val" style={{ color: scoreColor }}>{tngScore}</span>
        </div>
        <div className="score-info">
          <div className="score-status" style={{ color: scoreColor }}>
            {tngScore >= 700 ? 'Good' : 'Fair'}
          </div>
          <div className="score-desc">
            Built from <strong>{persona.id === 'ahmad' ? '340' : '180'} transactions</strong> over{' '}
            {persona.id === 'ahmad' ? '18' : '12'} months. No bank account needed.
          </div>
          <div className="score-bar-wrap">
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${(tngScore / 850) * 100}%`, background: scoreColor }} />
            </div>
            <span className="score-max">/ 850</span>
          </div>
        </div>
      </div>

      {/* coach tip */}
      <div className="section-label">AI COACH TIP</div>
      <div className="coach-tip-card" onClick={() => onNavigate('coach')}>
        <div className="coach-avatar">AI</div>
        <div className="coach-bubble">{data.coachTip}</div>
        <div className="coach-cta">Tap to chat →</div>
      </div>

      {/* top spend */}
      <div className="section-label">TOP SPENDING</div>
      <div className="spend-card">
        {data.topSpend.map(s => (
          <div key={s.cat} className="spend-row">
            <div className="spend-cat">{s.cat}</div>
            <div className="spend-bar-wrap">
              <div className="spend-bar">
                <div className="spend-fill" style={{ width: `${s.pct * 2.5}%`, background: s.color }} />
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
          { label: 'Claim benefits', sub: `RM ${data.potential} available`, screen: 'benefits', color: '#22C55E' },
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
