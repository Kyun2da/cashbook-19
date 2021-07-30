import { Router } from 'express';

import { jwtCheck, handleJwtError } from '@/middlewares/jwt';
import { handleApiError } from '@/middlewares/api';

import testRouter from './test';

const router = Router();

router.use(jwtCheck);
// TODO: access, refresh token에 일치하는 path 검사후 올바른지 확인하는 middleware
router.use(handleJwtError);

router.use('/test', testRouter);

// TODO: request validation error handler
router.use(handleApiError);

export default router;
