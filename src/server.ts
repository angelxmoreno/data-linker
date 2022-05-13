import express, { ErrorRequestHandler } from 'express';
import compression from 'compression';
import cors from 'cors';
import winstonLogger from '@loggers/winstonLogger';
import bodyParser from 'body-parser';
import { IndexRouter } from '@routes/IndexRoute';
import { applyAuth } from './auth';
import { WriteController } from '@routes/WriteController';
import { HttpException } from '@exceptions/HttpException';

const server = express();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof HttpException) {
        res.status(err.status).json(err);
    } else {
        res.status(500).json({
            type: 'Unknown',
            error: err.message,
        });
    }
};

server.use(winstonLogger());
server.use(compression());
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.disable('x-powered-by');
server.set('etag', false);
applyAuth(server);
server.use(IndexRouter);
server.use(WriteController);

server.use(errorHandler);
export default server;
