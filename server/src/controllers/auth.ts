import { Service } from 'typedi';
import { Request, Response } from 'express';

import OAuthService from '@/services/oauth';
import JwtService from '@/services/jwt';

import config from '@/config';
import oAuthConfig from '@/config/oauth';
import constant from '@/core/constant';

import GithubRequest from '@/dtos/request/oauth/github';

@Service()
export default class AuthController {
  static GITHUB_OAUTH_LOGIN_URI = 'https://github.com/login/oauth/authorize';

  constructor(private oauthService: OAuthService, private jwtService: JwtService) {
    this.githubLogin = this.githubLogin.bind(this);
    this.githubCallback = this.githubCallback.bind(this);
    this.logout = this.logout.bind(this);
  }

  githubLogin(req: Request, res: Response): void {
    const clientIdQuery = `client_id=${oAuthConfig.github.clientId}`;
    const redirectUriQuery = `redirect_uri=${oAuthConfig.github.redirectUri}`;
    res.redirect(`${AuthController.GITHUB_OAUTH_LOGIN_URI}?${clientIdQuery}&${redirectUriQuery}`);
  }

  async githubCallback(req: Request, res: Response): Promise<void> {
    const githubRequest = new GithubRequest(req);
    const userId = await this.oauthService.signupAndSignin(githubRequest.code);
    const tokens = await this.jwtService.issueToken(userId);

    return res
      .cookie(constant.request.cookie.accessToken, tokens.access, {
        httpOnly: true,
      })
      .cookie(constant.request.cookie.refreshToken, tokens.refresh, {
        httpOnly: true,
      })
      .redirect(config.siteUri);
  }

  async logout(req: Request, res: Response): Promise<void> {
    if (req.jwt.refresh) {
      await this.jwtService.removeRefreshToken(req.jwt.refresh.tokenId);
      res.clearCookie(constant.request.cookie.accessToken);
      res.clearCookie(constant.request.cookie.refreshToken);
    }

    return res.redirect(config.siteUri);
  }
}
