import type { Express } from 'express-serve-static-core';

import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import debug from 'debug';
import cors from 'cors';

import rootRouter from '@/routes';
import config from '@/config';

const log = debug('express:debug');

export default async ({ app }: { app: Express }): Promise<void> => {
  app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.use(
    cors({
      credentials: true,
      origin: config.siteUri,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/', rootRouter);

  // Error Handler
  app.use((err, req, res, next) => {
    log('처리 되지 않은 에러: %O', err);
    return res.status(500).json({
      errors: {
        message: process.env.NODE_ENV === 'development' ? err.message : 'INTERNAL_SERVER_ERROR',
      },
    });
  });
};
