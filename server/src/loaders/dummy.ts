import { Container } from 'typedi';
import dayjs from 'dayjs';

import User from '@/models/user';
import Category from '@/models/category';
import Payment from '@/models/payment';
import CashRecord from '@/models/cash-record';

import CategoryService from '@/services/category';
import PaymentService from '@/services/payment';
import CashRecordService from '@/services/cash-record';
import { Between } from 'typeorm';

import constant from '@/core/constant';

const categoryService = Container.get(CategoryService);
const paymentService = Container.get(PaymentService);
const cashRecordService = Container.get(CashRecordService);

export default async (): Promise<void> => {
  const foundDummyUser = await User.findOne({ where: { githubId: constant.dummy.githubId } });
  if (!foundDummyUser) {
    const dummyUser = new User();
    dummyUser.githubId = constant.dummy.githubId;
    dummyUser.avatarUri = '';
    dummyUser.name = 'anonymous';
    await dummyUser.save();
    const categories = await categoryService.makeDefaultCategories(dummyUser.id);
    const payments = await paymentService.makeDefaultPayments(dummyUser.id);
    const now = new Date();
    await cashRecordService.makeRandomCashRecord(
      dummyUser.id,
      categories,
      payments,
      now.getFullYear(),
      now.getMonth() + 1,
    );
  }
};
