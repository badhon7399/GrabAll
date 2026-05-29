import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

/**
 * Strict Origin-Based CSRF Defense Middleware
 * 
 * Verifies that the Origin or Referer header of any state-modifying
 * request (POST, PUT, DELETE, PATCH) matches the allowed origins.
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  // Skip validation for safe HTTP methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin as string | undefined;
  const referer = req.headers.referer as string | undefined;

  let requestOrigin: string | null = null;
  if (origin) {
    requestOrigin = origin;
  } else if (referer) {
    try {
      requestOrigin = new URL(referer).origin;
    } catch (e) {
      // Invalid URL in referer
    }
  }

  if (config.NODE_ENV === 'production') {
    // In production, strictly enforce that all state-modifying requests have a valid origin
    if (!requestOrigin || !config.ALLOWED_ORIGINS.includes(requestOrigin)) {
      res.status(403).json({ message: 'CSRF validation failed: Invalid or missing origin' });
      return;
    }
  } else {
    // In development, allow missing origin but validate if present
    if (requestOrigin) {
      const isAllowed = config.ALLOWED_ORIGINS.includes(requestOrigin) || 
                        requestOrigin.includes('localhost') || 
                        requestOrigin.includes('127.0.0.1');
      if (!isAllowed) {
        res.status(403).json({ message: 'CSRF validation failed: Origin not allowed' });
        return;
      }
    }
  }

  next();
};
