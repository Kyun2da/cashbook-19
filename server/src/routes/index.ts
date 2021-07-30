import { Router } from 'express';

import oauthRouter from '@/routes/oauth';
import apiV1Router from '@/routes/api/v1';

const router = Router();
router.use('/oauth', oauthRouter);
router.use('/api/v1', apiV1Router);

export default router;
