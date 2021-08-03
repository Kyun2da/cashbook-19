import User from '@/models/user';
import Category from '@/models/category';
import Payment from '@/models/payment';

import UserDto from '@/dtos/model/user';
import CategoryDto from '@/dtos/model/category';
import PaymentDto from '@/dtos/model/payment';
import RecordDto from '@/dtos/model/record';

export default class InitResponse {
  user?: UserDto;

  categories: CategoryDto[];

  payments: PaymentDto[];

  records: RecordDto[];

  constructor(user: User | null, categories: Category[], payments: Payment[]) {
    if (user) {
      this.user = new UserDto(user);
    }
    this.categories = categories.map((c) => new CategoryDto(c));
    this.payments = payments.map((p) => new PaymentDto(p));
  }
}
