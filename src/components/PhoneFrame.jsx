import React, { useState } from 'react'
import HomeScreen from './HomeScreen.jsx'
import CoachScreen from './CoachScreen.jsx'
import BenefitsScreen from './BenefitsScreen.jsx'
import BudgetScreen from './BudgetScreen.jsx'
import './PhoneFrame.css'

const TABS = [
  { id: 'home',     label: 'Home',     icon: '⌂' },
  { id: 'coach',    label: 'Coach',    icon: '◈' },
  { id: 'benefits', label: 'Benefits', icon: '◎' },
  { id: 'budget',   label: 'Budget',   icon: '◉' },
]

export default function PhoneFrame({ persona, routeAnimation = '' }) {
  const [tab, setTab] = useState('home')
  const [claimed, setClaimed] = useState({})

  const claim = (id, amount) => setClaimed(prev => ({ ...prev, [id]: amount }))
  const totalClaimed = Object.values(claimed).reduce((a, b) => a + b, 0)

  return (
    <div className="phone">
      <span className="hardware-button hardware-button-left" aria-hidden="true" />
      <span className="hardware-button hardware-button-right" aria-hidden="true" />
      <div className="dynamic-island" aria-hidden="true">
        <span className="island-camera" />
      </div>

      <div className={`phone-app-content ${routeAnimation}`}>
        <div className="status-bar">
          <span>11:44</span>
          <span className="status-icons" aria-label="4G, WiFi, 76 percent battery">
            <span>4G</span>
            <span className="wifi-icon" aria-hidden="true" />
            <span className="battery-icon" aria-hidden="true">
              <span className="battery-level" />
            </span>
          </span>
        </div>

        <div className="phone-header">
          <div className="header-label">TNG HyperPersonal</div>
          <div className="header-name">Hi {persona.name.split(',')[0]} 👋</div>
          <div className="header-pill" style={{ borderColor: persona.dotColor }}>
            <span className="pill-dot" style={{ background: persona.dotColor }} />
            {persona.badge}
            {totalClaimed > 0 && (
              <span className="pill-saved"> · RM {totalClaimed.toFixed(0)} claimed</span>
            )}
          </div>
        </div>

        <div className="tab-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              style={tab === t.id ? { background: '#fff', color: 'var(--wallet-blue)' } : {}}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="screen-area">
          {tab === 'home'     && <HomeScreen persona={persona} claimed={claimed} totalClaimed={totalClaimed} onNavigate={setTab} />}
          {tab === 'coach'    && <CoachScreen persona={persona} />}
          {tab === 'benefits' && <BenefitsScreen persona={persona} claimed={claimed} onClaim={claim} />}
          {tab === 'budget'   && <BudgetScreen persona={persona} claimed={claimed} totalClaimed={totalClaimed} />}
        </div>

        <nav className="bottom-nav">
          {TABS.map(t => (
            <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              <span className="nav-label" style={tab === t.id ? { color: persona.accentColor } : {}}>
                {t.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="home-indicator" aria-hidden="true" />
    </div>
  )
}
