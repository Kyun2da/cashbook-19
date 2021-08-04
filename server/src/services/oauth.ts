/* eslint-disable camelcase */

import { Service } from 'typedi';
import axios from 'axios';
import dayjs from 'dayjs';

import oAuthConfig from '@/config/oauth';
import User from '@/models/user';

import CategoryService from './category';
import PaymentService from './payment';
import CashRecordService from './cash-record';

interface UserInfo {
  id: number;
  name: string;
  avatarUri: string;
}

@Service()
export default class OAuthService {
  static GITHUB_OAUTH_ACCESS_TOKEN_URI = 'https://github.com/login/oauth/access_token';

  static GITHUB_USER_API_URI = 'https://api.github.com/user';

  constructor(
    private categoryServise: CategoryService,
    private paymentService: PaymentService,
    private cashRecordService: CashRecordService,
  ) {
    this.signupAndSignin = this.signupAndSignin.bind(this);
  }

  async signupAndSignin(code: string): Promise<number> {
    let userInfo: UserInfo;
    try {
      const accessTokenRes = await axios.post(
        OAuthService.GITHUB_OAUTH_ACCESS_TOKEN_URI,
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

      const userRes = await axios.get(OAuthService.GITHUB_USER_API_URI, {
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

      const categories = await this.categoryServise.makeDefaultCategories(userId);
      const payments = await this.paymentService.makeDefaultPayments(userId);
      const now = dayjs();
      await this.cashRecordService.makeRandomCashRecord(userId, categories, payments, now.year(), now.month() + 1);
    }

    return userId;
  }
}
