import { Router } from 'express';
import { Container } from 'typedi';

import asyncWrapper from '@/middlewares/async-wrapper';

import { auth } from '@/middlewares/jwt';
import invalidRequest from '@/middlewares/invalid-request';
import PaymentController from '@/controllers/payment';
import NewPaymentRequest from '@/dtos/request/payment/new-payment';

const router = Router();
const paymentService = Container.get(PaymentController);

router.post('/', auth, invalidRequest(...NewPaymentRequest.validators), asyncWrapper(paymentService.addPayment));
router.delete('/:id', auth, asyncWrapper(paymentService.deletePayment));

export default router;
