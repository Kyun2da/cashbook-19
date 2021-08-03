import { Router } from 'express';
import { Container } from 'typedi';

import asyncWrapper from '@/middlewares/async-wrapper';
import RecordController from '@/controllers/record';

import invalidRequest from '@/middlewares/invalid-request';
import GetRecordsRequest from '@/dtos/request/get-records';

const router = Router();
const recordService = Container.get(RecordController);

router.get('/', invalidRequest(...GetRecordsRequest.validators), asyncWrapper(recordService.getRecords));

export default router;
