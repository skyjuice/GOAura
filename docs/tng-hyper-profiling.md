# TNG Hyper Profiling — Alternative Credit Intelligence

> **Tagline:** *"30% of Malaysians are credit invisible. TNG has 20M+ users. We don't need a payslip — we already know how you live."*

---

## 🧩 The Problem

Traditional financial institutions rely on **CCRIS** and **CTOS** to determine creditworthiness. This system works for salaried employees — but it completely excludes a massive segment of the Malaysian population:

| Segment | Estimated Population | Why They're Excluded |
|---|---|---|
| Gig workers (Grab, Foodpanda, Lalamove, etc.) | ~1.2M+ | No payslip, irregular income |
| Informal traders / hawkers | High | No formal business records |
| Fresh graduates | Growing | No credit history |
| Underbanked rural communities | Significant | Limited banking access |
| Low-income urban workers | Large | Thin credit file |

These users are **credit invisible** — not because they are irresponsible, but because the system was never designed for them.

---

## 💡 The Core Idea

**TNG Hyper Profiling** is an alternative financial profiling engine built entirely on **behavioral and transactional data** within the TNG ecosystem — no CCRIS, no CTOS, no payslip required.

Instead of asking *"What does your bank say about you?"*, we ask:

> *"How do you actually live, spend, save, and move — every single day?"*

TNG already has this data. We just need to use it intelligently.

---

## 📡 Data Signals

### 💳 1. Transaction Behavior
Signals drawn from how users load and spend within the TNG wallet.

| Signal | What It Tells Us |
|---|---|
| Reload frequency & amount | Cash flow rhythm — small frequent reloads = tight liquidity |
| Spending consistency | Month-to-month stability = income regularity |
| Merchant category mix | Essential spending (groceries, transport) vs lifestyle = responsible vs impulsive |
| Reload-to-spend ratio | Do they hold balance or spend immediately? |
| GoPayment / merchant activity | May be running a micro-business |

---

### 🚗 2. Mobility & Lifestyle
Signals drawn from physical movement patterns via toll, transit, and transport usage.

| Signal | What It Tells Us |
|---|---|
| Daily toll usage (RFID/TNG) | Regular commute = active employment or gig activity |
| Consistent travel routes | Structured lifestyle = stable living pattern |
| LRT / MRT / Bus usage | Public transport reliance = cost-conscious behavior |
| Geographic consistency | Same zones regularly = settled, not transient |
| RFID vehicle registration | Asset ownership indicator |

---

### 📅 3. Financial Discipline
Signals that reveal how users manage financial obligations over time.

| Signal | What It Tells Us |
|---|---|
| Bill payments via TNG (Telco, utilities) | Timeliness = responsible payer |
| GO+ savings usage | Saving even small amounts = financial discipline |
| TNG PayLater repayment history | If used before — did they repay on time? |
| Insurance product adoption | Forward-planning = financial awareness |
| Feature adoption breadth | Using more TNG features = financially engaged |

---

### 📱 4. App Engagement & Digital Behavior
Signals from how users interact with the TNG app itself.

| Signal | What It Tells Us |
|---|---|
| App open frequency | Active user = engaged with financial tools |
| Profile completeness | IC verified, bank linked = identity trust |
| Feature exploration | Using GO+, PayLater, insurance = financially literate |
| Response to promotions | Discount-seeking vs full-price = spending mindset |

---

### 🛒 5. Consumption Patterns
Signals from what users buy and how they spend across TNG-connected merchants.

| Signal | What It Tells Us |
|---|---|
| E-commerce spend (Shopee, Lazada via TNG) | Purchasing power & frequency |
| Food delivery frequency | Regular spending = some disposable income |
| Entertainment vs essential ratio | Lifestyle balance indicator |
| Seasonal spending fluctuations | Festive periods — do they overspend or maintain discipline? |

---

## 🏗️ Profiling Architecture

The profiling engine aggregates all signals into **3 core dimensions**, each scored independently before being combined into a unified **TNG Aura Score**.

```
┌────────────────────────────────────────────────────────────┐
│                    TNG HYPER PROFILING ENGINE              │
│                                                            │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│   │  CAPACITY   │  │  STABILITY  │  │   WILLINGNESS   │  │
│   │             │  │             │  │                 │  │
│   │ Can they    │  │ Is income   │  │ Do they manage  │  │
│   │ repay?      │  │ consistent? │  │ money well?     │  │
│   └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
│          │                │                   │           │
│          └────────────────┼───────────────────┘           │
│                           ▼                               │
│                  ┌─────────────────┐                      │
│                  │ TNG AURA SCORE  │                      │
│                  │   0  —  1000    │                      │
│                  └────────┬────────┘                      │
│                           │                               │
│         ┌─────────────────┼──────────────────┐           │
│         ▼                 ▼                  ▼            │
│     🟢 HIGH           🟡 MEDIUM          🔴 LOW           │
└────────────────────────────────────────────────────────────┘
```

### Dimension Breakdown

| Dimension | Weight | Key Signals |
|---|---|---|
| **Capacity** | 40% | Reload volume, spend volume, merchant revenue (GoPayment) |
| **Stability** | 35% | Behavioral consistency, toll patterns, recurring payments |
| **Willingness** | 25% | GO+ savings, bill payment timeliness, PayLater repayment |

---

## 🎯 Score Tiers & Product Matching

Based on the TNG Aura Score, users are matched to appropriate financial products — not rejected outright.

| Tier | Score Range | Profile | Recommended Product |
|---|---|---|---|
| 🟢 **Aura Platinum** | 750 – 1000 | Highly reliable, consistent behavior | Micro-loan (up to RM5,000), Higher PayLater limit |
| 🔵 **Aura Gold** | 500 – 749 | Stable with moderate discipline | BNPL, PayLater, micro-insurance |
| 🟡 **Aura Silver** | 300 – 499 | Some irregularity, potential | Small BNPL, financial literacy program |
| 🔴 **Aura Seed** | 0 – 299 | New or thin profile | Savings challenge, GO+ onboarding, score-building journey |

> **Key philosophy:** Every user gets *something*. Even Aura Seed users are onboarded into a **score-building journey** — not a rejection screen.

---

## 🔄 The User Journey

```
User Opens TNG App
        │
        ▼
 Hyper Profiling runs silently
 on existing behavioral data
        │
        ▼
  TNG Aura Score generated
        │
        ▼
 User sees personalized
 financial product offer
        │
     ┌──┴──┐
     │     │
  Accept  Not now
     │     │
     ▼     ▼
  Product  Score-building
 activated  nudge shown
```

---

## 🔒 Privacy & Ethics

- All profiling runs on **aggregated behavioral patterns**, not raw transaction surveillance.
- Users are given **full transparency** — they can view their Aura Score breakdown in-app.
- Users can **opt-in** to share additional data for a better score.
- No data is sold or shared with third parties outside of product matching.
- Compliant with **PDPA (Personal Data Protection Act) Malaysia**.

---

## 🏆 Why This Wins

| Traditional Banks | TNG Hyper Profiling |
|---|---|
| Requires payslip | No payslip needed |
| Depends on CCRIS/CTOS | Fully independent scoring |
| Rejects thin-file users | Onboards and grows them |
| Static credit score | Dynamic, real-time profiling |
| One-size-fits-all | Hyper-personalized product matching |
| Excludes gig economy | Built *for* gig economy |

---

*TNG Hyper Profiling — Powering financial inclusion, one transaction at a time.*
