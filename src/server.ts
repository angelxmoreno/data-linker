import express, { ErrorRequestHandler, RequestHandler } from 'express';
import compression from 'compression';
import cors from 'cors';
import winstonLogger from '@loggers/winstonLogger';
import bodyParser from 'body-parser';
import { applyAuth } from './auth';
import { IndexRouter } from '@routes/IndexRoute';
import { WriteController } from '@routes/WriteController';
import { HttpException } from '@exceptions/HttpException';
import { ReadController } from '@routes/ReadController';
import { NotFoundException } from '@exceptions/NotFoundException';
import { EntityNotFoundError } from 'typeorm';

const server = express();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof HttpException) {
        res.status(err.status).json(err);
    } else if (err instanceof EntityNotFoundError) {
        res.status(404).json(new NotFoundException('Entity'));
    } else {
        res.status(500).json({
            type: 'Unknown',
            error: err.message,
        });
    }
};

const notFoundHandler: RequestHandler = (req, res) => {
    res.status(404).json(new NotFoundException());
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
server.use('/read', ReadController);
server.use('/write', WriteController);

server.use(errorHandler);
server.use(notFoundHandler);
export default server;
