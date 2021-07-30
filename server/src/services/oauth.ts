/* eslint-disable camelcase */

import { Service } from 'typedi';
import axios from 'axios';

import oAuthConfig from '@/config/oauth';
import User from '@/models/user';

const GITHUB_OAUTH_ACCESS_TOKEN_URI = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_API_URI = 'https://api.github.com/user';

interface UserInfo {
  id: number;
  name: string;
  avatarUri: string;
}

@Service()
export default class OAuthService {
  async signupAndSignin(code: string): Promise<number> {
    let userInfo: UserInfo;
    try {
      const accessTokenRes = await axios.post(
        GITHUB_OAUTH_ACCESS_TOKEN_URI,
        {
          client_id: oAuthConfig.github.clientId,
          client_secret: oAuthConfig.github.clientSecret,
          code,
          redirect_uri: oAuthConfig.github.redirectUri,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const accessToken = accessTokenRes.data.access_token;

      const userRes = await axios.get(GITHUB_USER_API_URI, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      userInfo = {
        id: userRes.data.id,
        name: userRes.data.name,
        avatarUri: userRes.data.avatar_url,
      };
    } catch (e) {
      throw new Error('깃허브 oauth 처리중 에러가 발생했습니다.');
    }

    const foundUser = await User.findOne({
      where: [
        {
          githubId: userInfo.id,
        },
      ],
    });

    let userId: number;
    if (foundUser) {
      // 업데이트
      foundUser.name = userInfo.name;
      foundUser.avatarUri = userInfo.avatarUri;
      await foundUser.save();
      userId = foundUser.id;
    } else {
      // 회원가입
      const newUser = new User();
      newUser.githubId = userInfo.id;
      newUser.name = userInfo.name;
      newUser.avatarUri = userInfo.avatarUri;
      await newUser.save();
      userId = newUser.id;
    }

    return userId;
  }
}
