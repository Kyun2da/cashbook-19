/* eslint-disable import/first */

import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import loader from '@/loaders';

async function startServer() {
  const app = express();

  await loader.init({ expressApp: app });

  app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
  });
}

startServer();
