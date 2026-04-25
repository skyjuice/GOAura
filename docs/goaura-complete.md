# GoAura — Complete Documentation
### Alternative Behavioral Credit Profiling for TNG eWallet

> **Tagline:** *"CCRIS and CTOS tell you who someone was. GoAura tells you who someone is — right now, today, based on how they actually live."*

> *Last updated: April 2026*

---

## 📌 Table of Contents
1. [The Problem](#the-problem)
2. [The Core Idea](#the-core-idea)
3. [Target User Segments](#target-user-segments)
4. [TNG Current Situation](#tng-current-situation)
5. [Data Signals](#data-signals)
6. [How Behavior Is Identified](#how-behavior-is-identified)
7. [Profiling Architecture](#profiling-architecture)
8. [The Scoring Algorithm](#the-scoring-algorithm)
9. [Score Tiers & Product Matching](#score-tiers--product-matching)
10. [Foreigner Rules — BNM Compliance](#foreigner-rules--bnm-compliance)
11. [Blacklisted Users — How GoAura Handles Them](#blacklisted-users--how-goaura-handles-them)
12. [Privacy & Ethics](#privacy--ethics)
13. [Why GoAura Wins](#why-goaura-wins)

---

## 1. The Problem

Traditional financial institutions rely on **CCRIS** and **CTOS** to determine creditworthiness. This system works for salaried employees — but it completely excludes a massive segment of the Malaysian population.

These users are **credit invisible** — not because they are irresponsible, but because the assessment system was never designed for them.

### Who Gets Left Out

| Segment | Why They're Excluded |
|---|---|
| Gig workers (Grab, Foodpanda, Lalamove, etc.) | No payslip, irregular income |
| Low-income workers | Thin credit file |
| Blacklisted individuals | Permanently rejected regardless of current behavior |
| Legal foreign workers & expats | No Malaysian credit history |
| Fresh graduates | No credit history at all |
| Underbanked rural communities | Limited banking access |

---

## 2. The Core Idea

**GoAura** is an independent alternative financial profiling engine built entirely on **behavioral and transactional data** within the TNG ecosystem.

No CCRIS. No CTOS. No payslip required.

Instead of asking:
> *"What does your bank say about you?"*

GoAura asks:
> *"How do you actually live, spend, save, and move — every single day?"*

TNG already has this data across 24M+ users. GoAura uses it intelligently.

### The 3 Simple Questions GoAura Asks

```
Question 1 → "Do they have enough money?"     (CAPACITY)
Question 2 → "Is their money coming regularly?" (STABILITY)
Question 3 → "Do they manage money well?"      (WILLINGNESS)

All 3 combined = GoAura Aura Score (0–1000)
```

### The Simplest Analogy

> Imagine you want to lend money to a friend. You don't ask for their payslip. You just remember:
> - Do they usually have money?
> - Do they get paid regularly?
> - Have they ever borrowed and not paid back?
>
> **GoAura is that memory — but for 24 million TNG users.**

---

## 3. Target User Segments

GoAura serves **5 underserved user segments** that traditional banks reject:

| Segment | Traditional Bank | GoAura |
|---|---|---|
| Gig workers | ❌ Rejected — no payslip | ✅ Behavioral scoring |
| Low-income workers | ❌ Rejected — thin file | ✅ Behavioral scoring |
| Blacklisted individuals | ❌ Permanently rejected | ✅ Score based on current behavior |
| Legal foreigners | ❌ Rejected — no credit history | ✅ Salary + behavior scoring |
| Unbanked / fresh graduates | ❌ No history | ✅ Score-building journey |

---

## 4. TNG Current Situation

### Overview
TNG eWallet has over **24 million verified users**, processes **RM7 billion+ TPV per month**, and achieved unicorn status in August 2025.

### Current Tech Infrastructure

| Capability | Tool | Purpose |
|---|---|---|
| Data analytics | Alibaba Cloud PAI | Credit scoring & fraud detection (backend only) |
| NLP | Qwen | Customer service |
| Biometric auth | Zoloz | eKYC & identity verification |
| Scalable compute | ECS | Handle peak loads |
| Data integration | DataWorks | Unified data pipeline |

> ⚠️ All backend — **no user-facing scoring or profiling product exists.**

### Current Financial Products

| Product | Credit Tool Used |
|---|---|
| GO+ (savings) | None |
| CashLoan | ✅ CTOS — traditional |
| PayLater / Revolving Credit | Likely CCRIS/CTOS |
| GOInvest | None |
| Insurance | Basic eligibility |
| TNG Visa Card | Basic eKYC |

### Current Fraud Detection
TNG uses real-time behavioral anomaly detection — flagging unusual login locations, transaction spikes, and suspicious transfer patterns. However this system is **reactive and invisible to users.**

### The Gap GoAura Fills

```
What TNG Has                     What TNG Is Missing
────────────────────             ─────────────────────────────
✅ 24M+ behavioral data          ❌ No behavioral credit scoring
✅ Fraud detection pipeline      ❌ No user-facing Aura/Trust Score
✅ Alibaba Cloud PAI analytics   ❌ No score-building journey
✅ Rich mobility data            ❌ No alternative product path
✅ GO+ savings behavior          ❌ Gig workers remain excluded
✅ Transaction history           ❌ Still gatekeeping via CTOS
```

---

## 5. Data Signals

GoAura reads **5 categories of behavioral signals** from TNG transaction data:

### 💳 Category 1 — Transaction Behavior
| Signal | What It Tells Us |
|---|---|
| Reload frequency & amount | Cash flow rhythm |
| Spending consistency | Month-to-month income regularity |
| Merchant category mix | Essential vs lifestyle spending |
| Reload-to-spend ratio | Financial discipline |
| GoPayment / merchant activity | Possible micro-business owner |

### 🚗 Category 2 — Mobility & Lifestyle
| Signal | What It Tells Us |
|---|---|
| Daily toll usage (RFID) | Active employment or gig activity |
| Consistent travel routes | Stable lifestyle |
| LRT / MRT / Bus usage | Cost-conscious behavior |
| Geographic consistency | Settled, not transient |
| RFID vehicle registration | Asset ownership |

### 📅 Category 3 — Financial Discipline
| Signal | What It Tells Us |
|---|---|
| Bill payments via TNG | Timeliness = responsible payer |
| GO+ savings behavior | Saving even small amounts = discipline |
| PayLater repayment history | Did they repay on time? |
| Balance cushion maintained | How close to zero do they go? |
| Overspend immediately after reload | Impulsive vs disciplined |

### 📱 Category 4 — App Engagement
| Signal | What It Tells Us |
|---|---|
| App open frequency | Active and financially engaged |
| Profile completeness | IC verified, bank linked = trust |
| Feature adoption breadth | Using GO+, PayLater = financially literate |

### 🛒 Category 5 — Consumption Patterns
| Signal | What It Tells Us |
|---|---|
| E-commerce spend | Purchasing power |
| Food delivery frequency | Some disposable income |
| Essential vs entertainment ratio | Lifestyle balance |
| Seasonal spending behavior | Do they overspend during festive periods? |

---

## 6. How Behavior Is Identified

### The Transformation — Raw Transactions → Behavior

```
Layer 1 — Raw Transactions     (what happened)
         ↓
Layer 2 — Behavioral Metrics   (what it means)
         ↓
Layer 3 — Dimension Score      (what it says about the person)
```

### Key Behavioral Metrics Computed

**Capacity Metrics**
```
monthly_inflow       = sum of all reloads in a month
monthly_outflow      = sum of all payments in a month
net_cash_flow        = monthly_inflow - monthly_outflow
spending_volatility  = standard deviation of monthly spend
has_recurring_income = detected if large inflows repeat on similar dates
```

**Stability Metrics**
```
reload_interval_consistency = std dev of days between reloads
commute_streak              = consecutive weeks with toll/transit usage
recurring_merchant_count    = number of merchants visited 3x+ per month
```

**Willingness Metrics**
```
bill_on_time_rate     = bills paid on/before due date ÷ total bills
savings_frequency     = months with GO+ top-up activity
min_balance_cushion   = average minimum wallet balance maintained
post_reload_behavior  = how quickly balance drops after reload
```

### The RM 4,000 Case — Same Income, Different Score

A person earning and spending RM 4,000/month doesn't automatically fail.
GoAura looks at **how** the money moves, not just the total.

```
Person A — Same RM 4,000 → APPROVED ✅
- Income arrives weekly (consistent gig pattern)
- Essential spending: groceries, transport, utilities
- Bills paid on time
- Saves RM 200 in GO+ every month despite tight budget
- No sudden spikes

Person B — Same RM 4,000 → NOT READY ❌
- All income arrives in one lump sum
- RM 2,000 spent in first 5 days on lifestyle
- Bills paid late consistently
- Wallet hits RM 0 multiple times
- Zero savings
```

> **Key Insight:** *It's not about how much you earn or spend. It's about HOW you manage what you have.*

---

## 7. Profiling Architecture

### The 3 Scoring Dimensions

| Dimension | Weight | What It Measures | Key Signals |
|---|---|---|---|
| **Capacity** | 40% | Can they repay? | Reload volume, net cash flow, recurring income |
| **Stability** | 35% | Is income consistent? | Reload regularity, toll patterns, merchant loyalty |
| **Willingness** | 25% | Do they manage well? | GO+ savings, bill timeliness, balance cushion |

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   GOAURA PROFILING ENGINE                   │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│   │  CAPACITY   │  │  STABILITY  │  │   WILLINGNESS    │  │
│   │   (40%)     │  │   (35%)     │  │     (25%)        │  │
│   └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘  │
│          │                │                   │            │
│          └────────────────┼───────────────────┘            │
│                           ▼                                │
│                  ┌─────────────────┐                       │
│                  │  AURA SCORE     │                       │
│                  │   0  —  1000    │                       │
│                  └────────┬────────┘                       │
│                           │                                │
│         ┌─────────────────┼──────────────────┐            │
│         ▼                 ▼                  ▼             │
│     🟢 HIGH           🟡 MEDIUM          🔴 LOW            │
└─────────────────────────────────────────────────────────────┘
```

### Cold Start Problem — New Users With Little Data

```
Has 6+ months TNG data?   → Full scoring model
Has 1–6 months data?      → Partial model (mobility + engagement only)
Brand new user?           → Baseline score (300) + onboarding quiz
```

The onboarding quiz asks soft questions — employment type, monthly expense range, housing — to bootstrap the score without any formal documents.

---

## 8. The Scoring Algorithm

GoAura uses a **rule-based behavioral scoring algorithm** — not a traditional ML model. This makes it transparent, explainable, and fast to implement.

> *"An algorithm is just a set of rules that takes input, follows steps, and gives an output."*

### Algorithm vs Machine Learning

| | Rule-Based Algorithm | Machine Learning |
|---|---|---|
| Who writes the rules? | Developer (logical reasoning) | Model learns from data |
| Transparency | High — fully explainable | Lower — black box |
| Build speed | Fast | Needs large labeled dataset |
| Best for | Hackathon & MVP | Production at scale |

**GoAura Hackathon Version → Rule-Based Algorithm ✅**
**GoAura Future Version → ML fine-tunes the weights based on repayment data 🚀**

### Core Algorithm (Simplified)

```javascript
function calculateAuraScore(user) {

  // CAPACITY — Can they repay?
  let capacity = 0
  if (user.avgMonthlyInflow > 1000)       capacity += 40
  else if (user.avgMonthlyInflow > 500)   capacity += 25
  else if (user.avgMonthlyInflow > 200)   capacity += 10
  if (user.spendingVolatility < 0.2)      capacity += 30
  if (user.hasRecurringIncome)            capacity += 30

  // STABILITY — Is income consistent?
  let stability = 0
  if (user.reloadConsistency > 0.8)       stability += 40
  if (user.tollDaysPerWeek > 3)           stability += 30
  if (user.recurringMerchantCount > 3)    stability += 30

  // WILLINGNESS — Do they manage money well?
  let willingness = 0
  if (user.billOnTimeRate > 0.8)          willingness += 40
  if (user.usesGoPlus)                    willingness += 30
  if (user.minBalanceCushion > 50)        willingness += 30

  // Combine into Aura Score (0–1000)
  const auraScore = (
    (capacity   * 0.40) +
    (stability  * 0.35) +
    (willingness * 0.25)
  ) * 10

  return Math.round(auraScore)
}
```

---

## 9. Score Tiers & Product Matching

Based on the Aura Score, users are matched to appropriate TNG products — not rejected outright.

| Tier | Score | Profile | Recommended TNG Product |
|---|---|---|---|
| 🟢 **Aura Platinum** | 750–1000 | Highly reliable, consistent | Microloan up to RM5,000, higher PayLater limit |
| 🔵 **Aura Gold** | 500–749 | Stable with good discipline | CashLoan, PayLater, GOInvest access |
| 🟡 **Aura Silver** | 300–499 | Some irregularity but potential | Small BNPL, micro-insurance |
| 🔴 **Aura Seed** | 0–299 | New or thin profile | GO+ savings challenge, score-building journey |

> **Key philosophy:** Every user gets *something*. Even Aura Seed users are onboarded into a **score-building journey** — not a rejection screen.

### User Journey

```
User Opens TNG App
        │
        ▼
GoAura runs silently on existing behavioral data
        │
        ▼
Aura Score generated
        │
        ▼
Personalized financial product offer shown
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

## 10. Foreigner Rules — BNM Compliance

### BNM Residency Classification

| Type | Who They Are | GoAura Treatment |
|---|---|---|
| **Resident** | Malaysian OR foreigner with valid long-term pass (employment, MM2H) | Full scoring |
| **Non-Resident** | Tourist, short-term visitor | Limited — insufficient data |

### Key BNM Rules That Apply

**Rule 1 — eWallet Account ✅**
Foreigners are legally allowed to open and maintain a TNG eWallet account. GoAura can observe and score their behavior.

**Rule 2 — Ringgit Lending ⚠️**
Non-residents may borrow in Ringgit only for Real Sector Activities in Malaysia (e.g., property purchase). Personal loans used to remit money overseas are not permitted.

**Rule 3 — AML/CFT Requirements (Strict)**
BNM 2025 e-money policy requires enhanced Customer Due Diligence on all users — especially foreigners, who are treated as higher-risk by default. Source of funds verification and lower transaction limits apply.

**Rule 4 — TNG Was Already Fined**
In May 2023, BNM fined TNG Digital RM600,000 for AML/CFT failures — showing BNM is very serious about compliance.

### Foreigner Eligibility Matrix

| Foreigner Type | Can Use TNG? | GoAura Can Score? | Microloan? |
|---|---|---|---|
| Expat / MM2H / Employment Pass | ✅ Yes | ✅ Yes | ✅ Yes (treated as resident) |
| Foreign worker (valid permit) | ✅ Yes | ✅ Yes | ⚠️ Small amount, strict AML |
| Student pass holder | ✅ Yes | ⚠️ Limited data | ❌ High risk |
| Tourist / visitor | ✅ Limited | ❌ Too little data | ❌ Not viable |
| Undocumented foreigner | ❌ Cannot open TNG | ❌ No | ❌ No |

### GoAura Foreigner Compliance Framework

```
GoAura for foreigners:
1. Only targets legally documented foreigners (valid pass holders)
2. Microloan proceeds restricted to use within Malaysia only
3. Enhanced AML checks applied automatically
4. Loan limits capped at RM 200–500 for first loan
5. Flight risk signals monitored (remittance patterns, tenure in Malaysia)
6. Fully compliant with BNM AML/CFT 2025 framework
```

### Strong Behavioral Signals for Foreigners

```
Long-term positive signals:
- 2+ years of consistent TNG history      → Settled in Malaysia ✅
- Regular rent / utility payments         → Has stable address ✅
- Consistent remittance to same country   → Predictable behavior ✅
- Regular commute patterns via toll/LRT   → Actively employed ✅
- GO+ savings activity                    → Financially disciplined ✅
```

### The Pitch Angle for Foreigners

> *"A Bangladeshi construction worker who has been in Malaysia for 3 years, pays rent via TNG, sends remittance consistently, and saves in GO+ — is more financially trustworthy than a Malaysian with a thin CCRIS file. GoAura sees that."*

---

## 11. Blacklisted Users — How GoAura Handles Them

### The Core Principle

```
Blacklisted = Had debt and didn't pay in the past
             ≠ Permanently irresponsible forever
```

A person can be blacklisted but have **since changed their behavior.** GoAura detects this.

### How GoAura Reads a Reformed User

```
Past (why they got blacklisted)       Now (what GoAura sees today)
─────────────────────────────         ──────────────────────────────
Missed loan payments                  Bills paid on time ✅
Overspending                          Controlled spending ✅
No savings                            GO+ active ✅
Irregular income                      Consistent reloads ✅
```

### Decision Matrix for Blacklisted Users

| Current TNG Behavior | GoAura Decision |
|---|---|
| Excellent behavior, consistent pattern | ✅ Offer very small microloan, monitor closely |
| Good behavior, still improving | ⚠️ Score-building journey first |
| Still showing risky patterns | ❌ Not ready, offer savings program |

### The Pitch Line

> *"Banks remember your worst day forever. GoAura reads who you are today."*

---

## 12. Privacy & Ethics

- All profiling runs on **aggregated behavioral patterns**, not raw transaction surveillance
- Users are given **full transparency** — they can view their Aura Score breakdown in-app
- Users can **opt-in** to share additional data for a better score
- No data is sold or shared with third parties outside of product matching
- Fully compliant with **PDPA (Personal Data Protection Act) Malaysia**
- Fully compliant with **BNM AML/CFT 2025 e-money framework**

---

## 13. Why GoAura Wins

### GoAura vs Traditional Banks

| Traditional Banks | GoAura |
|---|---|
| Requires payslip | No payslip needed |
| Depends on CCRIS/CTOS | Fully independent scoring |
| Rejects thin-file users | Onboards and grows them |
| Rejects blacklisted users permanently | Scores current behavior |
| Rejects foreigners | Serves documented foreigners |
| Static credit score | Dynamic, real-time profiling |
| One-size-fits-all products | Hyper-personalized matching |
| Excludes gig economy | Built *for* gig economy |

### GoAura vs TNG Current State

| TNG Today | GoAura |
|---|---|
| CTOS for CashLoan | Behavioral scoring only |
| Backend analytics only | User-facing Aura Score |
| No rejection path | Score-building journey for all |
| No foreigner scoring | Compliant foreigner scoring |
| No blacklist recovery | Reformed behavior rewarded |

### The One-Line Pitch

> *"30% of Malaysians are credit invisible. TNG has 24 million users and already knows how they live. GoAura connects those two facts — and gives everyone a fair shot at financial access."*

---

*GoAura — Powering financial inclusion, one transaction at a time.*
