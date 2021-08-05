import { Request } from 'express';

export default class DeleteRecordRequest {
  recordId: string;

  constructor(req: Request) {
    this.recordId = req.params.id as string;
  }
}
