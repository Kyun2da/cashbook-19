import { Service } from 'typedi';

import Payment from '@/models/payment';

@Service()
export default class PaymentService {
  static DUMMY_PAYMENTS = ['농협통장', '카카오뱅크', '현대카드', '비씨카드', '현금'];

  async makeDefaultPayments(userId: number): Promise<Payment[]> {
    const defaultPayments = PaymentService.DUMMY_PAYMENTS.map((name) => {
      const payment = new Payment();
      payment.userId = userId;
      payment.name = name;
      return payment;
    });
    return Payment.save(defaultPayments);
  }
}
