# CAPSTACK-2k25

A multi-service monorepo for personal financial health management with AI-powered insights.

## Overview

CAPSTACK is a comprehensive financial wellness platform that helps users:
- Track income and expenses
- Automate savings with smart locking mechanisms
- Calculate financial health scores
- Predict emergency survival periods
- Receive personalized financial insights and alerts

## Architecture

The project consists of three main services:

### Backend API (`backend-api/`)
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (with Prisma/TypeORM ready)
- **Cache**: Redis
- **Features**: RESTful APIs for user management, finance calculations, savings automation

### ML Service (`ml-service/`)
- **Framework**: FastAPI + Python
- **ML Stack**: scikit-learn, pandas, numpy
- **Features**: Risk scoring, survival prediction, health score calculation

### Frontend (`frontend/`)
- **Framework**: Next.js + TypeScript + Material UI
- **Features**: Responsive web app with dashboard, onboarding, and insights

## Folder Structure

```
CAPSTACK/
├── backend-api/          # Node.js Express API
├── ml-service/           # FastAPI ML service
├── frontend/             # Next.js React app
├── database/             # SQL migrations and seeds
├── infra/                # Docker configs and deployment
├── analytics/            # Jupyter notebooks and reports
├── docs/                 # Documentation and PDFs
├── .gitignore
└── README.md
```

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL & Redis (or use Docker)

### Quick Start with Docker
```bash
# Clone and navigate to project
cd CAPSTACK

# Start all services
docker-compose -f infra/docker-compose.yml up --build

# Access services:
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000
# ML Service: http://localhost:8000
```

### Manual Setup

#### Backend API
```bash
cd backend-api
npm install
npm run dev  # Development
npm run build && npm start  # Production
```

#### ML Service
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` files in each service directory:

### backend-api/.env
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/capstack
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

### ml-service/.env (if needed)
```
# Add ML service environment variables
```

### frontend/.env.local
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_ML_URL=http://localhost:8000
```

## API Documentation

- Backend API docs: Available at `/docs` when running
- ML Service docs: Available at `/docs` when running

## Testing

```bash
# Backend tests
cd backend-api && npm test

# Frontend tests (when implemented)
cd frontend && npm test
```

## Deployment

See `infra/` directory for Docker and deployment configurations.

## Contributing

1. Follow the established folder structure
2. Add tests for new features
3. Update documentation
4. Use TypeScript for type safety

## License

TODO: Add license information
