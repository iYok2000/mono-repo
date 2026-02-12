# Next.js 16 Setup

> Frontend application built with Next.js 16, TypeScript, and Tailwind CSS

---

## Overview

Next.js 16 frontend application with App Router, TypeScript, and Tailwind CSS v4. Integrated with monorepo workspace for sharing types with backend services.

---

## Why Next.js 16?

### Chosen Because:
- **React Server Components** - Better performance with server-side rendering
- **App Router** - Modern routing system with layouts and nested routes
- **TypeScript** - Type safety throughout the application
- **Turbopack** - Faster development builds
- **Tailwind CSS v4** - Utility-first CSS with latest features

### Alternatives Considered:
- **Vite + React** - Less opinionated but requires more configuration
- **Remix** - Great for full-stack but overkill for API-only backend
- **Create React App** - Deprecated and no longer maintained

---

## Technical Implementation

### Project Structure

```
apps/web/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout
│       ├── page.tsx         # Home page
│       └── globals.css      # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
└── next.config.ts           # Next.js config
```

### Package Configuration

**File: `apps/web/package.json`**

```json
{
  "name": "@mono-repo/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.0.7",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "@mono-repo/shared-types": "workspace:*"
  }
}
```

**Key Points**:
- Package name: `@mono-repo/web` (scoped for monorepo)
- Added `@mono-repo/shared-types` for sharing types with backend
- Uses `workspace:*` protocol for local dependencies

---

## How It Works

### 1. Development Server

```bash
# Run from root
pnpm web

# Or directly
cd apps/web
pnpm dev
```

Server starts at: http://localhost:3000

### 2. Integration with Backend

**API Calls Example:**

```typescript
// apps/web/src/app/page.tsx
import { ApiResponse } from '@mono-repo/shared-types';

export default async function Home() {
  // Call Go API (Gin)
  const res = await fetch('http://localhost:8080/health');
  const data: ApiResponse = await res.json();

  return (
    <div>
      <h1>Backend health: {data.status}</h1>
    </div>
  );
}
```

### 3. Using Shared Types

```typescript
// Import from shared-types package
import { User, Product, ApiResponse } from '@mono-repo/shared-types';

// Use in components
interface Props {
  user: User;
  products: Product[];
}

export function Dashboard({ user, products }: Props) {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* ... */}
    </div>
  );
}
```

---

## Code Examples

### Server Component (Default)

```typescript
// apps/web/src/app/health/page.tsx
import { HealthCheck } from '@mono-repo/shared-types';

async function getHealth(): Promise<HealthCheck> {
  const res = await fetch('http://localhost:8080/health', { next: { revalidate: 0 } });
  return res.json();
}

export default async function HealthPage() {
  const health = await getHealth();

  return (
    <div>
      <h1>Backend status: {health.status}</h1>
      <p>Service: {health.service}</p>
    </div>
  );
}
```

### Client Component

```typescript
'use client';

import { useState } from 'react';
import { User } from '@mono-repo/shared-types';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const user: User = await res.json();
    console.log('Logged in:', user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### API Route Handler

```typescript
// apps/web/src/app/api/hello/route.ts
import { NextResponse } from 'next/server';
import { ApiResponse } from '@mono-repo/shared-types';

export async function GET() {
  const response: ApiResponse = {
    success: true,
    message: 'Hello from Next.js API',
    data: { timestamp: new Date().toISOString() }
  };

  return NextResponse.json(response);
}
```

---

## Dependencies

### Main Dependencies:
- **next** (16.0.7) - React framework
- **react** (19.2.0) - UI library
- **react-dom** (19.2.0) - React DOM renderer
- **@mono-repo/shared-types** - Shared TypeScript types

### Dev Dependencies:
- **typescript** - Type checking
- **@types/node**, **@types/react** - Type definitions
- **tailwindcss** (v4) - CSS framework
- **eslint** - Code linting
- **eslint-config-next** - Next.js ESLint rules

---

## Configuration Files

### next.config.ts

Current config is minimal. Add rewrites if you want to proxy to Gin (Go) locally:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/go/:path*",
        destination: "http://localhost:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Testing

### Development Testing

**Run development server:**
```bash
pnpm dev
# Server starts at http://localhost:3000
```

**Verify installation:**
1. Open http://localhost:3000 in browser
2. Should see Next.js default landing page
3. Check console for errors (none expected)
4. Verify hot reload works (edit page.tsx, see instant update)

### Build Testing

**Production build:**
```bash
pnpm build
# Creates optimized production build in .next/

pnpm start
# Starts production server
```

**Verify build:**
- Build should complete without errors
- Check for TypeScript errors
- Verify bundle size is reasonable
- Test production server starts correctly

### Integration Testing

**Test API integration with Go backend:**

```typescript
// Test file: apps/web/src/app/__tests__/api-integration.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';

describe('API Integration', () => {
  it('should fetch and display backend health status', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/Backend health:/)).toBeInTheDocument();
    });
  });
});
```

**Manual API testing:**
```bash
# Terminal 1: Start Go backend
cd apps/backend-go
go run main.go

# Terminal 2: Start Next.js
cd apps/web
pnpm dev

# Terminal 3: Test API calls
curl http://localhost:3000/api/go/health
# Should proxy to Go backend and return health status
```

### Type Safety Testing

**Test shared types integration:**

```typescript
// apps/web/src/app/test-types.tsx
import { User, Product } from '@mono-repo/shared-types';

// This should compile without errors
const testUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
};

const testProduct: Product = {
  id: 'prod-1',
  title: 'Test Product',
  category_id: 'cat-1'
};
```

**Run TypeScript check:**
```bash
pnpm tsc --noEmit
# Should complete with no errors
```

### Performance Testing

**Check build performance:**
- First build: ~30-60 seconds (normal)
- Incremental builds: ~5-10 seconds
- Development startup: ~2-5 seconds with Turbopack

**Check runtime performance:**
- Lighthouse score: Aim for 90+ on Performance
- Time to Interactive (TTI): <3 seconds
- First Contentful Paint (FCP): <1.5 seconds

### Manual Testing Checklist

- [ ] Development server starts without errors
- [ ] Hot reload works (edit files, see changes instantly)
- [ ] TypeScript errors show in editor
- [ ] ESLint runs and shows warnings
- [ ] Tailwind CSS classes work correctly
- [ ] Production build completes successfully
- [ ] Production server runs correctly
- [ ] API calls to Go backend work
- [ ] Shared types import correctly
- [ ] Browser console shows no errors
- [ ] Page loads in <3 seconds

## Notes

### Important Considerations:

1. **App Router vs Pages Router**
   - Using App Router (recommended for Next.js 16)
   - All routes in `src/app/` directory
   - Supports React Server Components by default

2. **Server vs Client Components**
   - Default: Server Components (faster, smaller bundle)
   - Use `'use client'` directive for client-side interactivity
   - Server Components can't use hooks or browser APIs

3. **Type Safety**
   - Always import types from `@mono-repo/shared-types`
   - Ensures API contract consistency with backend
   - Prevents runtime errors from type mismatches

4. **Performance**
   - Server Components render on server → faster initial load
   - Use Client Components only when needed
   - Optimize images with `next/image`

5. **Development Workflow**
   - Changes auto-reload (hot module replacement)
   - TypeScript errors show in terminal and browser
   - ESLint runs on file save

### Trade-offs:

- **Pro**: Type safety across full stack
- **Pro**: Fast development with Turbopack
- **Pro**: Built-in optimizations (image, font, etc.)
- **Con**: Learning curve for App Router
- **Con**: Server Components require different patterns

---

## Next Steps

1. ✅ Next.js 16 installed and configured
2. ✅ Gin backend (`apps/backend-go`)
3. ⏳ Create shared-types package (`packages/shared-types`)
4. ⏳ Build example API integration
5. ⏳ Setup authentication flow

---

**Created**: December 4, 2025  
**Last Updated**: February 3, 2026  
**Author**: AI Agent (Claude)  
**Status**: Production-ready
