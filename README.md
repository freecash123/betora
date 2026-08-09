# 🎲 BETORA — Premium Sportsbook Platform

**BETORA** is a complete, production-quality sportsbook platform with a modern dark interface, real-time live betting, comprehensive wallet with double-entry ledger, KYC/AML compliance, responsible gambling controls, and a full-featured admin dashboard.

> ⚠️ **BETORA DEMO MODE** — Real-money betting is disabled by default. Operators must obtain all required gambling licences, payment arrangements, KYC/AML systems, age verification, responsible gambling controls, and other regulatory approvals before enabling real-money functionality.

---

## 📸 Brand

**Brand Colours**: Primary `#FF6B2B` (Vibrant Orange) · Background `#0F0F1A` (Near Black) · Accent `#00D4AA` (Teal Green)

---

## 🏗️ Architecture

```
betora/
├── frontend/          # Next.js 14 + React + TypeScript + Tailwind CSS
├── backend/           # NestJS + Prisma + PostgreSQL + Redis + WebSockets
├── database/          # SQL migrations & seed data
├── shared/            # Shared types, constants, utilities
├── docs/              # Documentation
├── tests/             # Test suites
├── scripts/           # Build/deploy scripts
└── .github/           # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+, **PostgreSQL** 15+, **Redis** 7+

### Setup
```bash
git clone https://github.com/freecash123/betora.git
cd betora
cd backend && npm install
cd ../frontend && npm install
cp .env.example .env
```

### Database
```bash
for f in database/migrations/*.sql; do psql -d betora -f "$f"; done
psql -d betora -f database/seeds/001_demo_data.sql
```

### Start
```bash
cd backend && npm run dev  # → http://localhost:4000
cd frontend && npm run dev # → http://localhost:3000
```

## 🎮 Demo Mode
- ✅ Simulated sports events with live odds
- ✅ Demo wallet with $10,000 balance
- ✅ Full betting functionality (no real money)
- ❌ Real deposits/withdrawals disabled

## Features
- ⚽ Football, 🏀 Basketball, 🎾 Tennis, 🎮 Esports + 6 more
- Pre-match & live betting with WebSocket updates
- Interactive bet slip with single/accumulator bets
- Double-entry ledger wallet with optimistic locking
- KYC/AML with multi-level verification
- Responsible gambling controls (limits, self-exclusion)
- Admin dashboard with audit logs
- 25+ granular RBAC permissions

## 📦 Deployment
See `docs/DEPLOYMENT.md` for production deployment guide.

## ⚖️ Legal
BETORA is an original sportsbook platform. Real-money betting must remain disabled until operators obtain all required licences and regulatory approvals.