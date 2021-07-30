import { Service } from 'typedi';
import jwt, { Algorithm } from 'jsonwebtoken';
import dayjs from 'dayjs';

import jwtConfig from '@/config/jwt';

import RefreshToken from '@/models/refresh-token';
import { ApiError } from '@/core/error';

interface Tokens {
  access: string;
  refresh: string;
}

@Service()
export default class JwtService {
  async issueToken(userId: number): Promise<Tokens> {
    const accessToken = jwt.sign(
      {
        type: 'access',
        userId,
      },
      jwtConfig.secret,
      {
        algorithm: jwtConfig.algorithm as Algorithm,
        expiresIn: jwtConfig.accessExpiresIn,
      },
    );

    const refreshTokenEntity = new RefreshToken();
    refreshTokenEntity.userId = userId;
    refreshTokenEntity.validUntil = dayjs().add(jwtConfig.refreshExpiresIn, 'second').toDate();
    await refreshTokenEntity.save();

    const refreshToken = jwt.sign(
      {
        type: 'refresh',
        tokenId: refreshTokenEntity.id,
      },
      jwtConfig.secret,
      {
        algorithm: jwtConfig.algorithm as Algorithm,
        expiresIn: jwtConfig.refreshExpiresIn,
      },
    );

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }

  async removeRefreshToken(refreshTokenId: number): Promise<void> {
    const foundRefreshToken = await RefreshToken.findOne(refreshTokenId);
    if (!foundRefreshToken) {
      throw new ApiError('존재하지 않는 refresh token 입니다.', 404);
    }

    await foundRefreshToken.remove();
  }

  async refreshToken(refreshTokenId: number): Promise<Tokens> {
    const foundRefreshToken = await RefreshToken.findOne(refreshTokenId);
    if (!foundRefreshToken) {
      throw new ApiError('존재하지 않는 refresh token 입니다.', 404);
    }
    const { userId } = foundRefreshToken;
    await foundRefreshToken.remove();

    return this.issueToken(userId);
  }
}
