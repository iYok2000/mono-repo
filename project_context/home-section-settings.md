# Home Section Settings

> Last updated: 2026-04-28

## What
Toggle landing page section visibility via admin UI without redeploying.

## Sections
hero, what_is_it, sku, how_it_works, occasions, why_nfc, why_us, preview, faq, final_cta

## Where

**Backend**:
- Handler: `internal/infrastructure/adapter/http/handler/settings_handler.go` — uses raw `*sql.DB` (not GORM)
- DB: `home_settings` table — single row (id='default'), one `*_enabled BOOL` column per section
- Migration: GORM AutoMigrate in `homesettings/migration.go` (002 SQL file is no-op placeholder)

**Frontend**:
- Service: `services/settingsService.ts` — `getHomeSections()`, `updateHomeSections()`
- Landing: `app/page.tsx` — conditional render per `sections[key]`, fallback all-true on error
- Admin: `app/admin/page.tsx` — toggle switches per section

## Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/api/settings/home-sections` | No | Get visibility (public + admin) |
| PUT | `/api/settings/home-sections` | Yes | Update visibility (admin only) |

## Response Format
```json
{ "sections": { "hero": true, "what_is_it": true, "sku": false, ... } }
```
