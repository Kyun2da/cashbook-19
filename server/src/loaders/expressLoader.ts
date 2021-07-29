import type { Express } from 'express-serve-static-core';

import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from '@/routes';

export default async ({ app }: { app: Express }): Promise<void> => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/', indexRouter);

  // Error Handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
