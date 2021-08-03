import { Service } from 'typedi';
import { Request, Response } from 'express';

import GetRecordsRequest from '@/dtos/request/get-records';
import RecordDto from '@/dtos/model/record';

import RecordService from '@/services/record';

@Service()
export default class RecordController {
  constructor(private recordService: RecordService) {
    this.getRecords = this.getRecords.bind(this);
  }

  async getRecords(req: Request, res: Response<RecordDto[]>): Promise<Response<RecordDto[]>> {
    const userId = req.jwt?.access?.userId;
    const getRecordsRequest = new GetRecordsRequest(req);
    const records = await this.recordService.getRecords(userId, getRecordsRequest);
    return res.json(records);
  }
}
