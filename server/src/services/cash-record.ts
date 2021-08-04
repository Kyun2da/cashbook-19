/* eslint-disable no-continue */
import { Service } from 'typedi';

import User from '@/models/user';
import CashRecord from '@/models/cash-record';
import Category from '@/models/category';
import Payment from '@/models/payment';

import GetRecordsRequest from '@/dtos/request/get-records';

import { randomInt } from '@/core/utils';
import dummyRecordName from '@/assets/dummy/record-name.json';
import dayjs from 'dayjs';
import CashRecordDto from '@/dtos/model/cash-record';

import { Between } from 'typeorm';

import constant from '@/core/constant';

interface DummyRecordName {
  [type: string]: {
    [name: string]: {
      min: number;
      max: number;
      round: number;
      frequency?: number;
      sample: string[];
    };
  };
}

@Service()
export default class CashRecordService {
  static DUMMY_RECORD_NAME: DummyRecordName = dummyRecordName;

  async makeRandomCashRecord(
    userId: number,
    categories: Category[],
    payments: Payment[],
    year: number,
    month: number,
  ): Promise<void> {
    const count = randomInt(30, 50);
    const records: CashRecord[] = [];
    const frequencies: Record<string, number> = {};
    while (records.length < count) {
      const category = categories[randomInt(0, categories.length - 1)];
      const payment = payments[randomInt(0, payments.length - 1)];
      const type = CashRecordService.DUMMY_RECORD_NAME[category.type];
      if (!type) {
        continue;
      }
      const dummyCategory = type[category.name];
      if (!dummyCategory) {
        continue;
      }
      if (dummyCategory.frequency) {
        const frequencyKey = `${category.type}-${category.name}`;
        if (frequencyKey in frequencies) {
          if (frequencies[frequencyKey] >= dummyCategory.frequency) {
            continue;
          } else {
            frequencies[frequencyKey] += 1;
          }
        } else {
          frequencies[frequencyKey] = 1;
        }
      }

      const record = new CashRecord();
      record.userId = userId;
      record.categoryId = category.id;
      record.paymentId = payment.id;
      record.title = dummyCategory.sample[randomInt(0, dummyCategory.sample.length - 1)];
      const value = randomInt(dummyCategory.min, dummyCategory.max);
      record.value = Math.floor(value / dummyCategory.round) * dummyCategory.round;
      const lastDate = dayjs(`${year}-${month}`, 'YYYY-M').endOf('month').date();
      record.date = dayjs(`${year}-${month}-${randomInt(1, lastDate)}`, 'YYYY-M-D').toDate();
      records.push(record);
    }

    records.sort((a, b) => a.date.getTime() - b.date.getTime());
    await CashRecord.createQueryBuilder().insert().values(records).execute();
  }

  async makeDummyIfTheMonthEmpty(userId: number, year: number, month: number): Promise<void> {
    const startDate = dayjs(`${year}-${month}-1`, 'YYYY-M-D');
    const endDate = startDate.endOf('month');
    const count = await CashRecord.count({ where: { userId, date: Between(startDate.toDate(), endDate.toDate()) } });
    if (count === 0) {
      const categories = await Category.find({ where: { userId } });
      const payments = await Payment.find({ where: { userId } });
      await this.makeRandomCashRecord(userId, categories, payments, year, month);
    }
  }

  async getRecords(userId: number, request: GetRecordsRequest): Promise<CashRecordDto[]> {
    let realUserId: number = userId;
    if (!userId) {
      const dummyUser = await User.findOne({ where: { githubId: constant.dummy.githubId } });
      realUserId = dummyUser.id;
      if (dayjs(`${request.year}-${request.month}`, 'YYYY-M').endOf('month').isBefore(dayjs())) {
        await this.makeDummyIfTheMonthEmpty(realUserId, request.year, request.month);
      }
    }
    const startDate = dayjs(`${request.year}-${request.month}-1`, 'YYYY-M-D');
    const endDate = startDate.endOf('month');
    const records = await CashRecord.find({
      where: { userId: realUserId, date: Between(startDate.toDate(), endDate.toDate()) },
    });

    return records.map((r) => new CashRecordDto(r));
  }
}
