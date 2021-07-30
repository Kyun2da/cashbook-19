import { Router } from 'express';
import { Container } from 'typedi';

import OAuthService from '@/services/oauth';
import JwtService from '@/services/jwt';

import asyncWrapper from '@/middlewares/async-wrapper';
import GithubRequest from '@/requests/oauth/github';

import config from '@/config';

const router = Router();

const oauthService = Container.get(OAuthService);
const jwtService = Container.get(JwtService);

router.get(
  '/github',
  GithubRequest.validators,
  asyncWrapper(async (req, res) => {
    const githubRequest = new GithubRequest(req);
    const userId = await oauthService.signupAndSignin(githubRequest.code);
    const tokens = await jwtService.issueToken(userId);

    return res
      .cookie('access_token', tokens.access, {
        httpOnly: true,
      })
      .cookie('refresh_token', tokens.refresh, {
        httpOnly: true,
      })
      .redirect(config.siteUri);
  }),
);

export default router;
