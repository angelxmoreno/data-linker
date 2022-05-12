import expressWinston from 'express-winston';
import { Request, Response } from 'express';
import logger from '@loggers/index';

type UserEntity = {
    role: string;
    name: string;
};

interface RequestWithUser extends Request {
    user?: UserEntity;
}

const winstonLogger = () =>
    expressWinston.logger({
        winstonInstance: logger,
        colorize: true,
        meta: false,
        metaField: null,
        msg: (req: RequestWithUser, res: Response) => {
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
