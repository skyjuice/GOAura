import React from 'react'
import './PhoneFrame.css'
import './TngHomePage.css'

const quickActions = [
  { icon: '▤', label: 'Apply' },
  { icon: '◔', label: 'Cash flow' },
  { icon: '△', label: 'Transfer' },
  { icon: '▭', label: 'Cards' },
]

const recommended = [
  { icon: '▱', label: 'CardMatch', tag: 'NEW' },
  { icon: '25', label: 'Payday', tag: '$$ IN' },
  { icon: '☂', label: 'Travel' },
  { icon: '淘', label: 'Taobao', orange: true },
]

const favourites = [
  { icon: 'P', label: 'Street Parking' },
  { icon: '🏃', label: 'Goal City' },
  { icon: '$', label: 'CashLoan', tag: 'NAK$$' },
  { icon: 'ctos', label: 'CTOS Report' },
  { icon: 'ASNB', label: 'ASNB' },
  { icon: '+60', label: 'MY Prepaid' },
  { icon: '⌂', label: 'My Business' },
]

const bottomNav = [
  { icon: '⌂', label: 'Home', active: true },
  { icon: '🛒', label: 'eShop' },
  { icon: '▣', label: '', center: true },
  { icon: '$', label: 'GOFinance' },
  { icon: '⌖', label: 'Near Me' },
]

export default function TngHomePage({ onOpenGoAura, routeAnimation = '' }) {
  return (
    <div className="phone tng-phone">
      <span className="hardware-button hardware-button-left" aria-hidden="true" />
      <span className="hardware-button hardware-button-right" aria-hidden="true" />
      <div className="dynamic-island" aria-hidden="true">
        <span className="island-camera" />
      </div>

      <div className={`tng-home ${routeAnimation}`}>
        <div className="tng-status-row">
          <span>11:44</span>
          <span className="tng-signal">▮▮▮ 4G <strong>76</strong></span>
        </div>

        <section className="tng-blue">
          <div className="tng-top-row">
            <button className="trip-pill">China Trip <span>🏮</span></button>
            <div className="search-pill"><span>⌕</span> BUDI95</div>
            <div className="profile-bubble">
              <span className="profile-dot" />
              <span className="coin-dot" />
            </div>
          </div>

          <div className="wallet-row">
            <div>
              <div className="balance-line">
                <span className="shield">⌬</span>
                <span>RM 77.00</span>
                <span className="eye">◉</span>
              </div>
              <div className="asset-link">View asset details ›</div>
            </div>
          </div>

          <div className="money-row">
            <button className="outline-btn">+ Add money</button>
            <button className="transaction-btn">Transactions ›</button>
          </div>

          <div className="quick-tray">
            {quickActions.map(action => (
              <button key={action.label} className="quick-action">
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </section>

        <main className="tng-scroll">
          <section className="promo-grid">
            <button className="goaura-home-button" onClick={onOpenGoAura}>
              <span className="goaura-badge">AI</span>
              <strong>GOAura HyperPersonal</strong>
              <small>Explore benefits now</small>
            </button>

            <div className="soft-card grow-card">
              <span className="round-illustration">RM</span>
              <div>
                <strong>Grow your money</strong>
                <small>Start with just RM10</small>
              </div>
            </div>

            <div className="soft-card fuel-card">
              <div className="fuel-brand">BUDI95</div>
              <small>RON95 at RM1.99</small>
              <div className="fuel-bottom">
                <div>
                  <span>Fuel balance</span>
                  <strong>166 litres</strong>
                </div>
                <span className="fuel-ring">▯</span>
              </div>
            </div>

            <div className="soft-card reward-card">
              <span className="gift-icon">✦</span>
              <div>
                <strong>GOrewards</strong>
                <button>Join now</button>
              </div>
            </div>
          </section>

          <section className="home-section">
            <h2>Recommended</h2>
            <div className="icon-row">
              {recommended.map(item => (
                <button key={item.label} className={`home-icon-tile ${item.orange ? 'orange' : ''}`}>
                  {item.tag && <span className="mini-tag">{item.tag}</span>}
                  <span className="tile-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="home-section">
            <div className="section-title-row">
              <h2>My Favourites</h2>
              <button>Edit</button>
            </div>
            <div className="fav-grid">
              {favourites.map(item => (
                <button key={item.label} className="home-icon-tile fav-tile">
                  {item.tag && <span className="mini-tag">{item.tag}</span>}
                  <span className="tile-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              <button className="payday-sticker">
                <span className="close-dot">×</span>
                PAYDAY<br />DEALS
                <small>TAP HERE</small>
              </button>
            </div>
          </section>
        </main>

        <nav className="tng-nav">
          {bottomNav.map(item => (
            <button key={`${item.icon}-${item.label}`} className={`tng-nav-btn ${item.active ? 'active' : ''} ${item.center ? 'center' : ''}`}>
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
