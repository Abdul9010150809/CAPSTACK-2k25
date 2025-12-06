# Backend API

Node.js + TypeScript + Express backend for CAPSTACK.

## Setup

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Start: `npm run start`
4. Dev mode: `npm run dev`
5. Test: `npm run test`

## Environment Variables

- `PORT`: Server port (default 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT secret key
- `REDIS_URL`: Redis connection string

## API Endpoints (quick reference)

### Auth
- `POST /auth/login`: User login
- `POST /auth/register`: User registration
- `POST /auth/guest`: Guest token (limited/demo access)

### Finance (guest-friendly)
- `POST /finance/calculate` (optional auth): Core finance calc
- `GET /finance/healthscore` (optional auth): Health score
- `GET /finance/survival` (optional auth): Survival estimate
- `GET /finance/incomescore` (optional auth): Income score
- `GET /finance/insights` (optional auth): Personalized when authed; returns demo insights for guests (prevents 401/403)
- `GET /finance/asset-allocation` (optional auth): Personalized when authed; returns demo allocation + formulas for guests
- `POST /finance/asset-allocation/update` (auth required): Persist allocation
- `GET /finance/emergency-status` (optional auth): Personalized when authed; returns demo emergency-fund status for guests (fixes 403s)
- `POST /finance/emergency-simulation` (optional auth): Personalized simulation when authed; demo scenarios for guests
- `GET /finance/trends/:period` (auth required)
- `POST /finance/sip-plan` (no auth required)

### Savings (discipline engine)
- `GET /savings/status` (optional auth): Personalized when authed; demo savings snapshot for guests
- `GET /savings/insights` (optional auth): Personalized when authed; demo discipline insights for guests
- `POST /savings/plan` (auth required): Create plan
- `POST /savings/lock` (auth required)
- `POST /savings/unlock/:planId` (auth required)
- `POST /savings/check-transaction` (auth required)
- `POST /savings/process-transaction` (auth required)
- `POST /savings/auto-save` (auth required)

### Health
- `GET /health`: Service health check

> Guest/demo responses are returned when no JWT or a guest token is provided. Mutations still require full auth to avoid data corruption.