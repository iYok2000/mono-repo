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
- Database integration not yet implemented

### Future Improvements

- Complete Template Gallery (Phases 2-6)
- Add PostgreSQL database integration
- Implement authentication system
- Setup Docker for containerization
- Add more backend API endpoints
- Integrate frontend with Gin/gRPC backend

### Important Reminders

- **Next.js 16** with App Router in `apps/web/`
- **Golang Gin + gRPC** backend in `apps/backend-go/`
- **Template Gallery** foundation complete (Phase 1: Types, UI, Services, Mock Data)
- Run `pnpm install` at root after adding new dependencies
- Use TypeScript strict mode for type safety

---

**Last Updated**: 2025-12-11
**Updated By**: AI Agent (Claude) - Removed backend-node, Template Gallery Phase 1 completed
