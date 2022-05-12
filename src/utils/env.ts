import get from 'lodash/get';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config({
    path: '.env',
});
dotenvExpand.expand(myEnv);
const asString = (path: string): string => String(get(process.env, path, ''));
const asBoolean = (path: string): boolean => String(get(process.env, path, 'false')) === 'true';
const asNumber = (path: string): number => Number(get(process.env, path, 0));
const isDev = () => process.env.NODE_ENV === 'development';

export default { asString, asBoolean, asNumber, isDev };
