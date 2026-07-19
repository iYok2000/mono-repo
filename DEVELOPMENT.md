# DEVELOPMENT.md — How to Run & Verify

> Last updated: 2026-04-28

## Commands

| Command | Purpose |
|---------|---------|
| `make setup` | First-time setup (deps + DB + migrations) |
| `make rundev` | Start Postgres (Docker) + FE (3000) + BE (8080) |
| `make db-migrate` | Run migrations manually |
| `make db-reset` | Reset DB + re-run migrations |

## Ports

| Service | Port |
|---------|------|
| Next.js (FE) | 3000 (`next dev` default) |
| Go Gin (HTTP) | 8080 (`HTTP_PORT` in `.env`, default 8080) |
| Go gRPC | 50051 — disabled by default (`ENABLE_GRPC=false`) |
| PostgreSQL | 5432 |

> FE clients are inconsistent on the backend port (some default `:9000`, some `:8080`).
> Backend listens on `HTTP_PORT` (= 8080). Set `NEXT_PUBLIC_GO_API_URL` to align FE.

## Migration Locations

> Rules (AutoMigrate = additive only, renames/drops → explicit SQL) live in `AGENT.md`.

- Migration code: `internal/infrastructure/adapter/persistence/gorm/{feature}/migration.go`
- SQL files: `apps/backend-go/migrations/`

## Notes

- Backend Go must be restarted manually after route changes: `pkill -f 'go run cmd/server'`
- You do NOT manage containers, ports, or credentials

## Verify

Run the verify checklist in `AGENT.md` §4 before finishing any task
(`go build ./...`, `pnpm lint`, `pnpm typecheck`, `rg <old-name>`).
