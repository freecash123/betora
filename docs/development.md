# BETORA Development

## Quick Start
```bash
cd backend && npm install && npm run dev  # :4000
cd frontend && npm install && npm run dev # :3000
psql -d betora -f database/migrations/*.sql
psql -d betora -f database/seeds/001_demo_data.sql
```

## Structure
- `frontend/` — Next.js 14
- `backend/` — NestJS
- `database/` — PostgreSQL migrations
- `shared/` — Types, constants

## Conventions
- TypeScript strict mode
- Service-layer pattern (backend)
- Functional components with hooks (frontend)
- Zustand for state management
- Parameterized queries (no raw SQL)