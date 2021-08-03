import Payment from '@/models/payment';

export default class PaymentDto {
  id: number;

  name: string;

  constructor(payment: Payment) {
    this.id = payment.id;
    this.name = payment.name;
  }
}
