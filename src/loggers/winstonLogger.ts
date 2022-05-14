import expressWinston from 'express-winston';
import { Request, Response } from 'express';
import logger from '@loggers/index';

const winstonLogger = () =>
    expressWinston.logger({
        winstonInstance: logger,
        colorize: true,
        meta: false,
        metaField: null,
        msg: (req: Request, res: Response) => {
            const role = req.user ? req.user.role : 'guest';
            const name = req.user ? req.user.name : 'anonymous';
            return [
                new Date().toISOString(),
                `${role}:${name}`,
                req.protocol.toUpperCase(),
                req.method,
                res.statusCode,
                req.path,
                req.originalUrl.split('?').pop(),
                `{{res.responseTime}}ms`,
            ].join('\t');
        },
    });

export default winstonLogger;
