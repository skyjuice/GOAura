import React, { useState } from 'react'
import HomeScreen from './HomeScreen.jsx'
import CoachScreen from './CoachScreen.jsx'
import BenefitsScreen from './BenefitsScreen.jsx'
import BudgetScreen from './BudgetScreen.jsx'
import FinanceScreen from './FinanceScreen.jsx'
import './PhoneFrame.css'

const TABS = [
  { id: 'home',     label: 'Home' },
  { id: 'coach',    label: 'Coach' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'budget',   label: 'Budget' },
  { id: 'finance',  label: 'Finance' },
]

const APP_NAV = [
  { icon: '⌂', label: 'Home', action: 'home' },
  { icon: '🛒', label: 'eShop' },
  { icon: '⌂', label: '', action: 'home', center: true, active: true },
  { icon: '$', label: 'GOFinance', action: 'finance' },
  { icon: '⌖', label: 'Near Me' },
]

export default function PhoneFrame({ persona, routeAnimation = '', onHome }) {
  const [tab, setTab] = useState('home')
  const [claimed, setClaimed] = useState({})

  const claim = (id, amount) => setClaimed(prev => ({ ...prev, [id]: amount }))
  const totalClaimed = Object.values(claimed).reduce((a, b) => a + b, 0)
  const handleAppNav = (action) => {
    if (action === 'home') {
      onHome?.()
      return
    }

    if (action === 'finance') {
      setTab('finance')
    }
  }

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
          {tab === 'finance'  && <FinanceScreen persona={persona} claimed={claimed} totalClaimed={totalClaimed} />}
        </div>

        <nav className="tng-nav goaura-app-nav">
          {APP_NAV.map(item => (
            <button
              key={`${item.icon}-${item.label || item.action}`}
              className={`tng-nav-btn ${item.active ? 'active' : ''} ${item.center ? 'center' : ''}`}
              onClick={() => handleAppNav(item.action)}
              aria-label={item.label || 'Go back to homepage'}
              type="button"
            >
              <span>{item.icon}</span>
              {item.label && <small>{item.label}</small>}
            </button>
          ))}
        </nav>
      </div>
      <div className="home-indicator" aria-hidden="true" />
    </div>
  )
}
