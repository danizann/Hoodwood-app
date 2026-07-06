import jwt, { type SignOptions } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { getConfig } from './config.js';
import type { Role } from './types.js';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthedRequest extends Request {
  authUser?: AuthTokenPayload;
}

export function signToken(payload: AuthTokenPayload): string {
  const config = getConfig();
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] });
}

export function requireAuth(request: AuthedRequest, response: Response, next: NextFunction): void {
  const header = request.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    response.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const token = header.slice('Bearer '.length);
    request.authUser = jwt.verify(token, getConfig().jwtSecret) as AuthTokenPayload;
    next();
  } catch {
    response.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function allowRoles(...roles: Role[]) {
  return (request: AuthedRequest, response: Response, next: NextFunction): void => {
    if (!request.authUser) {
      response.status(401).json({ message: 'Authentication required.' });
      return;
    }

    if (!roles.includes(request.authUser.role)) {
      response.status(403).json({ message: 'You do not have access to this resource.' });
      return;
    }

    next();
  };
}
