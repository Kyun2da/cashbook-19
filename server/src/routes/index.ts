import { Router } from 'express';

import { jwtCheck } from '@/middlewares/jwt';
import { handleApiError } from '@/middlewares/api';

import authRouter from '@/routes/auth';
import apiV1Router from '@/routes/api/v1';

const router = Router();

router.use(jwtCheck);

router.use('/auth', authRouter);
router.use('/api/v1', apiV1Router);

// TODO: request validation error handler
router.use(handleApiError);

export default router;
