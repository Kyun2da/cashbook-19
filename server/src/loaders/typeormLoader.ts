import { createConnection } from 'typeorm';

import config from '@/config/typeorg';
import User from '@/models/user';

export default async (): Promise<void> => {
  await createConnection({
    type: 'mysql',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    logging: true,
    synchronize: false,
    entities: [User],
  });
};
