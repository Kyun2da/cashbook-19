import { Service } from 'typedi';
import { Request, Response } from 'express';

import GetRecordsRequest from '@/dtos/request/cash-record/get-records';
import NewRecordsRequest from '@/dtos/request/cash-record/new-record';
import DeleteRecordRequest from '@/dtos/request/cash-record/delete-record';
import CashRecordDto from '@/dtos/model/cash-record';

import CashRecordService from '@/services/cash-record';

@Service()
export default class CashRecordController {
  constructor(private cashRecordService: CashRecordService) {
    this.getRecords = this.getRecords.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
  }

  async getRecords(req: Request, res: Response<CashRecordDto[]>): Promise<Response<CashRecordDto[]>> {
    const userId = req.jwt?.access?.userId;
    const getRecordsRequest = new GetRecordsRequest(req);
    const records = await this.cashRecordService.getRecords(userId, getRecordsRequest);
    return res.json(records);
  }

  async addRecord(req: Request, res: Response<CashRecordDto>): Promise<Response<CashRecordDto>> {
    const userId = req.jwt?.access?.userId;
    const newRecordRequest = new NewRecordsRequest(req);
    const newRecord = await this.cashRecordService.addRecord(userId, newRecordRequest);
    return res.status(201).json(newRecord);
  }

  async deleteRecord(req: Request, res: Response): Promise<void> {
    const userId = req.jwt?.access?.userId;
    const deleteRecordRequest = new DeleteRecordRequest(req);
    await this.cashRecordService.deleteRecord(userId, deleteRecordRequest);

    return res.status(204).end();
  }
}
