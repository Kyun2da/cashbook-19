import { Service } from 'typedi';

import Payment from '@/models/payment';
import NewPaymentRequest from '@/dtos/request/payment/new-payment';
import PaymentDto from '@/dtos/model/payment';
import DeletePaymentRequest from '@/dtos/request/payment/delete-payment';
import { ApiError } from '@/core/error';
import { QueryFailedError } from 'typeorm';

@Service()
export default class PaymentService {
  static DUMMY_PAYMENTS = ['농협통장', '카카오뱅크', '현대카드', '비씨카드', '현금'];

  async makeDefaultPayments(userId: string): Promise<Payment[]> {
    const defaultPayments = PaymentService.DUMMY_PAYMENTS.map((name) => {
      const payment = new Payment();
      payment.userId = userId;
      payment.name = name;
      return payment;
    });
    return Payment.save(defaultPayments);
  }

  async addPayment(userId: string, request: NewPaymentRequest): Promise<PaymentDto> {
    const payment = new Payment();
    payment.userId = userId;
    payment.name = request.name;
    await payment.save();
    return new PaymentDto(payment);
  }

  async deletePayment(userId: string, request: DeletePaymentRequest): Promise<void> {
    const foundPayment = await Payment.findOne(request.paymentId);

    if (!foundPayment) {
      throw new ApiError('해당 결제수단은 없습니다.', 404);
    }
    if (foundPayment.userId !== userId) {
      throw new ApiError('해당 결제수단에 권한이 없습니다.', 403);
    }

    try {
      await Payment.remove(foundPayment);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        // 일단 날 수 있는게 이것밖에 없으니 이렇게 처리... ㅎㅎ;;
        throw new ApiError('사용중인 결제수단은 삭제가 불가능합니다.', 400);
      }
      throw e;
    }
  }
}
