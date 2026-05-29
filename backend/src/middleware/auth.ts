import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
    role: string;
    permissions: string[];
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as {
        id: string;
        isAdmin: boolean;
        role?: string;
        permissions?: string[];
      };
      
      req.user = {
        id: decoded.id,
        isAdmin: decoded.isAdmin,
        role: decoded.role || 'customer',
        permissions: decoded.permissions || [],
      };
      next();
      return;
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  res.status(401).json({ message: 'Not authorized, no token' });
  return;
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin' || req.user.role === 'super_admin' || req.user.role === 'demo_admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not authorized.`,
      });
    }
  };
};

export const hasPermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    if (
      req.user.role === 'admin' ||
      req.user.role === 'super_admin' ||
      req.user.role === 'demo_admin' ||
      req.user.permissions.includes(permission)
    ) {
      next();
    } else {
      res.status(403).json({
        message: `Access denied. Missing permission: ${permission}`,
      });
    }
  };
};
