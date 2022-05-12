import env from '@utils/env';

const config = {
    node: {
        baseUrl: env.asString('BASE_URL'),
        port: env.asNumber('PORT'),
    },
};

type AppConfig = typeof config;

const appConfig: AppConfig = config;
export default appConfig;
