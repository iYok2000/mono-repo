/**
 * Authentication Template (Mock)
 *
 * Mock template for testing UI/layout.
 * Demonstrates a backend authentication system.
 */

import type { Template } from '@/types/template';
import { TemplateCategory, TemplateTag } from '@/types/template';

export const mockAuthTemplate: Template = {
  id: 'authentication',
  slug: 'authentication',

  title: 'Authentication System',
  shortDescription:
    'JWT-based authentication with refresh tokens, role-based access control, and secure password hashing.',
  longDescription: `A complete authentication system implementing industry best practices for user authentication and authorization.

Features JWT access tokens with refresh token rotation, bcrypt password hashing, role-based access control (RBAC), and session management. Includes middleware for route protection and user context management.`,

  category: TemplateCategory.BACKEND,
  tags: [
    TemplateTag.TYPESCRIPT,
    TemplateTag.NODE,
    TemplateTag.EXPRESS,
    TemplateTag.AUTH,
    TemplateTag.API,
    TemplateTag.SERVICE,
  ],

  hasLiveDemo: false,

  codeFiles: [
    {
      filename: 'authService.ts',
      language: 'typescript',
      path: 'services/auth/authService.ts',
      description: 'Core authentication logic with JWT generation and validation',
      isMain: true,
      code: `import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User, AuthTokens } from './types';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyAccessToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return null;
    }
  }
}`,
    },
    {
      filename: 'authMiddleware.ts',
      language: 'typescript',
      path: 'middleware/authMiddleware.ts',
      description: 'Express middleware for route protection',
      code: `import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth/authService';

const authService = new AuthService();

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = authService.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};`,
    },
  ],

  howToUse: `# Installation

\`\`\`bash
pnpm add bcrypt jsonwebtoken
pnpm add -D @types/bcrypt @types/jsonwebtoken
\`\`\`

# Environment Variables

\`\`\`env
JWT_SECRET=your-super-secret-jwt-key
REFRESH_SECRET=your-super-secret-refresh-key
\`\`\`

# Basic Usage

\`\`\`typescript
import { AuthService } from './services/auth/authService';
import { requireAuth, requireRole } from './middleware/authMiddleware';

const authService = new AuthService();

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user || !await authService.verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = authService.generateAccessToken(user.id, user.role);
  const refreshToken = authService.generateRefreshToken(user.id);

  res.json({ accessToken, refreshToken });
});

// Protected route
app.get('/api/profile', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route
app.delete('/api/users/:id', requireAuth, requireRole(['admin']), (req, res) => {
  // Delete user
});
\`\`\``,

  features: [
    'JWT access tokens (15 min expiry)',
    'Refresh tokens (7 day expiry)',
    'Bcrypt password hashing (10 rounds)',
    'Role-based access control (RBAC)',
    'Express middleware for route protection',
    'Type-safe with TypeScript',
    'Secure secret management via environment variables',
  ],

  dependencies: [
    {
      name: 'bcrypt',
      version: '^5.1.0',
      type: 'runtime',
      required: true,
    },
    {
      name: 'jsonwebtoken',
      version: '^9.0.0',
      type: 'runtime',
      required: true,
    },
    {
      name: 'express',
      version: '^4.18.0',
      type: 'runtime',
      required: true,
    },
    {
      name: '@types/bcrypt',
      version: '^5.0.0',
      type: 'dev',
      required: true,
    },
    {
      name: '@types/jsonwebtoken',
      version: '^9.0.0',
      type: 'dev',
      required: true,
    },
  ],

  createdAt: '2025-12-11',
  updatedAt: '2025-12-11',
  author: 'Mock Template',
  featured: false,
};
