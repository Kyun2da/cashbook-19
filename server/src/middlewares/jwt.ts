/* eslint-disable import/prefer-default-export */

import { Request, Response, NextFunction } from 'express';
// import expressJwt from 'express-jwt';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

import jwtConfig from '@/config/jwt';
import { ApiError } from '@/core/error';
import constant from '@/core/constant';

import { Container } from 'typedi';
import JwtService from '@/services/jwt';

const jwtService = Container.get(JwtService);

// jwt가 존재하는지 확인하고 만료시 재인증
export async function jwtCheck(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  let existenceOfRefreshToken = false;
  let refreshTokenExpired = false;
  let refreshToken: RefreshToken;
  if (constant.request.cookie.refreshToken in req.cookies) {
    existenceOfRefreshToken = true;
    try {
      refreshToken = jwt.verify(req.cookies[constant.request.cookie.refreshToken], jwtConfig.secret) as RefreshToken;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        refreshTokenExpired = true;
      }

      return next(new ApiError(`${constant.request.cookie.refreshToken}이 올바르지 않습니다.`, 401));
    }
  }

  let accessToken: AccessToken;
  if (constant.request.cookie.accessToken in req.cookies) {
    try {
      accessToken = jwt.verify(req.cookies[constant.request.cookie.accessToken], jwtConfig.secret, {
        algorithms: [jwtConfig.algorithm],
      }) as AccessToken;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        if (existenceOfRefreshToken) {
          if (refreshTokenExpired) {
            res.clearCookie(constant.request.cookie.accessToken);
            res.clearCookie(constant.request.cookie.refreshToken);
          } else {
            const tokens = await jwtService.refreshToken(refreshToken.tokenId);
            res.cookie(constant.request.cookie.accessToken, tokens.access);
            res.cookie(constant.request.cookie.refreshToken, tokens.refresh);
          }
          return next();
        }
        return next(new ApiError('AccessToken이 만료됐습니다.', 401));
      }

      return next(new ApiError(`${constant.request.cookie.accessToken}이 올바르지 않습니다.`, 401));
    }
  }

  req.jwt = {
    access: accessToken,
    refresh: refreshToken,
  };
  return next();
}

export function checkRefreshToken(req: Request, _: Response, next: NextFunction): Response | void {
  if (!req.cookies.refresh_token) {
    next(new ApiError('RefreshToken이 존재하지 않습니다.', 401));
  }

  next();
}
