/* eslint-disable import/first */

import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import loader from '@/loaders';
import config from '@/config';

async function startServer() {
  const app = express();

  await loader.init({ expressApp: app });

  app.listen(config.port, () => {
    console.log(`The application is listening on port ${config.port}!`);
  });
}

startServer();
