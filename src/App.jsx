import React, { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import TngHomePage from './components/TngHomePage.jsx'
import './styles/app.css'

const PERSONAS = [
  {
    id: 'siti',
    name: 'Siti, 35',
    role: 'B40 · Single Parent · Klang',
    badge: 'B40 Household',
    badgeColor: '#7C3AED',
    accentColor: '#7C3AED',
    dotColor: '#A78BFA',
  },
  {
    id: 'ahmad',
    name: 'Ahmad, 28',
    role: 'Grab Driver · No Bank Account',
    badge: 'Unbanked · Gig Worker',
    badgeColor: '#D97706',
    accentColor: '#F59E0B',
    dotColor: '#FCD34D',
  },
]

function AppHeader({ onHome }) {
  return (
    <header className="app-header">
      <div className="logo">
        <span className="logo-g">G</span>
        <span className="logo-text">OAura</span>
      </div>
      <p className="tagline">TNG HyperPersonal · Financial Inclusion Engine</p>
      {onHome && (
        <button className="header-home-btn" onClick={onHome} aria-label="Go back to homepage">
          ⌂
        </button>
      )}
    </header>
  )
}

function AppFooter() {
  return (
    <footer className="app-footer">
      Built for TNG Hackathon 2026 · Team FortyOne
    </footer>
  )
}

function PersonaPanel({ persona, onPersonaChange }) {
  return (
    <aside className="persona-panel" aria-label="Choose profile">
      <div className="persona-panel-label">Profiles</div>
      <div className="persona-switcher">
        {PERSONAS.map((p, i) => (
          <button
            key={p.id}
            className={`persona-btn ${persona === i ? 'active' : ''}`}
            style={persona === i ? { borderColor: p.badgeColor, color: p.badgeColor } : {}}
            onClick={() => onPersonaChange(i)}
          >
            <span className="persona-badge" style={{ background: persona === i ? p.badgeColor : '#64748B', color: '#fff' }}>
              {p.badge}
            </span>
            <span className="persona-name">{p.name}</span>
            <span className="persona-role">{p.role}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

export default function App() {
  const [persona, setPersona] = useState(0)
  const [showGoAura, setShowGoAura] = useState(false)
  const [routeAnimation, setRouteAnimation] = useState('')

  const openGoAura = () => {
    setRouteAnimation('route-slide-forward')
    setShowGoAura(true)
  }

  const goHome = () => {
    setRouteAnimation('route-slide-back')
    setShowGoAura(false)
  }

  if (!showGoAura) {
    return (
      <div className="app-root app-root-home">
        <AppHeader />
        <main className="app-stage">
          <TngHomePage onOpenGoAura={openGoAura} routeAnimation={routeAnimation} />
          <PersonaPanel persona={persona} onPersonaChange={setPersona} />
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="app-root">
      <AppHeader onHome={goHome} />

      <main className="app-stage">
        <PhoneFrame persona={PERSONAS[persona]} routeAnimation={routeAnimation} />
        <PersonaPanel persona={persona} onPersonaChange={setPersona} />
      </main>

      <AppFooter />
    </div>
  )
}
