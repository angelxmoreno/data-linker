import passport from 'passport';
import { Application, NextFunction, Request, Response } from 'express';
import { UserEntity, UserRole } from '@database/entities/UserEntity';
import headerAPIKeyStrategy from './strategies/headerAPIKeyStrategy';
import { ForbiddenException } from '@exceptions/ForbiddenException';

const passportAuthenticate = async (request: Request): Promise<UserEntity> => {
    return new Promise((resolve, reject) => {
        if (request.user) return resolve(request.user as UserEntity);
        passport.authenticate('headerapikey', { session: false }, (w, user, error) => {
            if (!!error) {
                reject(error.messsage || error);
            } else if (!user) {
                reject('Unknown error authenticating request');
            } else {
                resolve(user);
            }
        })(request);
    });
};

const UserIdentifyMiddleware = async (request: Request, response: Response, next?: NextFunction) => {
    try {
        request.user = await passportAuthenticate(request);
    } catch (e) {}
    next();
};
export const onlyAuthenticated = (role?: UserRole | UserRole[]) => {
    const $role = role || [];
    const roles = Array.isArray($role) ? $role : [$role];

    return [
        passport.authenticate('headerapikey', { session: false }),
        (req: Request, res: Response, next: NextFunction) => {
            if (roles.length > 0 && !roles.includes(req.user.role)) {
                throw new ForbiddenException();
            }

            next();
        },
    ];
};
export const applyAuth = (app: Application) => {
    app.use(passport.initialize());
    passport.use(headerAPIKeyStrategy);
    app.use(UserIdentifyMiddleware);
};
