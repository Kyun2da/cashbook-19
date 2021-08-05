import { Router } from 'express';
import { Container } from 'typedi';

import asyncWrapper from '@/middlewares/async-wrapper';
import UserController from '@/controllers/user';

import recordRouter from './record';
import testRouter from './test';
import categoryRouter from './category';
import paymentRouter from './payment';

const router = Router();
const userController = Container.get(UserController);

router.get('/init', asyncWrapper(userController.getInit));

router.use('/records', recordRouter);
router.use('/test', testRouter);
router.use('/categories', categoryRouter);
router.use('/payments', paymentRouter);

export default router;
