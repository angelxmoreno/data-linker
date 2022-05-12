import Strategy from 'passport-headerapikey';
import { UserEntity } from '@database/entities/UserEntity';

const options = { header: 'Authorization', prefix: 'apikey:' };
const passReqToCallback = false;
const verify = async (apiKey: string, done) => {
    try {
        const user = await UserEntity.findOneByOrFail({ apiKey });
        done(null, user);
    } catch (error) {
        done(error);
    }
};
const headerAPIKeyStrategy = new Strategy(options, passReqToCallback, verify);
export default headerAPIKeyStrategy;
