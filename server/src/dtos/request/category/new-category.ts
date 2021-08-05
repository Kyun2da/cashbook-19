import { body } from 'express-validator';
import { Request } from 'express';
import { PaymentType } from '@/models/category';

export default class NewCategoryRequest {
  static validators = [
    body('type').isIn(['income', 'expenditure']).withMessage('body:type은 income 또는 expenditure이어야 합니다.'),
    body('name').notEmpty().withMessage('body:name이 존재하지 않습니다.'),
    body('color').isLength({ min: 6, max: 6 }).withMessage('body:color는 6자이여야 합니다.'),
  ];

  type: PaymentType;

  name: string;

  color: string;

  constructor(req: Request) {
    this.type = req.body.type;
    this.name = req.body.name;
    this.color = req.body.color;
  }
}
