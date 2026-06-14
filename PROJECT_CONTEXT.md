# PROJECT_CONTEXT.md — Architecture & Feature Index

> Last updated: 2026-04-28
> For rules and workflow → see `AGENT.md`

---

## Stack

| Layer | Tech | Port |
|-------|------|------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS v4 | 3001 |
| Backend HTTP | Go + Gin | 9000 |
| Backend gRPC | Go + gRPC | 50051 |
| Database | PostgreSQL (Docker) | 5432 |
| Monorepo | pnpm workspaces + Turborepo | — |

**Package names**: `@mono-repo/web`, `@mono-repo/backend-go`

---

## Architecture

```
apps/
  web/            → Next.js 16 App Router (RSC, TypeScript)
  backend-go/     → Go Gin (Hexagonal + CQRS)
packages/
  shared-types/   → Shared TypeScript types
  config/         → Shared config
  ui-component/   → Shared UI components
```

**Backend pattern**: Hexagonal Architecture + CQRS (Command/Query split)
**Frontend pattern**: App Router, feature-scoped `_components/`, `_hooks/`, `_utils/`
**API**: RESTful (Gin) + gRPC (protobuf)
**Auth**: JWT access token (15min) + refresh token (7d, HTTP-only cookie)
**Security**: ContentValidator (Go), DOMPurify (FE)

---

## Feature Index

| Feature | Doc | Key paths |
|---------|-----|-----------|
| Admin Auth | [ADMIN_AUTH_README](./project_context/ADMIN_AUTH_README.md) | `internal/core/domain/auth/`, `contexts/AuthContext.tsx`, `hoc/withAuthentication.tsx` |
| Product Management | [product-management](./project_context/product-management.md) | `internal/application/product/`, `app/admin/product/`, `app/product/` |
| Banner Management | [BANNER_MANAGEMENT](./project_context/BANNER_MANAGEMENT.md) | `internal/application/banner/`, `app/admin/banner/` |
| Home Section Settings | [home-section-settings](./project_context/home-section-settings.md) | `internal/infrastructure/adapter/http/handler/settings_handler.go`, `app/admin/page.tsx` |
| Digital Business Card | [business-card](./project_context/business-card.md) | `app/create/greeting/`, `app/card/[data]/` |
| Utilities | [utils-documentation](./project_context/utils-documentation.md) | `utils/`, `hooks/`, `services/export/` |
| Design Tokens | [design-tokens](./project_context/design-tokens.md) | Tailwind config, `globals.css` |
| Installation | [installation-guide](./project_context/installation-guide.md) | Root `Makefile`, `pnpm-workspace.yaml` |
| Next.js Setup | [nextjs-setup](./project_context/nextjs-setup.md) | `apps/web/` |
