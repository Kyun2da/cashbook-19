import Payment from '@/models/payment';

export default class PaymentDto {
  id: string;

  name: string;

  constructor(payment: Payment) {
    this.id = payment.id;
    this.name = payment.name;
  }
}
