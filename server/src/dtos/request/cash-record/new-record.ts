import { body } from 'express-validator';
import { Request } from 'express';
import dayjs from 'dayjs';

export default class NewRecordRequest {
  static validators = [
    body('date')
      .custom((date: string) => {
        if (!date) return false;
        try {
          dayjs(date, 'YYYYMMDD');
          return true;
        } catch {
          return false;
        }
      })
      .withMessage('body:date는 YYYYMMDD 형태여야 합니다.'),
    body('categoryId').notEmpty().withMessage('body:categoryId가 존재하지 않습니다.'),
    body('paymentId').notEmpty().withMessage('body:paymentId가 존재하지 않습니다.'),
    body('title').notEmpty().withMessage('body:title이 존재하지 않습니다.'),
    body('value').isInt().withMessage('body:value 반드시 숫자여야 합니다.'),
  ];

  date: Date;

  categoryId: string;

  paymentId: string;

  title: string;

  value: number;

  constructor(req: Request) {
    this.date = dayjs(req.body.date, 'YYYYMMDD').toDate();
    this.categoryId = req.body.categoryId;
    this.paymentId = req.body.paymentId;
    this.title = req.body.title;
    this.value = parseInt(req.body.value, 10);
  }
}
