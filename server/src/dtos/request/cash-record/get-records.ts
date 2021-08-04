import { query } from 'express-validator';
import { Request } from 'express';

export default class GetRecordsRequest {
  static validators = [
    query('year').isInt().withMessage('query:year는 반드시 숫자여야 합니다.'),
    query('month').isInt({ min: 1, max: 12 }).withMessage('query:month는 1~12 사이이여야 합니다.'),
  ];

  year: number;

  month: number;

  constructor(req: Request) {
    const now = new Date();

    if (req.query.year) {
      this.year = parseInt(req.query.year as string, 10);
    } else {
      this.year = now.getFullYear();
    }

    if (req.query.month) {
      this.month = parseInt(req.query.month as string, 10);
    } else {
      this.month = now.getMonth() + 1;
    }
  }
}
