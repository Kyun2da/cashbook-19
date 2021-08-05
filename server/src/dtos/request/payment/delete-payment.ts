import { Request } from 'express';

export default class DeletePaymentRequest {
  paymentId: string;

  constructor(req: Request) {
    this.paymentId = req.params.id as string;
  }
}
