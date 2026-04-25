# Home Section Settings

## Overview

ระบบควบคุมการแสดง/ซ่อน sections บนหน้า Landing Page ผ่าน Admin Dashboard โดยไม่ต้อง deploy ใหม่

## Why

- ต้องการให้ Admin เปิด/ปิด sections ของ landing page ได้แบบ real-time
- หลีกเลี่ยงการ hardcode visibility ใน frontend code
- ตั้งค่าผ่าน UI ที่ง่ายต่อการใช้งาน

## Sections ที่รองรับ

| Key | Section |
|-----|---------|
| `hero` | Hero — ส่วนแนะนำหลัก |
| `what_is_it` | What Is It — อธิบายผลิตภัณฑ์ |
| `sku` | SKU — ตัวเลือกแพ็กเกจ |
| `how_it_works` | How It Works — วิธีการทำงาน |
| `occasions` | Occasions — โอกาสพิเศษ |
| `why_nfc` | Why NFC — เหตุผลที่เลือก NFC |
| `why_us` | Why Us — จุดเด่นของเรา |
| `preview` | Preview — ตัวอย่างการ์ด |
| `faq` | FAQ — คำถามที่พบบ่อย |
| `final_cta` | Final CTA — ปุ่มสั่งซื้อ |

## Architecture

### Backend (Go)

**Database**: GORM-managed `home_settings` table  
- `id TEXT PRIMARY KEY DEFAULT 'default'` — single-row table  
- `hero_enabled BOOL`, `what_is_it_enabled BOOL`, ... (one column per section)

**Handler**: `apps/backend-go/internal/infrastructure/adapter/http/handler/settings_handler.go`
- `NewSettingsHandler(db *sql.DB)` — uses raw `*sql.DB` (not GORM)
- Queries `*_enabled` columns directly by name

**Routes**: `apps/backend-go/internal/infrastructure/adapter/http/routes/routes.go`
```
GET  /api/settings/home-sections   → public (landing page + admin dashboard)
PUT  /api/settings/home-sections   → auth required (admin only)
```

**Response format**:
```json
{
  "sections": {
    "hero": true,
    "what_is_it": true,
    "sku": true,
    ...
  }
}
```

### Frontend (Next.js)

**Service**: `apps/web/src/services/settingsService.ts`
```typescript
getHomeSections()    // GET /api/settings/home-sections → SectionVisibility
updateHomeSections() // PUT /api/settings/home-sections
```

**Landing Page** (`apps/web/src/app/page.tsx`):
- Fetches section settings on mount via `goApi`
- Renders each `<Section>` conditionally based on `sections[key]`
- Falls back to `DEFAULT_SECTION_VISIBILITY` (all `true`) on error

**Admin Dashboard** (`apps/web/src/app/admin/page.tsx`):
- Shows toggle switches for each section
- Calls `updateHomeSections()` on toggle
- Shows success/error status after save

## Migration Notes

- Table schema is managed entirely by **GORM AutoMigrate** in `homesettings/migration.go`
- `002_create_home_settings.sql` is a no-op placeholder — do NOT put schema SQL there
- `settings_handler.go` reads `hero_enabled`, `what_is_it_enabled`, etc. directly (not JSONB)

## Key Files

| File | Role |
|------|------|
| `apps/backend-go/internal/infrastructure/adapter/http/handler/settings_handler.go` | HTTP handler |
| `apps/backend-go/internal/infrastructure/adapter/persistence/gorm/homesettings/migration.go` | DB schema |
| `apps/backend-go/internal/infrastructure/adapter/persistence/migrations/002_create_home_settings.sql` | No-op placeholder |
| `apps/web/src/services/settingsService.ts` | API client |
| `apps/web/src/app/admin/page.tsx` | Admin toggle UI |
| `apps/web/src/app/page.tsx` | Landing page conditional rendering |
