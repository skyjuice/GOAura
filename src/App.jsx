import React, { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
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

export default function App() {
  const [persona, setPersona] = useState(0)
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo">
          <span className="logo-g">G</span>
          <span className="logo-text">OAura</span>
        </div>
        <p className="tagline">TNG HyperPersonal · Financial Inclusion Engine</p>
      </header>

      <div className="persona-switcher">
        {PERSONAS.map((p, i) => (
          <button
            key={p.id}
            className={`persona-btn ${persona === i ? 'active' : ''}`}
            style={persona === i ? { borderColor: p.badgeColor, color: p.badgeColor } : {}}
            onClick={() => setPersona(i)}
          >
            <span className="persona-badge" style={{ background: persona === i ? p.badgeColor : '#2a2a4a', color: '#fff' }}>
              {p.badge}
            </span>
            <span className="persona-name">{p.name}</span>
            <span className="persona-role">{p.role}</span>
          </button>
        ))}
      </div>

      <PhoneFrame persona={PERSONAS[persona]} />

      <footer className="app-footer">
        Built for TNG Hackathon 2026 · GOAura Team
      </footer>
    </div>
  )
}
