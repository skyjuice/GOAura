import React from 'react'
import { FilePlus, TrendingUp, ArrowLeftRight, CreditCard, Eye, ShieldCheck, Fuel, Plane, ParkingSquare, Banknote, Building2, Home, QrCode, Wallet, MapPin, Gift, Search, ShoppingCart, Sparkles, Goal, Sprout } from 'lucide-react'
import './PhoneFrame.css'
import './TngHomePage.css'

const quickActions = [
  { icon: <FilePlus size={20} />, label: 'Apply' },
  { icon: <TrendingUp size={20} />, label: 'Cash flow' },
  { icon: <ArrowLeftRight size={20} />, label: 'Transfer' },
  { icon: <CreditCard size={20} />, label: 'Cards' },
]

const recommended = [
  { icon: <CreditCard size={22} />, label: 'CardMatch', tag: 'NEW' },
  { icon: '25', label: 'Payday', tag: '$$ IN' },
  { icon: <Plane size={22} />, label: 'Travel' },
  { icon: '淘', label: 'Taobao', orange: true },
]

const favourites = [
  { icon: <ParkingSquare size={22} />, label: 'Street Parking' },
  { icon: <Goal size={22} />, label: 'Goal City' },
  { icon: <Banknote size={22} />, label: 'CashLoan', tag: 'NAK$$' },
  { icon: 'ctos', label: 'CTOS Report' },
  { icon: 'ASNB', label: 'ASNB' },
  { icon: '+60', label: 'MY Prepaid' },
  { icon: <Building2 size={22} />, label: 'My Business' },
]

const bottomNav = [
  { icon: <Home size={20} />, label: 'Home', active: true },
  { icon: <ShoppingCart size={20} />, label: 'eShop' },
  { icon: <QrCode size={24} />, label: '', center: true },
  { icon: <Wallet size={20} />, label: 'GOFinance' },
  { icon: <MapPin size={20} />, label: 'Near Me' },
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
            <div className="search-pill"><span><Search size={18} /></span><span className="search-pill-text">BUDI95</span></div>
            <div className="profile-bubble">
              <span className="profile-dot" />
              <span className="coin-dot" />
            </div>
          </div>

          <div className="wallet-row">
            <div>
              <div className="balance-line">
                <span className="shield"><ShieldCheck size={16} /></span>
                <span>RM 77.00</span>
                <span className="eye"><Eye size={16} /></span>
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
                <span className="quick-action-icon">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </section>

        <main className="tng-scroll">
          <section className="promo-grid">
            <button className="goaura-home-button" onClick={onOpenGoAura}>
              <span className="goaura-badge"><Sparkles size={15} /></span>
              <strong>GOAura HyperPersonal</strong>
              <small>Explore benefits now</small>
            </button>

            <div className="promo-card grow-card">
              <span className="promo-icon grow-icon"><Sprout size={20} /></span>
              <div className="promo-text">
                <strong>Grow your money</strong>
                <small>Start with just RM10</small>
              </div>
            </div>

            <div className="promo-card budi-card">
              <span className="promo-icon budi-icon"><Fuel size={18} /></span>
              <div className="promo-text">
                <strong>BUDI95</strong>
                <small>RON95 at RM1.99</small>
              </div>
            </div>

            <div className="promo-card reward-card">
              <span className="promo-icon gift-icon"><Gift size={20} /></span>
              <div className="promo-text">
                <strong>GOrewards</strong>
                <small className="reward-sub">Join now</small>
              </div>
            </div>

            <div className="promo-card fuel-balance-card">
              <div className="promo-text">
                <small>Fuel balance</small>
                <strong>166 litres</strong>
              </div>
              <span className="fuel-ring"><Fuel size={14} color="#0871ee" /></span>
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
