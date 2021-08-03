import { Router } from 'express';
import { Container } from 'typedi';

import asyncWrapper from '@/middlewares/async-wrapper';
import AuthController from '@/controllers/auth';

import invalidRequest from '@/middlewares/invalid-request';
import GithubRequest from '@/dtos/request/oauth/github';

const router = Router();
const authController = Container.get(AuthController);

router.get('/github/login', authController.githubLogin);
router.get(
  '/github/callback',
  invalidRequest(...GithubRequest.validators),
  asyncWrapper(authController.githubCallback),
);
router.get('/logout', asyncWrapper(authController.logout));

export default router;
