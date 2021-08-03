/* eslint-disable no-continue */
import { Service } from 'typedi';

import User from '@/models/user';
import Record from '@/models/record';
import Category from '@/models/category';
import Payment from '@/models/payment';

import GetRecordsRequest from '@/dtos/request/get-records';

import { randomInt } from '@/core/utils';
import dummyRecordName from '@/assets/dummy/record-name.json';
import dayjs from 'dayjs';
import RecordDto from '@/dtos/model/record';

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
export default class RecordService {
  static DUMMY_RECORD_NAME: DummyRecordName = dummyRecordName;

  async makeRandomRecord(
    userId: number,
    categories: Category[],
    payments: Payment[],
    year: number,
    month: number,
  ): Promise<Record[]> {
    const count = randomInt(10, 20);
    const records: Record[] = [];
    const frequencies: { [key: string]: number } = {};
    while (records.length < count) {
      const category = categories[randomInt(0, categories.length - 1)];
      const payment = payments[randomInt(0, payments.length - 1)];
      const type = RecordService.DUMMY_RECORD_NAME[category.type];
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
          frequencies[frequencyKey] = 0;
        }
      }

      const record = new Record();
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

    return Record.save(records.sort((a, b) => a.date.getTime() - b.date.getTime()));
  }

  async getRecords(userId: number, request: GetRecordsRequest): Promise<RecordDto[]> {
    let realUserId: number = userId;
    if (!userId) {
      const dummyUser = await User.findOne({ where: { githubId: constant.dummy.githubId } });
      realUserId = dummyUser.id;
    }
    const startDate = dayjs(`${request.year}-${request.month}-1`, 'YYYY-M-D');
    const endDate = startDate.endOf('month');
    const records = await Record.find({
      where: { userId: realUserId, date: Between(startDate.toISOString(), endDate.toISOString()) },
    });

    return records.map((r) => new RecordDto(r));
  }
}
