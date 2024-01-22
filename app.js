import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import createError from 'http-errors-lite';
import { StatusCodes } from 'http-status-codes';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors({
    origin: [
      'http://localhost:3000'
    ]
  }));

  return app;
};

const notFoundHandler = (req, res, next) => {
  next(
    createError(StatusCodes.NOT_FOUND, `${req.originalUrl} route not found`)
  );
};

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: 'Something unwanted occured !!',
    error: err.message
  });
};

export const finishApp = (app) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};