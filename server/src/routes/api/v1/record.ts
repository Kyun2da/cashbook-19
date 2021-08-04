import { Router } from 'express';
import { Container } from 'typedi';

import asyncWrapper from '@/middlewares/async-wrapper';
import CashRecordController from '@/controllers/cash-record';

import { auth } from '@/middlewares/jwt';
import invalidRequest from '@/middlewares/invalid-request';
import GetRecordsRequest from '@/dtos/request/cash-record/get-records';
import NewRecordRequest from '@/dtos/request/cash-record/new-record';

const router = Router();
const cashRecordService = Container.get(CashRecordController);

router.get('/', invalidRequest(...GetRecordsRequest.validators), asyncWrapper(cashRecordService.getRecords));
router.post('/', auth, invalidRequest(...NewRecordRequest.validators), asyncWrapper(cashRecordService.addRecord));

export default router;
