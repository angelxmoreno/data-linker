import express from 'express';
import compression from 'compression';
import cors from 'cors';
import winstonLogger from '@loggers/winstonLogger';
import bodyParser from 'body-parser';
import { IndexRouter } from '@routes/IndexRoute';
import { applyAuth } from './auth';

const server = express();

server.use(winstonLogger());
server.use(compression());
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.disable('x-powered-by');
server.set('etag', false);
applyAuth(server);
server.use(IndexRouter);
export default server;
