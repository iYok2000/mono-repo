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

**Created**: 2025-12-04
**Created By**: AI Agent (Claude)
**Status**: ✅ Completed - Next.js 16 successfully installed
