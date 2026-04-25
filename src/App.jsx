import React, { useState } from 'react'
import { LayoutDashboard } from 'lucide-react'
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
    role: 'Grab Driver',
    badge: 'Gig Worker',
    badgeColor: '#D97706',
    accentColor: '#F59E0B',
    dotColor: '#FCD34D',
  },
]

function AppHeader({ onHome, onDashboard }) {
  return (
    <header className="app-header">
      <div className="logo">
        <span className="logo-g">G</span>
        <span className="logo-o">o</span>
        <span className="logo-text">Aura</span>
      </div>
      {onDashboard && (
        <button className="dashboard-btn" onClick={onDashboard} aria-label="Go to dashboard">
          <LayoutDashboard size={16} />
        </button>
      )}
      <p className="tagline">TNG HyperPersonal · Financial Inclusion Engine</p>
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
      <AppHeader onHome={goHome} onDashboard={goHome} />

      <main className="app-stage">
        <PhoneFrame key={PERSONAS[persona].id} persona={PERSONAS[persona]} routeAnimation={routeAnimation} onHome={goHome} />
        <PersonaPanel persona={persona} onPersonaChange={setPersona} />
      </main>

      <AppFooter />
    </div>
  )
}
