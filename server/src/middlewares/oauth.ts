import { Request, Response, NextFunction } from 'express';

import config from '@/config';

export function oauthError(req: Request, res: Response, next: NextFunction): void {
  if (req.query.error) {
    return res.redirect(config.siteUri);
  }

  return next();
}
