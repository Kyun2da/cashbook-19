import { Service } from 'typedi';
import { Request, Response } from 'express';

import GetRecordsRequest from '@/dtos/request/get-records';
import CashRecordDto from '@/dtos/model/cash-record';

import CashRecordService from '@/services/cash-record';

@Service()
export default class CashRecordController {
  constructor(private cashRecordService: CashRecordService) {
    this.getRecords = this.getRecords.bind(this);
  }

  async getRecords(req: Request, res: Response<CashRecordDto[]>): Promise<Response<CashRecordDto[]>> {
    const userId = req.jwt?.access?.userId;
    const getRecordsRequest = new GetRecordsRequest(req);
    const records = await this.cashRecordService.getRecords(userId, getRecordsRequest);
    return res.json(records);
  }
}
