# DevToolkit Management Feature

## Overview

ระบบจัดการ DevToolkit (Developer Toolkit) เป็นระบบ CRUD สำหรับจัดการเครื่องมือสำหรับนักพัฒนา พร้อม Admin Dashboard ที่มี Sidebar Navigation

## Why

ต้องการระบบจัดการเครื่องมือต่างๆ ที่นักพัฒนาใช้งาน โดย:
- แต่ละ Toolkit ต้องอยู่ภายใต้ Category ที่มีอยู่แล้ว (mandatory)
- มี Status และ Tags ที่กำหนดไว้ล่วงหน้า (predefined)
- ไม่เก็บ Tags ใน database แยก แต่ใช้ config ใน code
- มี Admin UI พร้อม Sidebar สำหรับจัดการ

## Technical Implementation

### Architecture

**Backend (Go):**
```
apps/backend-go/
├── internal/
│   ├── application/devtoolkit/
│   │   ├── command/
│   │   │   ├── create_toolkit.go       # Create command
│   │   │   ├── update_toolkit.go       # Update command
│   │   │   └── delete_toolkit.go       # Delete command
│   │   ├── query/
│   │   │   └── list_toolkits.go        # List & Get queries
│   │   └── dto/
│   │       └── toolkit_dto.go          # Data transfer objects
│   ├── core/domain/devtoolkit/
│   │   ├── entity/
│   │   │   └── service_item.go         # Domain entity
│   │   ├── repository/
│   │   │   └── service_repository.go   # Repository interface
│   │   └── valueobject/
│   │       ├── service_status.go       # Status constants
│   │       └── tags.go                 # Tags config (NEW)
│   └── infrastructure/
│       ├── adapter/persistence/gorm/devtoolkit/
│       │   ├── model/
│       │   │   ├── toolkit_model.go
│       │   │   └── toolkit_detail_model.go
│       │   └── service_repository_impl.go  # CRUD implementation
│       └── adapter/http/
│           ├── handler/
│           │   └── toolkit_handler.go   # HTTP handlers (NEW)
│           ├── request/
│           │   └── toolkit_request.go   # Request DTOs (NEW)
│           └── routes/
│               └── routes.go            # API routes (UPDATED)
```

**Frontend (Next.js):**
```
apps/web/src/
├── app/admin/
│   ├── layout.tsx                       # Admin layout with Sidebar (NEW)
│   ├── category/                        # Category management
│   └── devtoolkit/                      # DevToolkit management (NEW)
│       ├── page.tsx                     # Main CRUD page
│       └── _components/
│           ├── ToolkitForm.tsx          # Form component
│           └── ToolkitList.tsx          # List/Table component
├── components/admin/
│   └── AdminSidebar.tsx                 # Sidebar navigation (NEW)
├── services/
│   └── toolkitService.ts                # API service (NEW)
└── types/
    └── devtoolkit.ts                    # TypeScript types (NEW)
```

### Database Schema

**Table: `dev_toolkits`**
```sql
id          VARCHAR(100) PRIMARY KEY
category_id VARCHAR(50) NOT NULL REFERENCES dev_toolkit_categories(id)
title       VARCHAR(255) NOT NULL
status      VARCHAR(20) NOT NULL DEFAULT 'default'
tags        JSONB NOT NULL DEFAULT '[]'::jsonb
image       TEXT
```

**Table: `dev_toolkit_details`**
```sql
id          SERIAL PRIMARY KEY
toolkit_id  VARCHAR(100) UNIQUE NOT NULL REFERENCES dev_toolkits(id)
description TEXT NOT NULL
```

### Status Configuration

**File:** `internal/core/domain/devtoolkit/valueobject/service_status.go`

```go
const (
    ServiceStatusRecommended ServiceStatus = "recommended"
    ServiceStatusNew         ServiceStatus = "new"
    ServiceStatusComingSoon  ServiceStatus = "coming_soon"
    ServiceStatusDefault     ServiceStatus = "default"
)
```

**Frontend Labels:**
```typescript
export const TOOLKIT_STATUS_LABELS: Record<ToolkitStatus, string> = {
  recommended: "แนะนำ",
  new: "ใหม่",
  coming_soon: "เร็วๆ นี้",
  default: "ปกติ",
};
```

### Tags Configuration

**File:** `internal/core/domain/devtoolkit/valueobject/tags.go` (NEW)

```go
var PredefinedTags = []string{
    "API", "Authentication", "Database", "DevOps",
    "Frontend", "Backend", "Testing", "Monitoring",
    "Security", "Cloud", "AI/ML", "Mobile",
    "Analytics", "Performance", "Documentation",
}
```

**Frontend:**
```typescript
export const PREDEFINED_TAGS = [
  "API", "Authentication", "Database", "DevOps",
  "Frontend", "Backend", "Testing", "Monitoring",
  "Security", "Cloud", "AI/ML", "Mobile",
  "Analytics", "Performance", "Documentation",
] as const;
```

## API Endpoints

**Base URL:** `http://localhost:8080/api`

### Toolkit Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/toolkits` | List all toolkits |
| GET    | `/toolkits/:id` | Get toolkit detail |
| POST   | `/toolkits` | Create new toolkit |
| PUT    | `/toolkits/:id` | Update toolkit |
| DELETE | `/toolkits/:id` | Delete toolkit |

### Request/Response Examples

**POST /toolkits**
```json
{
  "id": "vscode",
  "category_id": "editor",
  "title": "Visual Studio Code",
  "status": "recommended",
  "tags": ["Frontend", "Backend", "DevOps"],
  "image": "https://example.com/vscode.png",
  "description": "Code editor by Microsoft"
}
```

**Response 201 Created**
```json
{
  "id": "vscode",
  "category_id": "editor",
  "title": "Visual Studio Code",
  "status": "recommended",
  "tags": ["Frontend", "Backend", "DevOps"],
  "image": "https://example.com/vscode.png",
  "description": "Code editor by Microsoft"
}
```

## Frontend Components

### AdminSidebar Component

**File:** `components/admin/AdminSidebar.tsx`

**Features:**
- Navigation menu สำหรับ Admin pages
- Active state highlighting
- ใช้ `usePathname` จาก Next.js
- ธีมสีจาก Design System

**Menu Items:**
- จัดการหมวดหมู่ (`/admin/category`)
- จัดการ DevToolkit (`/admin/devtoolkit`)

### ToolkitForm Component

**File:** `app/admin/devtoolkit/_components/ToolkitForm.tsx`

**Fields:**
- ID (required, disabled when editing)
- Category (dropdown, required)
- Title (text input, required)
- Status (dropdown, required)
- Tags (multi-select buttons, required)
- Image URL (text input, optional)
- Description (textarea, required)

**Features:**
- Form validation
- Category dropdown จากข้อมูล categories
- Tags selection แบบ toggle buttons
- แสดงรายการ tags ที่เลือกแล้ว

### ToolkitList Component

**File:** `app/admin/devtoolkit/_components/ToolkitList.tsx`

**Features:**
- Table layout พร้อม hover effects
- แสดงชื่อ Category (แปลง ID เป็นชื่อ)
- Badge สำหรับ Status
- แสดง Tags แบบ Badge (สูงสุด 3 tags + จำนวนที่เหลือ)
- ปุ่มแก้ไขและลบ

## Validation Rules

### Backend Validation

1. **Category ID:** ต้องมีอยู่ใน database (foreign key constraint)
2. **Status:** ต้องเป็นค่าใน `ServiceStatus` enum
3. **Tags:** ทุก tag ต้องอยู่ใน `PredefinedTags`
4. **Title:** ต้องไม่ว่าง, max 255 characters
5. **Description:** ต้องไม่ว่าง

### Frontend Validation

```typescript
const validateForm = (): boolean => {
  const errors = {
    id: !formData.id.trim() ? "กรุณากรอกรหัส" : "",
    category_id: !formData.category_id.trim() ? "กรุณาเลือกหมวดหมู่" : "",
    title: !formData.title.trim() ? "กรุณากรอกชื่อ" : "",
    description: !formData.description.trim() ? "กรุณากรอกคำอธิบาย" : "",
  };
  // ...
};
```

## Code Patterns

### CQRS Pattern

**Command (Write):**
```go
type CreateToolkitCommand struct {
    ID          string
    CategoryID  string
    Title       string
    Status      string
    Tags        []string
    Image       string
    Description string
}
```

**Query (Read):**
```go
type ListToolkitsHandler struct {
    repo repository.ServiceRepository
}
```

### Repository Pattern

```go
type ServiceRepository interface {
    ListServices(ctx context.Context) ([]*entity.ServiceItem, error)
    GetByID(ctx context.Context, id string) (*model.DevToolkitModel, error)
    CreateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error
    UpdateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error
    Delete(ctx context.Context, id string) error
}
```

### Transaction Management

```go
func (r *serviceRepositoryImpl) CreateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error {
    return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
        if err := tx.Create(toolkit).Error; err != nil {
            return fmt.Errorf("create toolkit: %w", err)
        }
        if err := tx.Create(detail).Error; err != nil {
            return fmt.Errorf("create toolkit detail: %w", err)
        }
        return nil
    })
}
```

## Design System Integration

**Colors:**
- Primary: `--color-primary` (#66bb6a)
- Secondary: `--color-secondary` (#499c8d)
- Surface: `--color-surface`
- Border: `--color-border`

**Buttons:**
- Edit: `bg-(--color-secondary)` (Teal)
- Delete: `bg-red-600`
- Primary: `bg-(--color-primary)` (Green)

## Performance Considerations

1. **Backend:**
   - Transaction ใช้ `WithContext` เพื่อ timeout control
   - Query มี `Preload` สำหรับ relations
   - Index บน `category_id` และ `status`

2. **Frontend:**
   - Component แยกตาม responsibility
   - Modal ใช้ simple design (ไม่มี gradient/blur)
   - Form state management แบบ controlled components

## Dependencies

**Backend:**
- GORM (ORM)
- Gin (HTTP framework)
- PostgreSQL (Database)

**Frontend:**
- Next.js 16 (App Router)
- TypeScript (Type safety)
- Axios (HTTP client)
- Custom UI components (Card, Button, Badge, Modal)

## Routes & Navigation

**Admin Routes:**
```
/admin
├── /category          # Category management
└── /devtoolkit        # DevToolkit management (NEW)
```

**Layout Hierarchy:**
```
layout.tsx (root)
└── Header
    └── admin/layout.tsx
        ├── AdminSidebar
        └── {children}
```

## Testing Recommendations

1. **Backend Unit Tests:**
   - Command handler validation
   - Repository CRUD operations
   - Value object validation

2. **Frontend Tests:**
   - Form validation logic
   - API service calls
   - Component rendering

3. **Integration Tests:**
   - End-to-end CRUD flow
   - Category validation (foreign key)
   - Transaction rollback

## Future Enhancements

- [ ] Image upload functionality
- [ ] Bulk operations
- [ ] Search and filter
- [ ] Pagination
- [ ] Sort by columns
- [ ] Export data
- [ ] Audit log
- [ ] Permission management

---

**Last Updated:** 2025-12-18  
**Created By:** AI Agent (Claude)  
**Status:** ✅ Completed
