import { body } from 'express-validator';
import { Request } from 'express';

export default class NewPaymentRequest {
  static validators = [body('name').notEmpty().withMessage('body:name이 존재하지 않습니다.')];

  name: string;

  constructor(req: Request) {
    this.name = req.body.name;
  }
}
