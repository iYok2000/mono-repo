# DEVELOPMENT.md — AI Context

This file explains how the project runs so you can reason about changes correctly.

---

## 🏃 How the project runs

* `make setup` → install deps + start DB + run migrations
* `make rundev` → start Postgres in Docker + frontend (3001) + backend (9000) + auto-migrate if needed
* PostgreSQL runs in Docker (`mono-repo-postgres`)
* Backend Go binary must be restarted manually after route changes (`pkill -f 'go run cmd/server'`)

You DO NOT manage containers, ports, or credentials.

---

## 🗄️ Migration Model (Important)

* Project uses **GORM AutoMigrate + SQL constraints**
* AutoMigrate is for table/column creation only
* Renames / drops / constraints require explicit SQL migration files
* Migration pattern lives in:
  `/internal/infrastructure/adapter/persistence/gorm/{feature}/migration.go`

---

## 🧪 Verification Commands (use before finishing)

If you cannot run them, explain where it may fail.

```
go build ./...
pnpm lint
pnpm typecheck
rg <old-name>
```

---

## 📦 Available Commands

| Command           | Purpose                        |
| ----------------- | ------------------------------ |
| `make setup`      | First-time environment setup   |
| `make rundev`     | Start development (Postgres + pnpm dev) |
| `make db-migrate` | Run migrations manually        |
| `make db-reset`   | Reset DB and re-run migrations |

---

## 📁 Related Docs

* `PROJECT_CONTEXT.md` — architecture and rules
* `DOMAIN_MAP.md` — domain ownership
* `apps/backend-go/migrations/README.md` — migration details
