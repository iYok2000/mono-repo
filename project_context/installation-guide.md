# Installation Guide

> Step-by-step guide to setup the monorepo with Next.js 16 and Gin (Express backend was removed)

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required:
- **Node.js** 18+ (for Next.js 16 frontend)
- **Go** 1.23+ (for Gin framework)
- **pnpm** 8+ (package manager)

### Check versions:
```bash
node --version    # Should be 18+
go version        # Should be 1.23+
pnpm --version    # Should be 8+
```

### Install pnpm (if not installed):
```bash
npm install -g pnpm
```

---

## 🏗️ Project Structure Setup

### 1. Initialize Monorepo

```bash
cd mono-repo

# Initialize pnpm workspace (if not already done)
pnpm init

# Install Turborepo (optional but recommended)
pnpm add -Dw turbo
```

### 2. Create Workspace Configuration

Create or update `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 🎨 Frontend: Next.js 16 Setup

### Navigate to apps folder:
```bash
cd apps
```

### Create Next.js 16 app:
```bash
pnpm create next-app@latest web
```

### During setup, choose:
- ✅ TypeScript: **Yes**
- ✅ ESLint: **Yes**
- ✅ Tailwind CSS: **Yes** (recommended)
- ✅ `src/` directory: **Yes** (recommended)
- ✅ App Router: **Yes** (recommended for Next.js 16)
- ✅ Turbopack: **Yes** (faster dev builds)
- ❌ Customize import alias: **No** (use default `@/*`)

### Result:
```
apps/web/
├── src/
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

### Update `apps/web/package.json`:
```json
{
  "name": "@mono-repo/web",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🔵 Backend Go: Gin Framework Setup

### Navigate to apps folder:
```bash
cd apps
mkdir backend-go
cd backend-go
```

### Initialize Go module:
```bash
go mod init mono-repo/backend-go
```

### Install Gin framework:
```bash
go get -u github.com/gin-gonic/gin
go get -u github.com/gin-contrib/cors
```

### Create basic Gin server:

**File: `main.go`**
```go
package main

import (
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set Gin mode
	gin.SetMode(gin.DebugMode)

	// Create router
	router := gin.Default()

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Routes
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Gin API is running!",
		})
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "backend-go",
		})
	})

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Get port from env or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	router.Run(":" + port)
}
```

### Create `.env` file:
```env
PORT=8080
GIN_MODE=debug
```

### Project structure:
```
apps/backend-go/
├── main.go
├── go.mod
├── go.sum
└── .env
```

---

## 📦 Shared Types Package (Optional)

### Create shared types package:
```bash
cd packages
mkdir shared-types
cd shared-types
pnpm init
```

### Install TypeScript:
```bash
pnpm add -D typescript
npx tsc --init
```

### Update `package.json`:
```json
{
  "name": "@mono-repo/shared-types",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### Create `src/index.ts`:
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheck {
  status: string;
  service: string;
}

// Add more shared types here
```

---

## 🚀 Running the Monorepo

### Option 1: Run individually

**Terminal 1 - Next.js:**
```bash
cd apps/web
pnpm dev
# Runs on http://localhost:3000
```

**Terminal 2 - Gin:**
```bash
cd apps/backend-go
go run main.go
# Runs on http://localhost:8080
```

### Option 2: Setup Turborepo (Recommended)

Create `turbo.json` at root:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "outputs": ["dist/**", ".next/**"],
      "dependsOn": ["^build"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

Update root `package.json`:
```json
{
  "name": "mono-repo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

**Run all services at once:**
```bash
pnpm dev
```

---

## ✅ Verification

### Test all services:

**Next.js (Frontend):**
```bash
curl http://localhost:3000
# Should show Next.js page
```

**Gin (Go Backend):**
```bash
curl http://localhost:8080/health
# Response: {"status":"healthy","service":"backend-go"}

curl http://localhost:8080/ping
# Response: {"message":"pong"}
```

---

## 📚 References

- [Gin Framework Quickstart](https://gin-gonic.com/en/docs/quickstart/)
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)

---

## 🔧 Troubleshooting

### Port already in use:
```bash
# Kill process on port 3000 (Next.js)
lsof -ti:3000 | xargs kill -9

# Kill process on port 8080 (Gin)
lsof -ti:8080 | xargs kill -9
```

### Go module errors:
```bash
cd apps/backend-go
go mod tidy
go mod download
```

### pnpm workspace issues:
```bash
# Clean and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

---

**Last Updated**: 2025-12-04
**Created By**: AI Agent (Claude)
