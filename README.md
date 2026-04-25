# GOAura — TNG HyperPersonal

> Financial inclusion engine for Malaysia's underserved wallet users.

Built for **TNG Hackathon 2026** by the GOAura team.

---

## The Problem

Malaysia has 18M+ TNG wallets — but 40% of users are unbanked or B40.  
They leave an average of **RM 308/month** in cashbacks and government aid unclaimed, simply because no one surfaces it for them.

## The Solution

Three layers. One wallet. Zero friction.

| Layer | What it does |
|---|---|
| **SmartBenefit Card** | Auto-configures cashback rates from the user's top 3 spend categories — recalculated monthly, no card required |
| **AI Financial Coach** | Reads transaction history and tells users exactly what to do to save more — in Bahasa or English |
| **Benefits Hub** | One-tap claim for cashbacks, government subsidies (MySejahtera, BSH, Rahmah), insurance, and micro-credit — pre-filled from TNG + MyKad data |

## User Personas

- **Ahmad, 28** — Grab driver with no bank account. 340 TNG transactions become his credit identity. Unlocks fuel cashback, PA insurance, and micro-credit.
- **Siti, 35** — B40 single parent. Her spend data reveals RM 308/month in unclaimed gov aid. Coach guides her to claim it all in under 10 minutes.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Live Coach (Alibaba Cloud / DashScope)

By default, the Coach runs in demo mode (canned replies). To enable a live LLM-backed Coach in dev, create `.env.local`:

```bash
DASHSCOPE_API_KEY=sk-...        # keep this secret; do not commit
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen-plus
```

Then restart `npm run dev`. The frontend calls a local dev-only endpoint at `POST /api/coach`, so the API key never ships to the browser.

## Tech Stack

- React 18 + Vite
- CSS Modules (no framework dependency)
- Mobile-first, offline-capable

## Project Structure

```
src/
├── components/
│   ├── PhoneFrame.jsx     # Mobile shell + tab navigation
│   ├── HomeScreen.jsx     # Dashboard: TNG score, coach tip, spend breakdown
│   ├── CoachScreen.jsx    # AI coach chat with persona-specific flows
│   ├── BenefitsScreen.jsx # One-tap benefit claiming with live progress
│   └── BudgetScreen.jsx   # Live budget with before/after toggle
├── styles/
│   ├── globals.css
│   └── app.css
└── App.jsx                # Persona switcher + root layout
```

---

*Every ringgit spent is a step toward financial inclusion.*
