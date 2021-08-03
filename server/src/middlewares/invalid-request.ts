import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

import { ApiError } from '@/core/error';

function handleInvalidRequest(req: Request, _: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    throw new ApiError(`입력값에 문제가 있습니다. : [${details}]`, 400);
  }

  return next();
}

export default (...rules: ValidationChain[]): RequestHandler[] => [...rules, handleInvalidRequest];
