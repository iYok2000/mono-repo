# Product Management Feature

## Overview

ระบบจัดการ Product เป็นระบบ CMS (Content Management System) สำหรับจัดการผลิตภัณฑ์และเครื่องมือสำหรับนักพัฒนา พร้อมฟีเจอร์:
- **Admin Dashboard** - หน้าจัดการแบบ separate create/edit pages
- **Content Editor** - Markdown editor พร้อม live preview
- **Code Examples** - แสดง code พร้อม copy button
- **Detail Page** - หน้าแสดงรายละเอียด product สำหรับผู้ใช้งานทั่วไป
- **Security** - ContentValidator pattern ป้องกัน XSS และ SQL injection

## Why

ต้องการระบบจัดการเครื่องมือต่างๆ ที่นักพัฒนาใช้งาน โดย:
- แต่ละ Product ต้องอยู่ภายใต้ Category ที่มีอยู่แล้ว (mandatory)
- มี Status และ Tags ที่กำหนดไว้ล่วงหน้า (predefined)
- ไม่เก็บ Tags ใน database แยก แต่ใช้ config ใน code
- มี Admin UI พร้อม Sidebar สำหรับจัดการ
- **เพิ่มเนื้อหาแบบ article** - รองรับ markdown สำหรับเขียนบทความ
- **แสดง code examples** - มี copy button สำหรับ UX ที่ดีขึ้น
- **ป้องกันความปลอดภัย** - validate และ sanitize ข้อมูลทุก field

## Technical Implementation

### Architecture

**Backend (Go):**
```
apps/backend-go/
├── internal/
│   ├── application/product/
│   │   ├── command/
│   │   │   ├── create_product.go       # Create command (with validation)
│   │   │   ├── update_product.go       # Update command (with validation)
│   │   │   └── delete_product.go       # Delete command
│   │   ├── query/
│   │   │   └── list_products.go        # List & Get queries
│   │   ├── validation/
│   │   │   └── content_validator.go    # Security validation (NEW)
│   │   └── dto/
│   │       └── product_dto.go          # Data transfer objects (with content fields)
│   ├── core/domain/product/
│   │   ├── entity/
│   │   │   └── service_item.go         # Domain entity
│   │   ├── repository/
│   │   │   └── service_repository.go   # Repository interface
│   │   └── valueobject/
│   │       ├── service_status.go       # Status constants
│   │       └── tags.go                 # Tags config
│   └── infrastructure/
│       ├── adapter/persistence/gorm/product/
│       │   ├── model/
│       │   │   ├── product_model.go
│       │   │   └── product_detail_model.go  # With 4 new content fields
│       │   └── service_repository_impl.go   # CRUD implementation
│       └── adapter/http/
│           ├── handler/
│           │   └── product_handler.go   # HTTP handlers
│           ├── request/
│           │   └── product_request.go   # Request DTOs (with content fields)
│           └── routes/
│               └── routes.go            # API routes
```

**Frontend (Next.js):**
```
apps/web/src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx                       # Admin layout with Sidebar
│   │   ├── category/                        # Category management
│   │   └── product/                         # Product management
│   │       ├── page.tsx                     # List page (list only, no form)
│   │       ├── create/
│   │       │   └── page.tsx                 # Create page
│   │       ├── edit/[id]/
│   │       │   └── page.tsx                 # Edit page
│   │       ├── _components/
│   │       │   └── ProductList.tsx          # List/Table component
│   │       ├── _hooks/
│   │       │   └── useProduct.ts            # Data fetching hook
│   │       └── _utils/
│   │           └── errorMapper.ts           # Error handling
│   └── product/                             # Public pages
│       ├── page.tsx                         # Product list page
│       ├── [id]/
│       │   └── detail/
│       │       └── page.tsx                 # Detail page
│       └── _components/
│           └── ServiceCard.tsx              # Product card component
├── components/admin/
│   ├── AdminSidebar.tsx                     # Sidebar navigation
│   ├── ContentEditor.tsx                    # Markdown editor
│   └── CodeExample.tsx                      # Code display with copy
├── services/
│   └── productService.ts                    # API service
└── types/
    └── product.ts                           # TypeScript types (with content fields)
```

### Database Schema

**Table: `products`**
```sql
id          VARCHAR(100) PRIMARY KEY
category_id VARCHAR(50) NOT NULL REFERENCES product_categories(id)
title       VARCHAR(255) NOT NULL
status      VARCHAR(20) NOT NULL DEFAULT 'default'
tags        JSONB NOT NULL DEFAULT '[]'::jsonb
image       TEXT
```

**Table: `product_details`**
```sql
id           SERIAL PRIMARY KEY
product_id   VARCHAR(100) UNIQUE NOT NULL REFERENCES products(id)
description  TEXT NOT NULL

-- New content fields (added 2025-12-22)
main_content TEXT              -- Full article/documentation (max 50KB)
how_to_use   TEXT              -- Usage instructions (max 10KB)
reference    TEXT              -- Links and documentation (max 5KB)
example      TEXT              -- Code examples (max 20KB)
```

**Content Field Limits:**
| Field | Max Length | Purpose |
|-------|-----------|---------|
| description | 5KB | Short summary |
| main_content | 50KB | Full article/documentation |
| how_to_use | 10KB | Usage instructions |
| reference | 5KB | Links and references |
| example | 20KB | Code examples |

### Status Configuration

**File:** `internal/core/domain/product/valueobject/service_status.go`

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
export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  recommended: "แนะนำ",
  new: "ใหม่",
  coming_soon: "เร็วๆ นี้",
  default: "ปกติ",
};
```

### Tags Configuration

**File:** `internal/core/domain/product/valueobject/tags.go`

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

## Migration / Consistency Notes
- Legacy `dev_toolkit_*` tables and routes are being renamed to `product_*`. Ship explicit SQL/Go migrations for renaming `dev_toolkits` → `products`, `dev_toolkit_details` → `product_details`, and `dev_toolkit_categories` → `product_categories` (or align FK targets). Do **not** rely on AutoMigrate for these renames.
- Update all layers together: DI container, routes, handlers, DTOs/validators, repositories/mappers, GORM models (TableName/FK/index), and frontend slugs/services/types/links. Run `rg devtoolkit` to ensure no references remain.
- Add FK constraints with `OnDelete:CASCADE` from detail to product, and indexes on `category_id`/`status` to support paginated list endpoints.

## API Endpoints

**Base URL:** `http://localhost:8080/api`

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/products` | List all products |
| GET    | `/products/:id` | Get product detail |
| POST   | `/products` | Create new product |
| PUT    | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

### Request/Response Examples

**POST /products**
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

### Admin Components

#### AdminSidebar Component
**File:** `components/admin/AdminSidebar.tsx`

**Features:**
- Navigation menu สำหรับ Admin pages
- Active state highlighting
- ใช้ `usePathname` จาก Next.js
- ธีมสีจาก Design System

**Menu Items:**
- จัดการหมวดหมู่ (`/admin/category`)
- จัดการ Product (`/admin/product`)

#### ContentEditor Component (NEW)
**File:** `components/admin/ContentEditor.tsx`

**Features:**
- Markdown editor with live preview
- Character count with limits
- Toggle between edit and preview mode
- Syntax guide for markdown
- Theme-compatible colors (works in both light/dark mode)
- Error message display
- Help text support

**Supported Markdown:**
- Headers: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Lists: `- item`
- Links: `[text](url)`

#### CodeExample Component (NEW)
**File:** `components/admin/CodeExample.tsx`

**Features:**
- Syntax-highlighted code display
- One-click copy button with visual feedback
- Auto-hide copy button (shows on hover)
- Responsive design
- Theme-compatible colors

**Security:**
- Content is sanitized on backend before storage
- Frontend only displays pre-sanitized content

#### ToolkitList Component
**File:** `app/admin/devtoolkit/_components/ToolkitList.tsx`

**Features:**
- Table layout พร้อม hover effects
- แสดงชื่อ Category (แปลง ID เป็นชื่อ)
- Badge สำหรับ Status
- แสดง Tags แบบ Badge (สูงสุด 3 tags + จำนวนที่เหลือ)
- ปุ่มแก้ไขและลบ

### Admin Pages

#### Create Page (NEW)
**File:** `app/admin/devtoolkit/create/page.tsx`

**Features:**
- Full form for creating new toolkit
- All basic fields + 4 content fields
- Real-time validation
- ContentEditor for description and content fields
- Live example preview with CodeExample
- Success/error modals
- Auto-redirect after success

**Fields:**
- ID (required, unique)
- Category (dropdown, required)
- Title (required, max 255 chars)
- Status (dropdown, required)
- Tags (multi-select, required)
- Image URL (optional)
- Description (ContentEditor, required, max 5KB)
- Main Content (ContentEditor, optional, max 50KB)
- How to Use (ContentEditor, optional, max 10KB)
- Reference (ContentEditor, optional, max 5KB)
- Example (ContentEditor, optional, max 20KB)

#### Edit Page (NEW)
**File:** `app/admin/devtoolkit/edit/[id]/page.tsx`

**Features:**
- Same as Create Page
- ID field disabled (cannot change)
- Pre-populated with current data
- Loads existing toolkit data
- Update operation with validation

### Public Pages

#### Detail Page (NEW)
**File:** `app/dev-toolkit/[id]/detail/page.tsx`

**Features:**
- Full detail view for toolkit
- Markdown rendering for content fields
- Code display with copy button for examples
- Responsive design with decorative images
- Theme-compatible colors
- Back button to toolkit list
- Error handling for not found

**Sections:**
1. Header - Title, image, category, tags, description
2. Main Content - Full article with markdown
3. How to Use - Usage instructions
4. Code Example - With copy button
5. Reference - Documentation and links

**Route:** `/dev-toolkit/[id]/detail`

#### ServiceCard Component (UPDATED)
**File:** `app/dev-toolkit/_components/ServiceCard.tsx`

**Changes:**
- Link updated to `/dev-toolkit/${id}/detail`
- Status ribbons (Recommended, New, Coming Soon)
- Card layout with tags and description

## Security Implementation

### ContentValidator Pattern

**File:** `internal/application/devtoolkit/validation/content_validator.go`

**Purpose:** Validate and sanitize ALL string inputs to prevent XSS and SQL injection

**Security Measures:**
1. **XSS Protection** - HTML escaping for titles, dangerous tag removal for markdown
2. **SQL Injection Prevention** - GORM parameterized queries (never raw SQL)
3. **Length Validation** - Enforce maximum length limits on all fields
4. **Format Validation** - Validate URLs, IDs, emails, etc.

**Validators:**
```go
// Plain text (HTML escape)
func (v *ContentValidator) ValidateAndSanitizeTitle(title string) (string, error)
func (v *ContentValidator) ValidateAndSanitizeDescription(desc string) (string, error)

// Markdown content (remove dangerous tags)
func (v *ContentValidator) SanitizeMainContent(content string) (string, error)
func (v *ContentValidator) SanitizeHowToUse(content string) (string, error)
func (v *ContentValidator) SanitizeReference(content string) (string, error)
func (v *ContentValidator) SanitizeExample(content string) (string, error)

// URLs and special formats
func (v *ContentValidator) ValidateImageURL(url string) (string, error)
func (v *ContentValidator) ValidateAndSanitizeID(id string) (string, error)
func (v *ContentValidator) ValidateTags(tags []string) ([]string, error)
```

**Dangerous Content Removed:**
- `<script>`, `<iframe>`, `<object>`, `<embed>`, `<applet>`
- `<meta>`, `<link>`, `<style>`, `<form>`
- `<input>`, `<button>`, `<textarea>`, `<select>`
- `javascript:` URLs
- `data:` URLs
- Event handlers: `onclick`, `onerror`, etc.

### Validation Layers

**1. HTTP Request Layer:**
```go
type CreateToolkitRequest struct {
    ID          string   `json:"id" binding:"required,min=1,max=100"`
    Title       string   `json:"title" binding:"required,min=1,max=255"`
    Description string   `json:"description" binding:"required"`
    // ... Gin binding validation
}
```

**2. Command Handler Layer:**
```go
func (h *CreateToolkitHandler) Handle(ctx context.Context, cmd CreateToolkitCommand) error {
    // MANDATORY: Validate and sanitize ALL inputs
    sanitizedTitle, err := h.validator.ValidateAndSanitizeTitle(cmd.Title)
    sanitizedContent, err := h.validator.SanitizeMainContent(cmd.MainContent)
    // ... use sanitized data
}
```

**3. Repository Layer:**
```go
// Use GORM parameterized queries (automatic SQL injection protection)
func (r *serviceRepositoryImpl) Create(ctx context.Context, model *Model) error {
    return r.db.WithContext(ctx).Create(model).Error  // Safe
}
```

## Validation Rules

### Backend Validation

1. **Category ID:** ต้องมีอยู่ใน database (foreign key constraint)
2. **Status:** ต้องเป็นค่าใน `ServiceStatus` enum
3. **Tags:** ทุก tag ต้องอยู่ใน `PredefinedTags`
4. **ID:** Alphanumeric + dash/underscore only, max 100 chars
5. **Title:** ต้องไม่ว่าง, max 255 characters
6. **Description:** ต้องไม่ว่าง, max 5,000 characters
7. **Main Content:** max 50,000 characters
8. **How to Use:** max 10,000 characters
9. **Reference:** max 5,000 characters
10. **Example:** max 20,000 characters
11. **Image URL:** Valid URL format, max 2,048 characters

### Frontend Validation

**Purpose:** UX only, NOT security (backend validates again)

```typescript
const validateForm = (): boolean => {
  const errors = {
    id: !formData.id.trim() ? "กรุณากรอกรหัส" : "",
    category_id: !formData.category_id ? "กรุณาเลือกหมวดหมู่" : "",
    title: !formData.title.trim() ? "กรุณากรอกชื่อ" : "",
    description: !formData.description.trim() ? "กรุณากรอกคำอธิบาย" : "",
    tags: formData.tags.length === 0 ? "กรุณาเลือกอย่างน้อย 1 แท็ก" : "",
  };
  return Object.keys(errors).length === 0;
};
```

## Code Examples

### Example 1: Backend - CQRS Command Pattern

**Command (Write):**
```go
// Create command for new product
type CreateToolkitCommand struct {
    ID          string
    CategoryID  string
    Title       string
    Status      string
    Tags        []string
    Image       string
    Description string
    MainContent string
    HowToUse    string
    Reference   string
    Example     string
}

// Command handler with validation
func (h *CreateToolkitHandler) Handle(ctx context.Context, cmd CreateToolkitCommand) error {
    // Validate and sanitize inputs
    sanitizedTitle, err := h.validator.ValidateAndSanitizeTitle(cmd.Title)
    if err != nil {
        return err
    }
    // ... continue with sanitized data
}
```

### Example 2: Backend - Repository Pattern with Transaction

```go
type ServiceRepository interface {
    ListServices(ctx context.Context) ([]*entity.ServiceItem, error)
    GetByID(ctx context.Context, id string) (*model.DevToolkitModel, error)
    CreateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error
    UpdateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error
    Delete(ctx context.Context, id string) error
}

// Transaction management implementation
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

### Example 3: Frontend - Admin Create Form

```typescript
// apps/web/src/app/admin/product/create/page.tsx
'use client';

import { useState } from 'react';
import { createProduct } from '@/services/productService';
import ContentEditor from '@/components/admin/ContentEditor';

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    id: '',
    category_id: '',
    title: '',
    status: 'default',
    tags: [],
    description: '',
    main_content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProduct(formData);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ContentEditor
        value={formData.description}
        onChange={(value) => setFormData({ ...formData, description: value })}
        maxLength={5000}
        label="คำอธิบาย"
      />
      {/* More form fields */}
    </form>
  );
}
```

### Example 4: Frontend - ContentEditor Component

```typescript
// apps/web/src/components/admin/ContentEditor.tsx
import { useState } from 'react';
import { renderMarkdown } from '@/utils/markdown';

interface Props {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  label: string;
}

export default function ContentEditor({ value, onChange, maxLength, label }: Props) {
  const [isPreview, setIsPreview] = useState(false);
  
  return (
    <div>
      <div className="flex justify-between">
        <label>{label}</label>
        <button type="button" onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      
      {isPreview ? (
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
        />
      )}
      
      <p>{value.length} / {maxLength}</p>
    </div>
  );
}
```

### Example 5: Security - Content Validation

```go
// internal/application/product/validation/content_validator.go
package validation

import (
    "fmt"
    "html"
    "regexp"
    "strings"
)

type ContentValidator struct{}

func NewContentValidator() *ContentValidator {
    return &ContentValidator{}
}

// Validate and sanitize title (plain text)
func (v *ContentValidator) ValidateAndSanitizeTitle(title string) (string, error) {
    if len(title) == 0 {
        return "", fmt.Errorf("title cannot be empty")
    }
    if len(title) > 255 {
        return "", fmt.Errorf("title exceeds 255 characters")
    }
    // HTML escape to prevent XSS
    return html.EscapeString(strings.TrimSpace(title)), nil
}

// Sanitize markdown content (remove dangerous tags)
func (v *ContentValidator) SanitizeMainContent(content string) (string, error) {
    if len(content) > 50000 {
        return "", fmt.Errorf("content exceeds 50KB limit")
    }
    
    // Remove dangerous HTML tags
    dangerousTags := []string{
        "<script", "</script>",
        "<iframe", "</iframe>",
        "<object", "</object>",
        "javascript:",
        "onerror=", "onclick=",
    }
    
    sanitized := content
    for _, tag := range dangerousTags {
        sanitized = strings.ReplaceAll(sanitized, tag, "")
    }
    
    return sanitized, nil
}
```

## Testing

### Unit Tests

**Backend Tests** (Go)

Location: `apps/backend-go/internal/application/product/`

```go
// command/create_product_test.go
func TestCreateProductHandler_Validation(t *testing.T) {
    tests := []struct {
        name    string
        command CreateProductCommand
        wantErr bool
    }{
        {
            name: "valid product",
            command: CreateProductCommand{
                ID:          "test-id",
                CategoryID:  "editor",
                Title:       "Test Product",
                Status:      "default",
                Tags:        []string{"Testing"},
                Description: "Test description",
            },
            wantErr: false,
        },
        {
            name: "invalid - empty title",
            command: CreateProductCommand{
                ID:    "test-id",
                Title: "",
            },
            wantErr: true,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test implementation
        })
    }
}
```

**Frontend Tests** (TypeScript/Jest)

Location: `apps/web/src/components/admin/__tests__/`

```typescript
// ContentEditor.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ContentEditor from '../ContentEditor';

describe('ContentEditor', () => {
  it('should display character count', () => {
    const onChange = jest.fn();
    render(
      <ContentEditor
        value="Test content"
        onChange={onChange}
        maxLength={100}
        label="Description"
      />
    );
    
    expect(screen.getByText(/12 \/ 100/)).toBeInTheDocument();
  });
  
  it('should toggle between edit and preview mode', () => {
    const onChange = jest.fn();
    render(<ContentEditor value="# Test" onChange={onChange} maxLength={100} label="Test" />);
    
    const toggleBtn = screen.getByText('Preview');
    fireEvent.click(toggleBtn);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
```

### Integration Tests

**Backend API Tests**

```bash
# Test product creation
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "vscode",
    "category_id": "editor",
    "title": "VS Code",
    "status": "recommended",
    "tags": ["Frontend", "Backend"],
    "description": "Code editor"
  }'

# Expected: 201 Created with product data
```

**End-to-End Test Scenarios**

1. **Create Product Flow**
   - Navigate to `/admin/product/create`
   - Fill all required fields
   - Verify validation messages
   - Submit form
   - Verify success redirect
   - Check product appears in list

2. **Edit Product Flow**
   - Navigate to product list
   - Click edit button
   - Modify fields
   - Save changes
   - Verify updates persisted

3. **Delete Product Flow**
   - Click delete button
   - Confirm deletion
   - Verify product removed from list

4. **Security Validation**
   - Try creating product with `<script>` in title
   - Verify content is sanitized
   - Check XSS attempts are blocked

### Manual Testing Checklist

**Admin Features:**
- [ ] Create new product with all fields
- [ ] Edit existing product
- [ ] Delete product
- [ ] Markdown preview works correctly
- [ ] Code examples display with copy button
- [ ] Character limits enforced
- [ ] Form validation shows appropriate errors
- [ ] Category dropdown shows all categories
- [ ] Tags can be selected/deselected
- [ ] Status dropdown works
- [ ] Image URL validation

**Public Features:**
- [ ] Product list displays correctly
- [ ] Product detail page shows all content
- [ ] Markdown renders properly
- [ ] Code copy button works
- [ ] Responsive design on mobile
- [ ] Status badges display correctly
- [ ] Tags display properly

**Security:**
- [ ] XSS attempts are blocked
- [ ] SQL injection prevented
- [ ] Content length limits enforced
- [ ] Invalid URLs rejected

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
├── /category                  # Category management
└── /devtoolkit               # DevToolkit management
    ├── /                     # List page (list only)
    ├── /create               # Create new toolkit
    └── /edit/[id]            # Edit existing toolkit
```

**Public Routes:**
```
/dev-toolkit
├── /                         # Toolkit list with categories
└── /[id]/detail             # Toolkit detail page
```

**Layout Hierarchy:**
```
layout.tsx (root)
└── Header
    └── admin/layout.tsx
        ├── AdminSidebar
        └── {children}
            ├── devtoolkit/page.tsx (List)
            ├── devtoolkit/create/page.tsx (Create)
            └── devtoolkit/edit/[id]/page.tsx (Edit)
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

### Completed Features ✅
- [x] Separate create/edit pages
- [x] Markdown editor with live preview
- [x] Code examples with copy button
- [x] Detail page for public viewing
- [x] Security validation (ContentValidator)
- [x] Theme-compatible colors

### Planned Enhancements
- [ ] Syntax highlighting for code examples (e.g., Prism.js, highlight.js)
- [ ] Image upload functionality
- [ ] Bulk operations
- [ ] Search and filter in admin
- [ ] Pagination for large lists
- [ ] Sort by columns
- [ ] Export data (CSV/JSON)
- [ ] Audit log / version history
- [ ] Permission management
- [ ] Draft/publish workflow
- [ ] Rich text editor (alternative to markdown)
- [ ] Image optimization and CDN integration
- [ ] Related toolkits suggestions
- [ ] View counter and analytics

---

**Created**: December 18, 2025  
**Last Updated**: February 3, 2026  
**Author**: AI Agent (Claude)  
**Status**: Production-ready

## Recent Updates

### February 3, 2026 - Documentation Standardization
- Restructured documentation to follow TEMPLATE.md
- Added comprehensive Code Examples section
- Added Testing section with unit, integration, and manual tests
- Updated footer metadata format

### December 22, 2025 - Content Management & Security
- Added separate create/edit pages
- Implemented ContentEditor with markdown support
- Added CodeExample component with copy functionality
- Created detail page for public viewing
- Implemented ContentValidator for XSS and SQL injection protection
- Added 4 new content fields (main_content, how_to_use, reference, example)
- Updated all components to use theme-compatible colors
