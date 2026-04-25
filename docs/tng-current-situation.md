# TNG eWallet — Current Situation: Analytics, Credit Scoring & Fraud Detection

> *Research snapshot as of April 2026*

---

## 📍 Overview

Touch 'n Go eWallet (operated by TNG Digital Sdn Bhd) is Malaysia's leading digital wallet with **over 24 million verified users** and a merchant network of over **2 million payment points** nationwide. It achieved unicorn status in August 2025 and processes over **RM7 billion in Total Payment Value (TPV) per month**.

Despite its scale and data richness, TNG's financial profiling capabilities remain heavily tied to **traditional credit infrastructure** — leaving a significant gap for innovation.

---

## 🏗️ Current Tech Infrastructure

TNG eWallet is powered by **Alibaba Cloud**, which enables:

| Capability | Tool Used | Purpose |
|---|---|---|
| Data analytics | Alibaba Cloud PAI | Credit scoring & fraud detection (backend) |
| Natural language processing | Qwen | Customer service & engagement |
| Biometric authentication | Zoloz | eKYC & identity verification |
| Scalable compute | Elastic Compute Service (ECS) | Handle peak transaction loads |
| Data integration | DataWorks | Unified data pipeline across services |

> ⚠️ All of the above are **backend infrastructure** — invisible to users. There is no user-facing analytics or scoring product built on these capabilities yet.

---

## 💳 Current Financial Products (GOfinance)

TNG's financial arm, **GOfinance**, offers the following products:

| Product | Description | Credit Assessment Used |
|---|---|---|
| **GO+** | High-yield savings (up to 3.5% p.a., max RM20,000) | None — savings product |
| **CashLoan** | Personal micro-loan facility | ✅ CTOS integrated |
| **PayLater / Revolving Credit** | BNPL at all payment points | Likely CCRIS/CTOS dependent |
| **GOInvest** | Unit trusts, ASNB, gold & share trading | None — investment product |
| **Insurance** | Essential protection products | Basic eligibility check |
| **Remittance** | International money transfers | None — transfer product |
| **TNG Visa Card** | Physical/virtual card linked to eWallet | Basic eKYC |

### Key Observation
Despite having rich behavioral data on 24M+ users, **CashLoan still uses CTOS** as the primary credit assessment tool — meaning gig workers and unbanked users are still being filtered out by the traditional system.

---

## 🚨 Current Fraud Detection Capabilities

TNG does run an active fraud detection system powered by behavioral analytics:

### What They Currently Detect
- **Account takeover** — unusual login device, location, or time
- **Transaction anomalies** — amounts or frequency outside user's normal pattern
- **Identity fraud** — caught at eKYC stage via Zoloz biometric verification
- **Merchant fraud** — fake merchants attempting to collect illegitimate payments
- **Money mule activity** — unusual high-volume transfers to unknown accounts

### How It Works (Current Approach)
```
Every TNG Transaction
        │
        ▼
Real-time Behavioral Analysis (Alibaba Cloud PAI)
        │
        ├── Matches user's historical pattern? → ✅ Allow
        │
        └── Anomaly detected? → ⚠️ Flag → Block / Alert User
```

### Limitations
- Fraud detection is **reactive** — it flags anomalies after patterns are established
- New users with thin behavioral history are harder to protect
- No **user-transparent risk score** is surfaced back to the user

---

## 📊 Current Credit Scoring Situation

### What TNG Does Today
- Uses **CTOS** directly within the app for CashLoan eligibility
- Backend data analytics exist but are used internally for **business intelligence**, not user credit profiling
- No behavioral-based alternative scoring model is publicly available
- No score-building journey exists for users who fail CTOS/CCRIS checks

### The Gap — Who Gets Left Out

| User Segment | Size | TNG's Current Response |
|---|---|---|
| Gig workers (Grab, Foodpanda, Lalamove) | ~1.2M+ | ❌ Rejected via CTOS |
| Informal traders / hawkers | Large | ❌ No credit product available |
| Fresh graduates | Growing | ❌ Thin credit file = rejected |
| Underbanked rural users | Significant | ❌ Limited banking access |
| Low-income urban workers | Large | ❌ Rejected or ignored |

> These users are **credit invisible** — not because they are irresponsible, but because the assessment tool was never designed for them.

---

## 🔄 Planned Developments (2024–2025 Roadmap)

Based on public announcements, TNG Digital has planned:

- ✅ **Revolving credit facility** — BNPL at every payment point (not just selected merchants)
- ✅ **New lending product** — lower interest rates, greater flexibility
- ✅ **GOInvest expansion** — gold trading, share trading
- ✅ **Merchant wallet & financial services** — targeting SMEs
- ✅ **100% eKYC** — first eWallet in Malaysia to fully implement biometric verification
- ❌ **No announced alternative credit scoring** for gig workers or unbanked segments

---

## 🎯 The Opportunity Gap — Where TNG Hyper Profiling Fits

```
What TNG Has                    What TNG Is Missing
─────────────────               ─────────────────────────────
✅ 24M+ user behavioral data    ❌ No behavioral credit scoring
✅ Fraud detection pipeline     ❌ No user-facing Aura/Trust Score
✅ Alibaba Cloud PAI analytics  ❌ No score-building journey
✅ Rich mobility data (toll,    ❌ No alternative product path
   transit, RFID)                  for rejected users
✅ Transaction history          ❌ Still gatekeeping via CTOS
✅ GO+ savings behavior         ❌ Gig workers remain excluded
```

### The Pitch in One Line
> *"TNG has the data, TNG has the infrastructure, TNG has the products — but they're still using the old CCRIS/CTOS gatekeeping system. TNG Hyper Profiling closes that gap."*

---

## 📌 Summary

| Dimension | Current Status |
|---|---|
| Data Infrastructure | ✅ Strong — Alibaba Cloud, PAI analytics |
| Fraud Detection | ✅ Active — real-time behavioral anomaly detection |
| Credit Scoring | ⚠️ Weak — still depends on CTOS/CCRIS |
| User-Facing Score | ❌ None — no transparency to users |
| Gig Worker Support | ❌ None — excluded by traditional credit tools |
| Alternative Profiling | ❌ Not announced, not implemented |
| Score-Building Journey | ❌ Does not exist |

---

*Sources: TNG Digital public announcements, Grokipedia TNG eWallet overview (2025), SoyaCincau TNG Digital 2024 roadmap briefing, App Store / Google Play GOfinance feature listing.*
