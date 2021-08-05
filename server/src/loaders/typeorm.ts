import { createConnection } from 'typeorm';

import config from '@/config/typeorg';

import User from '@/models/user';
import RefreshToken from '@/models/refresh-token';
import Category from '@/models/category';
import Payment from '@/models/payment';
import CashRecord from '@/models/cash-record';

export default async (): Promise<void> => {
  await createConnection({
    type: 'mysql',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    logging: process.env.NODE_ENV === 'development',
    synchronize: false,
    entities: [User, RefreshToken, Category, Payment, CashRecord],
  });
};
