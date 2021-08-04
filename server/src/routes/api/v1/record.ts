import { Router } from 'express';
import { Container } from 'typedi';

import asyncWrapper from '@/middlewares/async-wrapper';
import CashRecordController from '@/controllers/cash-record';

import invalidRequest from '@/middlewares/invalid-request';
import GetRecordsRequest from '@/dtos/request/get-records';

const router = Router();
const cashRecordService = Container.get(CashRecordController);

router.get('/', invalidRequest(...GetRecordsRequest.validators), asyncWrapper(cashRecordService.getRecords));

export default router;
