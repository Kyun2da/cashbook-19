/* eslint-disable import/prefer-default-export */

import { Request, Response, NextFunction } from 'express';
import debug from 'debug';

import { ApiError } from '@/core/error';

const log = debug('API:V1');

export function handleApiError(err: any, req: Request, res: Response, next: NextFunction): Response | void {
  if (err instanceof ApiError) {
    log('ApiError 발생: %O', err);

    return res.status(err.status).json({
      errors: {
        message: err.message,
      },
    });
  }
  return next(err);
}
