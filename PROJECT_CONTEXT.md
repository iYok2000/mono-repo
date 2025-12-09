# PROJECT_CONTEXT.md

> Business Logic, Technical Decisions & Architecture

## 📖 Project Overview

**Project Name**: Multi-Framework Monorepo
**Type**: Monorepo (Next.js 16 + Node.js + Golang)
**Purpose**: Full-stack application with Next.js frontend and dual backend services (Express + Gin)

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
- apps/backend-node (Express + TypeScript)
- apps/backend-go (Golang + Gin Framework)
- packages/shared-types (TypeScript interfaces)
```

### Shared Types Package

**Why**: Ensure type safety between frontend and Node backend  
**How**: TypeScript interfaces in `packages/shared-types`  
**Usage**: Import via `@mono-repo/shared-types` using workspace protocol
**Notes**: Only TypeScript apps (web, backend-node) can use this

**Package Names**:
- `@mono-repo/web` - Next.js 16 frontend
- `@mono-repo/backend-node` - Express backend
- `@mono-repo/shared-types` - Shared TypeScript types

---

## 🎯 Features & Implementation

> Detailed feature documentation is organized in `project_context/` folder.  
> Each feature has its own file for better organization and maintainability.

### Feature Index

<!-- AI Agent: Add new feature links here when creating new features -->

**Example format**:

- 📄 [Feature Name](./project_context/feature-name.md) - Brief description

**Current Features**:

- 📄 [Installation Guide](./project_context/installation-guide.md) - Complete setup guide for Next.js 16 + Express + Gin monorepo
- 📄 [Next.js 16 Setup](./project_context/nextjs-setup.md) - Frontend configuration and implementation details
- 📄 [Golang gRPC Implementation](./project_context/golang-grpc-implementation.md) - Dual-server setup (Gin + gRPC) with interceptors and graceful shutdown

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

**Pattern**: RESTful API
**Ports**:

- Next.js (Frontend): 3000
- Backend Node (Express): 3001
- Backend Go (Gin): 8080 (default) or 3002

**CORS**: Configured in both backend services to allow frontend origin

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
| Express    | Node.js API        | Industry standard, flexible, middleware  |
| Gin        | Go Web Framework   | High performance, minimal, easy to use   |
| TypeScript | Type Safety        | Shared types between Next.js and Node.js |
| pnpm       | Package Manager    | Fast, efficient, monorepo support        |
| Turborepo  | Build System       | Fast builds, caching, parallel execution |

---

## 🚀 Deployment & Environment

**Development**:

- **Run all services**: `pnpm dev` (uses Turborepo)
- **Run individually**:
  - Next.js: `pnpm web`
  - Express: `pnpm node`
  - Gin: `pnpm go`
- Hot reload enabled for all services

**Ports**:
- Next.js: http://localhost:3000
- Express: http://localhost:3001
- Gin: http://localhost:8080

**Production**: [To be documented]

---

## 📝 Development Notes

### Known Issues

- Backend services (Express & Gin) are not yet implemented
- Shared types package needs to be created

### Future Improvements

- Implement Express backend with basic REST API
- Implement Gin backend with basic REST API
- Create shared-types package with common interfaces
- Setup Docker for containerization
- Add database integration (PostgreSQL/MongoDB)
- Implement authentication system

### Important Reminders

- **Next.js 16 is now installed** in `apps/web/`
- Always use `@mono-repo/[package-name]` for imports
- Run `pnpm install` at root after adding new dependencies
- Backend services need to be created manually

---

**Last Updated**: 2025-12-04
**Updated By**: AI Agent (Claude) - Updated architecture to Next.js 16 + Express + Gin
