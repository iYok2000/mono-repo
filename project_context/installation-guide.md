# Installation Guide

> Last updated: 2026-04-28

## Prerequisites
- Node.js 18+, Go 1.23+, pnpm 8+, Docker

## Quick Start
```bash
make setup    # Install deps + start DB + run migrations
make rundev   # Start Postgres (Docker) + FE (3001) + BE (9000)
```

## Manual Setup
```bash
# 1. Install pnpm
npm install -g pnpm

# 2. Install dependencies
pnpm install

# 3. Go dependencies
cd apps/backend-go && go mod download

# 4. Start Postgres via Docker
docker compose up -d

# 5. Run migrations
make db-migrate

# 6. Start dev
pnpm dev
```

## Workspace Config
- `pnpm-workspace.yaml`: `apps/*`, `packages/*`
- Package: `@mono-repo/web` (FE), `@mono-repo/backend-go` (BE)
- Shared types: `@mono-repo/shared-types`
- Go module: `mono-repo/backend-go`
- Go framework: Gin + CORS middleware
