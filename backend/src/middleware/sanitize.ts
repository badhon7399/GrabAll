import { Request, Response, NextFunction } from 'express';

function sanitize(obj: any): any {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    }
  }
  return obj;
}

export const mongoSanitize = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};
