import bcrypt from 'bcryptjs';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { allowRoles, requireAuth, signToken, type AuthedRequest } from './auth.js';
import type { AppStorage } from './storage.js';
import { TRACKING_SORT_FIELDS } from './types.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(100)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const searchSchema = z.object({
  query: z.string().trim().regex(/^[A-Za-z0-9-]*$/, 'Resi hanya boleh huruf, angka, dan tanda hubung.').default(''),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(20).default(5),
  sortBy: z.enum(TRACKING_SORT_FIELDS).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

function sanitizeUser(user: Awaited<ReturnType<AppStorage['findUserById']>>) {
  if (!user) {
    return null;
  }
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function createApp(storage: AppStorage) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.post('/api/auth/register', async (request, response, next) => {
    try {
      const input = registerSchema.parse(request.body);
      const existing = await storage.findUserByEmail(input.email);
      if (existing) {
        response.status(409).json({ message: 'Email already registered.' });
        return;
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const user = await storage.createUser({
        email: input.email,
        passwordHash,
        name: input.name,
        role: 'staff'
      });
      const safeUser = sanitizeUser(user);
      response.status(201).json({
        token: signToken({
          sub: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }),
        user: safeUser
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/login', async (request, response, next) => {
    try {
      const input = loginSchema.parse(request.body);
      const user = await storage.findUserByEmail(input.email);
      if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
        response.status(401).json({ message: 'Invalid email or password.' });
        return;
      }

      response.json({
        token: signToken({
          sub: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }),
        user: sanitizeUser(user)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/auth/me', requireAuth, async (request: AuthedRequest, response, next) => {
    try {
      const user = await storage.findUserById(request.authUser!.sub);
      if (!user) {
        response.status(404).json({ message: 'User not found.' });
        return;
      }
      response.json({ user: sanitizeUser(user) });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/dashboard', requireAuth, allowRoles('admin', 'manager', 'staff'), async (request: AuthedRequest, response, next) => {
    try {
      const orders = await storage.listOrders();
      const tracking = await storage.searchTracking({
        query: '',
        page: 1,
        pageSize: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      response.json({
        role: request.authUser!.role,
        stats: {
          totalOrders: orders.length,
          totalTracking: tracking.total
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/orders', requireAuth, allowRoles('admin', 'manager'), async (_request, response, next) => {
    try {
      response.json({ data: await storage.listOrders() });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/tracking/search', requireAuth, allowRoles('admin', 'manager', 'staff'), async (request, response, next) => {
    try {
      const params = searchSchema.parse({
        query: request.query.resi ?? request.query.query ?? '',
        page: request.query.page ?? 1,
        pageSize: request.query.pageSize ?? 5,
        sortBy: request.query.sortBy ?? 'createdAt',
        sortOrder: request.query.sortOrder ?? 'desc'
      });
      response.json(await storage.searchTracking(params));
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/tracking/:resiNumber', requireAuth, allowRoles('admin', 'manager', 'staff'), async (request, response, next) => {
    try {
      const tracking = await storage.getTrackingByResi(String(request.params.resiNumber));
      if (!tracking) {
        response.status(404).json({ message: 'Tracking not found.' });
        return;
      }
      response.json({ data: tracking });
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof z.ZodError) {
      response.status(400).json({
        message: 'Validation failed.',
        issues: error.issues.map((issue) => issue.message)
      });
      return;
    }

    response.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected server error.'
    });
  });

  return app;
}
