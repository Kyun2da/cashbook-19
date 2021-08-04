import { Service } from 'typedi';

import User from '@/models/user';
import Category from '@/models/category';
import Payment from '@/models/payment';

import InitResponse from '@/dtos/response/user/init';

import constant from '@/core/constant';

@Service()
export default class UserService {
  async getInitData(userId: string | null): Promise<InitResponse> {
    const isDummy = !userId;
    const user = isDummy
      ? await User.findOne({ where: { githubId: constant.dummy.githubId } })
      : await User.findOne(userId);
    const categories = await Category.find({ where: { userId: user.id } });
    const payments = await Payment.find({ where: { userId: user.id } });
    return new InitResponse(isDummy ? null : user, categories, payments);
  }
}
