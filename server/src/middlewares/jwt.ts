/* eslint-disable import/prefer-default-export */

import { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';

import jwtConfig from '@/config/jwt';

// jwt 검사 middleware
export const jwtCheck = jwt({
  secret: jwtConfig.secret,
  algorithms: [jwtConfig.algorithm],
  getToken: (req) => {
    if (req.cookies.access_token) {
      return req.cookies.access_token;
    }

    return null;
  },
});

// jwt 인증 middleware에서 발생한 에러를 처리하는 handler
export function handleJwtError(err: any, req: Request, res: Response, next: NextFunction): Response | void {
  if (err.name === 'UnauthorizedError') {
    if (err.inner?.name === 'TokenExpiredError') {
      return res.status(401).json({
        errorCode: 'JWT_TOKEN_EXPIRED',
        errorMessage: 'jwt 토큰이 만료됐습니다.',
      });
    }
    if (err.inner?.name === 'JsonWebTokenError') {
      return res.status(401).json({
        errorCode: 'JWT_TOKEN_INVALID',
        errorMessage: 'jwt 토큰이 올바르지 않습니다.',
      });
    }

    return res.status(401).json({
      errorCode: 'NO_JWT_TOKEN',
      errorMessage: 'jwt 토큰이 없습니다.',
    });
  }

  return next(err);
}
