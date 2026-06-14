# DEVELOPMENT.md — How to Run & Verify

> Last updated: 2026-04-28

## Commands

| Command | Purpose |
|---------|---------|
| `make setup` | First-time setup (deps + DB + migrations) |
| `make rundev` | Start Postgres (Docker) + FE (3001) + BE (9000) |
| `make db-migrate` | Run migrations manually |
| `make db-reset` | Reset DB + re-run migrations |

## Ports

| Service | Port |
|---------|------|
| Next.js (FE) | 3001 |
| Go Gin (HTTP) | 9000 (not 8080 — Docker Desktop uses 8080) |
| Go gRPC | 50051 |
| PostgreSQL | 5432 (Docker: `mono-repo-postgres`) |

## Migration Model

- GORM AutoMigrate = table/column creation ONLY
- Renames / drops / constraints → explicit SQL migration files
- Migration code: `internal/infrastructure/adapter/persistence/gorm/{feature}/migration.go`
- SQL files: `apps/backend-go/migrations/`

## Notes

- Backend Go must be restarted manually after route changes: `pkill -f 'go run cmd/server'`
- You do NOT manage containers, ports, or credentials

## Verify (before finishing any task)

```bash
go build ./...     # Backend compiles
pnpm lint          # FE lint
pnpm typecheck     # FE types
rg <old-name>      # Zero leftover refs (if rename)
```
