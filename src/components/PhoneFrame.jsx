import React, { useEffect, useState } from 'react'
import { Home, ShoppingCart, QrCode, Wallet, MapPin } from 'lucide-react'
import HomeScreen from './HomeScreen.jsx'
import CoachScreen from './CoachScreen.jsx'
import BenefitsScreen from './BenefitsScreen.jsx'
import BudgetScreen from './BudgetScreen.jsx'
import FinanceScreen from './FinanceScreen.jsx'
import ScoreAnalysisScreen from './ScoreAnalysisScreen.jsx'
import './PhoneFrame.css'
import { apiClaimBenefit, apiGetClaims } from '../api/goauraApi.js'

const TABS = [
  { id: 'home',     label: 'Home' },
  { id: 'coach',    label: 'Coach' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'budget',   label: 'Budget' },
  { id: 'finance',  label: 'Finance' },
]

const APP_NAV = [
  { icon: <Home size={20} />,         label: 'Home',      action: 'home' },
  { icon: <ShoppingCart size={20} />, label: 'eShop' },
  { icon: <QrCode size={24} />,       label: '',          action: 'home', center: true, active: true },
  { icon: <Wallet size={20} />,       label: 'GOFinance', action: 'finance' },
  { icon: <MapPin size={20} />,       label: 'Near Me' },
]

export default function PhoneFrame({ persona, routeAnimation = '', onHome }) {
  const [tab, setTab] = useState('home')
  const [detail, setDetail] = useState(null) // 'score' | null
  const [claimed, setClaimed] = useState({})

  useEffect(() => {
    let cancelled = false
    setClaimed({})
    apiGetClaims(persona.id)
      .then(({ claims }) => {
        if (cancelled) return
        setClaimed(claims || {})
      })
      .catch(() => {
        // API might not be running yet; UI can still function in local-demo mode.
      })
    return () => { cancelled = true }
  }, [persona.id])

  const claim = async (id, amount) => {
    try {
      const res = await apiClaimBenefit(persona.id, id)
      if (res?.claims) setClaimed(res.claims)
      return
    } catch {
      // Fallback to in-memory claim when backend is unavailable.
    }
    setClaimed(prev => ({ ...prev, [id]: amount }))
  }
  const totalClaimed = Object.values(claimed).reduce((a, b) => a + b, 0)

  const navigate = (next) => {
    if (next === 'score') {
      setDetail('score')
      return
    }
    setDetail(null)
    setTab(next)
  }

  const handleAppNav = (action) => {
    if (action === 'home') {
      onHome?.()
      return
    }

    if (action === 'finance') {
      navigate('finance')
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

        {!detail && (
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
        )}

        {!detail && (
          <div className="tab-bar">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn ${tab === t.id ? 'active' : ''}`}
                style={tab === t.id ? { background: '#fff', color: 'var(--wallet-blue)' } : {}}
                onClick={() => navigate(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="screen-area">
          {detail === 'score' && <ScoreAnalysisScreen persona={persona} onBack={() => setDetail(null)} />}
          {!detail && tab === 'home'     && <HomeScreen persona={persona} claimed={claimed} totalClaimed={totalClaimed} onNavigate={navigate} />}
          {!detail && tab === 'coach'    && <CoachScreen persona={persona} />}
          {!detail && tab === 'benefits' && <BenefitsScreen persona={persona} claimed={claimed} onClaim={claim} />}
          {!detail && tab === 'budget'   && <BudgetScreen persona={persona} claimed={claimed} totalClaimed={totalClaimed} />}
          {!detail && tab === 'finance'  && <FinanceScreen persona={persona} claimed={claimed} totalClaimed={totalClaimed} />}
        </div>

        <nav className="tng-nav goaura-app-nav">
          {APP_NAV.map(item => (
            <button
              key={`${item.label || item.action}`}
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
