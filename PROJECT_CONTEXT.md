# PROJECT_CONTEXT.md

> Business Logic, Technical Decisions & Architecture

## 📖 Project Overview

**Project Name**: Multi-Framework Monorepo
**Type**: Monorepo (Next.js 16 + Golang)
**Purpose**: Full-stack application with Next.js frontend and Golang backend (Gin)

---

## 📚 Documentation Structure

This file serves as the **main index** and overview. Detailed feature documentation is organized in the `project_context/` folder:

```
project_context/
├── README.md           # Documentation guide
├── TEMPLATE.md         # Template for new features
└── [feature-name].md   # Individual feature docs
```

**How to use**:

- Read this file for **overview and architecture**
- Check `project_context/[feature-name].md` for **detailed feature docs**
- AI agents will automatically maintain this structure

---

## 🏗️ Architecture Decisions

### Monorepo Structure

**Why**: Centralized codebase for easier dependency management and code sharing  
**How**: Using pnpm workspaces + Turborepo  
**Structure**:

```
- apps/web (Next.js 16 + TypeScript)
- apps/backend-go (Golang + Gin Framework)
```

**Package Names**:
- `@mono-repo/web` - Next.js 16 frontend
- `@mono-repo/backend-go` - Golang Gin backend (separate Go module)

---

## 🎯 Features & Implementation

> Detailed feature documentation is organized in `project_context/` folder.  
> Each feature has its own file for better organization and maintainability.

### Feature Index

<!-- AI Agent: Add new feature links here when creating new features -->

**Example format**:

- 📄 [Feature Name](./project_context/feature-name.md) - Brief description

**Current Features**:

- 📄 [Installation Guide](./project_context/installation-guide.md) - Complete setup guide for Next.js 16 + Gin monorepo
- 📄 [Next.js 16 Setup](./project_context/nextjs-setup.md) - Frontend configuration and implementation details
- 📄 [Golang gRPC Implementation](./project_context/golang-grpc-implementation.md) - Dual-server setup (Gin + gRPC) with interceptors and graceful shutdown
- 📄 [Data Export Feature](./project_context/data-export.md) - CSV export functionality with RFC 4180 compliance, type safety, and accessibility support
- 📄 [DevToolkit Management](./project_context/devtoolkit-management.md) - Full CRUD system for developer tools with Admin Dashboard, Sidebar navigation, and predefined status/tags configuration
- 📄 [Banner Management System](./project_context/BANNER_MANAGEMENT.md) - CRUD + Drag & Drop reordering with CQRS pattern, mobile preview, multi-language support (TH/EN), and segment tier filtering
- 📄 [Admin Authentication](./project_context/ADMIN_AUTH_README.md) - JWT-based authentication system for Admin panel
- 📄 [Utils Documentation](./project_context/utils-documentation.md) - Comprehensive guide to all utility functions, custom hooks, error mappers, and helpers with performance optimization patterns

---

### Quick Reference Template

For simple features that don't need full documentation:

**Feature Name**: [Name]  
**Location**: `apps/[app-name]/src/[path]`  
**Purpose**: [One-line description]  
**Docs**: [Link to detailed doc if exists]

---

## 🔧 Technical Patterns

### API Communication

**Pattern**: RESTful API + gRPC
**Ports**:

- Next.js (Frontend): 3000
- Backend Go (Gin HTTP): 8080
- Backend Go (gRPC): 50051

**CORS**: Configured in Gin backend to allow frontend origin

### Error Handling

**Strategy**: [Consistent error handling approach]  
**Format**: [Error response format]

### State Management

**Frontend**: React Server Components (Next.js 16 default) + Client State (TBD)
**Why**: Leverage Next.js 16 App Router for server-side rendering and data fetching

### Security Guidelines

**CRITICAL: Input Validation & Sanitization**

All string fields from users, APIs, or external sources MUST be validated and sanitized to prevent XSS attacks and SQL injection.

**Backend (Go) - ContentValidator Pattern**:
```go
// File: internal/application/[domain]/validation/content_validator.go

// ✅ MANDATORY: Always use ContentValidator for string inputs
type ContentValidator struct{}

// Example validators:
func (v *ContentValidator) ValidateAndSanitizeTitle(title string) (string, error)
func (v *ContentValidator) ValidateAndSanitizeDescription(desc string) (string, error)
func (v *ContentValidator) SanitizeMainContent(content string) (string, error)
func (v *ContentValidator) ValidateImageURL(url string) (string, error)
func (v *ContentValidator) ValidateTags(tags []string) ([]string, error)
```

**Required Security Measures**:
1. **XSS Protection**: HTML escaping for plain text, dangerous tag removal for markdown
2. **SQL Injection Prevention**: GORM parameterized queries (never raw SQL)
3. **Length Validation**: Enforce maximum length limits on all fields
4. **Format Validation**: Validate URLs, IDs, emails, etc.

**Example Implementation**:
```go
// ✅ GOOD: Command handler with validation
type CreateHandler struct {
    validator *validation.ContentValidator
}

func (h *CreateHandler) Handle(ctx context.Context, cmd CreateCommand) error {
    // Validate and sanitize ALL string inputs
    sanitizedTitle, err := h.validator.ValidateAndSanitizeTitle(cmd.Title)
    if err != nil {
        return err
    }

    sanitizedContent, err := h.validator.SanitizeMainContent(cmd.Content)
    if err != nil {
        return err
    }

    // Use sanitized data for persistence
    model := &Model{
        Title: sanitizedTitle,
        Content: sanitizedContent,
    }

    return h.repository.Create(ctx, model)
}
```

**Reference Implementation**: See [DevToolkit Management](./project_context/devtoolkit-management.md) for complete security implementation example with ContentValidator.

**Frontend (React/Next.js) - Client-Side Validation**:
- Client-side validation is for UX only (not security)
- Backend validation is the primary security defense
- Always validate on backend even if frontend validates

---

## 📦 Dependencies & Libraries

### Key Dependencies

| Package    | Purpose            | Chosen Because                           |
| ---------- | ------------------ | ---------------------------------------- |
| Next.js 16 | Frontend Framework | React framework with SSR, App Router     |
| Gin        | Go Web Framework   | High performance, minimal, easy to use   |
| gRPC       | Backend Protocol   | High-performance RPC framework           |
| TypeScript | Type Safety        | Frontend type safety and tooling         |
| pnpm       | Package Manager    | Fast, efficient, monorepo support        |
| Turborepo  | Build System       | Fast builds, caching, parallel execution |

---

## 🚀 Deployment & Environment

**Development**:

- **Run all services**: `pnpm dev` (uses Turborepo)
- **Run individually**:
  - Next.js: `pnpm web`
  - Gin: `pnpm go`
- Hot reload enabled for all services

**Ports**:
- Next.js: http://localhost:3000
- Gin HTTP: http://localhost:8080
- Gin gRPC: localhost:50051

**Production**: [To be documented]

---

## 📝 Development Notes

### Known Issues

- Template Gallery system is in progress (Phase 1 completed)

### Recent Additions

- ✅ **Banner Management System** - Complete CRUD with Drag & Drop reordering, mobile preview carousel, CQRS pattern, segment tier filtering, and bulk priority updates
- ✅ **DevToolkit Content Management** - Complete CMS with separate create/edit pages, markdown editor, code examples with copy button, and 4 new content fields (main_content, how_to_use, reference, example)
- ✅ **Security Implementation** - ContentValidator pattern with XSS protection, SQL injection prevention, input sanitization for all string fields
- ✅ **DevToolkit Management** - Complete CRUD system with Admin Dashboard
- ✅ **Category Management** - Category CRUD with API integration
- ✅ **Admin Layout** - Sidebar navigation for admin pages
- ✅ **PostgreSQL Integration** - Database connected with GORM

### Future Improvements

- Complete Template Gallery (Phases 2-6)
- Implement authentication system
- Setup Docker for containerization
- Add search and pagination to DevToolkit list
- Image upload functionality
- Permission management

### Important Reminders

- **Security First**: ALL string inputs MUST use ContentValidator (XSS + SQL injection protection)
- **Next.js 16** with App Router in `apps/web/`
- **Golang Gin + gRPC** backend in `apps/backend-go/`
- **PostgreSQL** database with GORM ORM (use parameterized queries, never raw SQL)
- **Admin Pages** available at `/admin/category` and `/admin/devtoolkit`
- **Content Management**: Create/edit pages at `/admin/devtoolkit/create` and `/admin/devtoolkit/edit/[id]`
- Run `pnpm install` at root after adding new dependencies
- Use TypeScript strict mode for type safety
- Backend API at `http://localhost:8080/api`
- Never use raw user input directly - always validate and sanitize first

---

**Last Updated**: 2025-12-25
**Updated By**: AI Agent (Claude) - Added Banner Management System with Drag & Drop reordering, CQRS pattern, mobile preview, and bulk priority updates
