import React, { useEffect, useState } from 'react'
import './BudgetScreen.css'
import { apiGetBudget } from '../api/goauraApi.js'

const SITI_BUDGET = {
  income: 2100,
  lines: [
    { cat: '🏠 Rent',      amount: 600,  savingId: null,    saving: 0   },
    { cat: '🛒 Groceries', amount: 520,  savingId: 'rahmah',saving: 15  },
    { cat: '🏥 Medical',   amount: 180,  savingId: 'mysej', saving: 26  },
    { cat: '🚌 Transport', amount: 140,  savingId: null,    saving: 0   },
    { cat: '⚡ Utilities', amount: 210,  savingId: 'tnb',   saving: 30  },
  ],
  benefits: [
    { id: 'mysej',  label: '💊 MySejahtera savings', amount: 28  },
    { id: 'bsh',    label: '👧 BSH child aid',        amount: 20  },
    { id: 'rahmah', label: '🛒 Rahmah cashback',       amount: 15  },
    { id: 'tnb',    label: '⚡ TNB rebate',            amount: 30  },
    { id: 'fuel',   label: '⛽ Fuel cashback',         amount: 15  },
  ],
}

const AHMAD_BUDGET = {
  income: 3200,
  lines: [
    { cat: '🏠 Rent',      amount: 800,  savingId: null,   saving: 0   },
    { cat: '⛽ Fuel',      amount: 680,  savingId: 'fuel8',saving: 54  },
    { cat: '🍜 Food',      amount: 310,  savingId: null,   saving: 0   },
    { cat: '📱 Prepaid',   amount: 80,   savingId: null,   saving: 0   },
    { cat: '🛒 eCommerce', amount: 210,  savingId: null,   saving: 0   },
  ],
  benefits: [
    { id: 'fuel8',  label: '⛽ Fuel cashback 8%', amount: 54 },
    { id: 'invest', label: '📈 Micro-invest earn', amount: 12 },
    { id: 'micro',  label: '💳 Micro-credit saved',amount: 0  },
    { id: 'pa',     label: '🛡️ PA cover value',   amount: 25 },
  ],
}

export default function BudgetScreen({ persona, claimed, totalClaimed }) {
  const [withBenefits, setWithBenefits] = useState(false)
  const fallback = persona.id === 'siti' ? SITI_BUDGET : AHMAD_BUDGET
  const [data, setData] = useState(fallback)

  useEffect(() => {
    let cancelled = false
    setWithBenefits(false)
    setData(fallback)
    apiGetBudget(persona.id)
      .then((res) => {
        if (cancelled) return
        if (res?.income && Array.isArray(res?.lines) && Array.isArray(res?.benefits)) {
          setData({ income: res.income, lines: res.lines, benefits: res.benefits })
        }
      })
      .catch(() => {
        if (cancelled) return
        setData(fallback)
      })
    return () => { cancelled = true }
  }, [persona.id])

  const totalExpense = data.lines.reduce((a, b) => a + b.amount, 0)
  const baseRemaining = data.income - totalExpense

  const claimedBenefits = data.benefits.filter(b => claimed[b.id])
  const benefitTotal = claimedBenefits.reduce((a, b) => a + b.amount, 0)
  const effectiveRemaining = baseRemaining + (withBenefits ? benefitTotal : 0)
  const pctImprove = baseRemaining > 0
    ? Math.round(((effectiveRemaining - baseRemaining) / baseRemaining) * 100)
    : 0

  return (
    <div className="budget-screen">
      <div className="budget-header">
        <div>
          <div className="budget-title">April 2026 Budget</div>
          <div className="budget-income">Income: RM {data.income.toLocaleString()}</div>
        </div>
        <label className="toggle-wrap">
          <input
            type="checkbox"
            checked={withBenefits}
            onChange={e => setWithBenefits(e.target.checked)}
          />
          <span className="toggle-track" style={withBenefits ? { background: persona.accentColor } : {}}>
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-label">With benefits</span>
        </label>
      </div>

      {/* summary chips */}
      <div className="budget-chips">
        <div className="bchip">
          <div className="bchip-val">RM {totalExpense.toLocaleString()}</div>
          <div className="bchip-lbl">Expenses</div>
        </div>
        <div className="bchip" style={withBenefits && benefitTotal > 0 ? { background: '#f0fdf4', borderColor: '#bbf7d0' } : {}}>
          <div
            className="bchip-val"
            style={{ color: effectiveRemaining > baseRemaining ? '#16A34A' : effectiveRemaining < 500 ? '#DC2626' : '#F59E0B' }}
          >
            RM {effectiveRemaining.toLocaleString()}
          </div>
          <div className="bchip-lbl">Remaining</div>
        </div>
        {withBenefits && pctImprove > 0 && (
          <div className="bchip" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div className="bchip-val" style={{ color: '#16A34A' }}>+{pctImprove}%</div>
            <div className="bchip-lbl">More take-home</div>
          </div>
        )}
      </div>

      {/* expense lines */}
      <div className="section-lbl">EXPENSES</div>
      <div className="budget-card">
        {data.lines.map((l, i) => {
          const hasSaving = withBenefits && l.savingId && claimed[l.savingId]
          return (
            <div key={i} className="budget-row">
              <span className="brow-cat">{l.cat}</span>
              <span className="brow-amount">RM {l.amount}</span>
              {hasSaving && (
                <span className="brow-save">−RM {l.saving}</span>
              )}
            </div>
          )
        })}
        <div className="budget-divider" />
        <div className="budget-row total-row">
          <span className="brow-cat" style={{ fontWeight: 700 }}>Total</span>
          <span className="brow-amount" style={{ fontWeight: 700, color: '#DC2626' }}>
            RM {totalExpense.toLocaleString()}
          </span>
        </div>
      </div>

      {/* benefits section */}
      {withBenefits && (
        <>
          <div className="section-lbl" style={{ color: '#16A34A' }}>BENEFITS RECEIVED</div>
          <div className="budget-card benefit-section">
            {data.benefits.map(b => {
              const active = !!claimed[b.id]
              return (
                <div key={b.id} className="budget-row" style={{ opacity: active ? 1 : 0.35 }}>
                  <span className="brow-cat">{b.label}</span>
                  <span className="brow-amount" style={{ color: active ? '#16A34A' : '#9CA3AF', fontWeight: 600 }}>
                    {active ? `+RM ${b.amount}` : 'Not claimed'}
                  </span>
                </div>
              )
            })}
            <div className="budget-divider" />
            <div className="budget-row total-row">
              <span className="brow-cat" style={{ fontWeight: 700, color: '#16A34A' }}>Benefits total</span>
              <span className="brow-amount" style={{ fontWeight: 700, color: '#16A34A' }}>+RM {benefitTotal}</span>
            </div>
          </div>

          <div className="effective-banner" style={{ background: persona.accentColor }}>
            <span>Effective remaining</span>
            <span className="effective-val">RM {effectiveRemaining.toLocaleString()}</span>
          </div>
        </>
      )}

      {!withBenefits && (
        <div className="budget-hint">
          Toggle "With benefits" to see your budget after claiming available aid and cashbacks from the Benefits tab.
          {Object.keys(claimed).length === 0 && (
            <strong> Go to Benefits tab to start claiming.</strong>
          )}
        </div>
      )}

      <div style={{ height: 16 }} />
    </div>
  )
}
