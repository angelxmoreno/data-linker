import { UserEntity } from '@database/entities/UserEntity';

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserEntity;
    }
}
