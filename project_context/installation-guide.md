# Installation Guide

> Last updated: 2026-04-28

> First-time / manual setup only. For day-to-day commands, ports, and verify steps → see `DEVELOPMENT.md`.

## Prerequisites
- Node.js 18+, Go 1.23+, pnpm 8+, Docker

## Manual Setup
> Prefer `make setup` (see `DEVELOPMENT.md`). Use the steps below only when doing setup by hand.
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
