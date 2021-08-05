import { Service } from 'typedi';
import { Request, Response } from 'express';

import PaymentService from '@/services/payment';
import PaymentDto from '@/dtos/model/payment';
import NewPaymentRequest from '@/dtos/request/payment/new-payment';
import DeletePaymentRequest from '@/dtos/request/payment/delete-payment';

@Service()
export default class PaymentController {
  constructor(private paymentService: PaymentService) {
    this.deletePayment = this.deletePayment.bind(this);
    this.addPayment = this.addPayment.bind(this);
  }

  async addPayment(req: Request, res: Response): Promise<Response<PaymentDto>> {
    const userId = req.jwt?.access?.userId;
    const newPaymentRequest = new NewPaymentRequest(req);
    const newPayment = await this.paymentService.addPayment(userId, newPaymentRequest);
    return res.status(201).json(newPayment);
  }

  async deletePayment(req: Request, res: Response): Promise<void> {
    const userId = req.jwt?.access?.userId;
    const deletePaymentRequest = new DeletePaymentRequest(req);
    await this.paymentService.deletePayment(userId, deletePaymentRequest);

    return res.status(201).end();
  }
}
