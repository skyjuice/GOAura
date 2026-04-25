import React, { useEffect, useState } from 'react'
import './BenefitsScreen.css'
import { apiGetBenefits } from '../api/goauraApi.js'

const SITI_BENEFITS = [
  { id: 'mysej',  icon: 'M', label: 'MySejahtera Panel Clinic', desc: 'RM 30 → RM 1 per visit · 12 clinics near Klang', amount: 28,  urgency: 'urgent',    iconBg: '#FEE2E2', iconColor: '#991B1B' },
  { id: 'bsh',    icon: 'B', label: 'BSH Child Supplement',     desc: 'RM 240/yr · 2 children · Pre-filled from MyKad',  amount: 20,  urgency: 'unclaimed', iconBg: '#F5F3FF', iconColor: '#5B21B6' },
  { id: 'rahmah', icon: 'R', label: 'Rahmah Menu Cashback',     desc: '3% on grocery TNG Pay · RM 15.60/mo auto',        amount: 15,  urgency: 'active',    iconBg: '#DCFCE7', iconColor: '#166534' },
  { id: 'tnb',    icon: 'T', label: 'TNB B40 Electricity Rebate', desc: 'RM 30/mo · Pay TNB via TNG to trigger',         amount: 30,  urgency: 'available', iconBg: '#EFF6FF', iconColor: '#1E40AF' },
  { id: 'fuel',   icon: 'F', label: 'Fuel Cashback 5%',         desc: 'Auto-applied on all petrol TNG Pay txns',          amount: 15,  urgency: 'available', iconBg: '#FEF3C7', iconColor: '#92400E' },
]

const AHMAD_BENEFITS = [
  { id: 'fuel8',  icon: 'F', label: 'Fuel Cashback 8%',         desc: 'PETRONAS Shell · TNG Pay · Auto-applied',         amount: 54,  urgency: 'active',    iconBg: '#FEF3C7', iconColor: '#92400E' },
  { id: 'pa',     icon: 'P', label: 'Personal Accident Cover',  desc: 'RM 10,000 · Free for 100+ txn users',             amount: 0,   urgency: 'active',    iconBg: '#F5F3FF', iconColor: '#5B21B6' },
  { id: 'micro',  icon: 'C', label: 'Micro-Credit RM 300',      desc: 'Repay via wallet · Builds TNG Score',             amount: 300, urgency: 'available', iconBg: '#DCFCE7', iconColor: '#166534' },
  { id: 'invest', icon: 'I', label: 'Micro-Invest from RM 1',   desc: 'Round-up savings on every transaction',           amount: 12,  urgency: 'available', iconBg: '#EFF6FF', iconColor: '#1E40AF' },
  { id: 'bank',   icon: 'B', label: 'Bank Account Referral',    desc: 'TNG Score 750+ → Pre-approved by partners',       amount: 0,   urgency: 'locked',    iconBg: '#F3F4F6', iconColor: '#9CA3AF' },
]

const URGENCY_CONFIG = {
  urgent:    { label: 'Urgent',    bg: '#FEE2E2', color: '#991B1B' },
  unclaimed: { label: 'Unclaimed', bg: '#F5F3FF', color: '#5B21B6' },
  active:    { label: 'Active',    bg: '#DCFCE7', color: '#166534' },
  available: { label: 'Available', bg: '#DBEAFE', color: '#1E40AF' },
  locked:    { label: 'At 750 pts',bg: '#FEF3C7', color: '#92400E' },
}

const CLAIM_LABELS = {
  urgent: 'Claim', unclaimed: 'Apply', available: 'Activate', active: null, locked: null,
}

export default function BenefitsScreen({ persona, claimed, onClaim }) {
  const fallback = persona.id === 'siti' ? SITI_BENEFITS : AHMAD_BENEFITS
  const [benefits, setBenefits] = useState(fallback)

  useEffect(() => {
    let cancelled = false
    setBenefits(fallback)
    apiGetBenefits(persona.id)
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data?.benefits)) setBenefits(data.benefits)
      })
      .catch(() => {
        if (cancelled) return
        setBenefits(fallback)
      })
    return () => { cancelled = true }
  }, [persona.id])

  const totalClaimable = benefits.filter(b => b.amount > 0).reduce((a, b) => a + b.amount, 0)
  const totalClaimed = Object.values(claimed).reduce((a, b) => a + b, 0)
  const claimedCount = Object.keys(claimed).length
  const pct = Math.round((totalClaimed / totalClaimable) * 100)

  return (
    <div className="benefits-screen">
      {/* summary banner */}
      <div className="benefits-banner" style={{ background: persona.accentColor }}>
        <div className="banner-label">Total claimable this month</div>
        <div className="banner-total">RM {totalClaimable}</div>
        <div className="banner-bar">
          <div className="banner-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="banner-count">{claimedCount} of {benefits.length} claimed · RM {totalClaimed.toFixed(0)} unlocked</div>
      </div>

      {/* benefit cards */}
      <div className="benefits-list">
        {benefits.map(b => {
          const isClaimed = !!claimed[b.id] || !!b.claimed
          const urg = URGENCY_CONFIG[b.urgency]
          const claimLabel = CLAIM_LABELS[b.urgency]

          return (
            <div key={b.id} className={`benefit-card ${isClaimed ? 'claimed' : ''}`}>
              <div className="ben-icon" style={{ background: b.iconBg, color: b.iconColor }}>
                {b.icon}
              </div>
              <div className="ben-info">
                <div className="ben-label">{b.label}</div>
                <div className="ben-desc">{b.desc}</div>
              </div>
              <div className="ben-right">
                {isClaimed ? (
                  <span className="claimed-check">✓</span>
                ) : claimLabel ? (
                  <button
                    className="claim-btn"
                    style={{ background: persona.accentColor }}
                    onClick={() => onClaim(b.id, b.amount)}
                  >
                    {claimLabel}
                  </button>
                ) : (
                  <span className="urg-badge" style={{ background: urg.bg, color: urg.color }}>
                    {urg.label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="benefits-note">
        Every benefit claimed updates your Budget tab in real time and raises your TNG Financial Score.
      </div>
      <div style={{ height: 14 }} />
    </div>
  )
}
