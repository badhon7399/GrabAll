import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Clean target URL of query params if needed, or keep originalUrl
  const url = req.originalUrl;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${url} ${res.statusCode} - ${duration}ms - ${ip}`
    );
  });

  next();
};
