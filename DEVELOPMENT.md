# DEVELOPMENT.md — AI Context

Quick reference for AI agents. Read this FIRST to avoid wrong assumptions.

---

## Ports & Services

| Service        | Port  | Notes                              |
|----------------|-------|------------------------------------|
| Next.js (FE)   | 3000  | `apps/web`                         |
| Go Gin (BE)    | 8080  | `apps/backend-go`                  |
| PostgreSQL     | 5432  | Docker container `mono-repo-postgres` |

**Env files**: `.env` (root, DB creds), `apps/web/.env.local` (`NEXT_PUBLIC_GO_API_URL=http://localhost:8080`)

---

## Commands

| Command      | Purpose                                       |
|--------------|-----------------------------------------------|
| `make rundev`| Start all (Postgres + FE + BE via Turborepo)  |
| `make setup` | First-time install + DB + migrations          |
| `go build ./...` | Verify Go compiles (run from `apps/backend-go`) |

**After Go route/handler changes**: restart `make rundev` (hot-reload only watches Go files, not routes registration).

---

## DB Credentials (dev)

Set in `.env` (root):
```
POSTGRES_USER=yok-test
POSTGRES_DB=yok
```

---

## Backend (Go) — File Map

```
apps/backend-go/
├── cmd/server/main.go              ← Entry point
├── internal/
│   ├── config/config.go            ← Env config
│   ├── container/container.go      ← DI container (wire ALL handlers here)
│   ├── core/domain/
│   │   ├── auth/                   ← Auth domain (repo, security, JWT)
│   │   ├── banner/                 ← Banner entity + repository interface
│   │   ├── homesettings/           ← HomeSettings entity + repository interface
│   │   └── product/                ← Product/Category entity + repository interface
│   ├── application/
│   │   ├── banner/command|query/   ← CQRS handlers
│   │   ├── homesettings/
│   │   │   ├── dto/                ← HomeSettingsDTO, UpdateHomeSettingsDTO
│   │   │   ├── command/            ← UpdateHomeSettingsHandler
│   │   │   ├── query/              ← GetHomeSettingsHandler
│   │   │   └── mapper/             ← DTO ↔ Entity mapping
│   │   └── product/command|query|validation/
│   └── infrastructure/adapter/
│       ├── http/
│       │   ├── handler/            ← Gin handlers (per domain)
│       │   ├── middleware/         ← Auth, CORS, rate limiter, security
│       │   ├── response/           ← Standard JSON response
│       │   └── routes/routes.go    ← ALL route registration
│       └── persistence/gorm/
│           ├── banner/             ← GORM repo + migration
│           ├── homesettings/       ← GORM repo + migration + seed
│           └── product/            ← GORM repo + migration
```

**Adding a new feature**: DTO → Entity → Repository interface → GORM impl → Handler → Register in `container.go` → Register in `routes.go`

---

## Frontend (Next.js) — File Map

```
apps/web/src/
├── app/
│   ├── page.tsx                    ← Homepage (fetches settings + visibility)
│   ├── layout.tsx                  ← Root layout
│   ├── admin/
│   │   ├── page.tsx                ← Dashboard (toggle visibility + quick links)
│   │   ├── home-settings/page.tsx  ← Full section content editor
│   │   ├── banner/                 ← Banner CRUD
│   │   ├── category/               ← Category CRUD
│   │   └── product/                ← Product CRUD
│   ├── project/                    ← Public product listing
│   └── card/                       ← NFC business card viewer
├── components/
│   ├── home/                       ← Homepage section components (Hero, SKU, FAQ, etc.)
│   ├── admin/homeSettings/         ← SectionEditor, ContentField, SectionToggle
│   ├── banner/                     ← Banner components
│   ├── ui/                         ← Shared UI (Button, Modal, Accordion, Switch)
│   └── layout/                     ← Sidebar, navigation
├── services/
│   ├── homeSettings/               ← getHomeSettings(), updateHomeSettings()
│   ├── settingsService.ts          ← getHomeSections() (visibility only)
│   ├── bannerService.ts
│   └── categoryService.ts
├── types/
│   └── homeSettings.ts             ← Types + SECTION_METADATA
├── lib/axios/config.ts             ← API base URL config
├── contexts/AuthContext.tsx         ← Auth state + token management
└── hooks/                          ← Custom hooks
```

**Key API endpoints used by FE**:
- `GET /api/home-settings` → Full section content (admin editor + homepage)
- `PUT /api/home-settings` → Save section content (auth required)
- `GET /api/settings/home-sections` → Section visibility only (homepage)
- `PUT /api/settings/home-sections` → Toggle visibility (auth required)

---

## Migration Pattern

GORM AutoMigrate + raw SQL constraints. **No standalone .sql migration runner.**

```
persistence/gorm/{feature}/migration.go  ← AutoMigrate + seed
```

Register in `container.go`:
```go
if err := gormfeature.AutoMigrate(db); err != nil { ... }
```

---

## Verification

```bash
cd apps/backend-go && go build ./...   # Go compile check
cd apps/web && pnpm typecheck          # TS type check
rg "old-name"                          # Check no stale references
```
