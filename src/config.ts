import env from '@utils/env';

const config = {
    node: {
        baseUrl: env.asString('BASE_URL'),
        port: env.asNumber('PORT'),
    },
    database: {
        url: env.asString('DATABASE_URL'),
        logging: env.asBoolean('DATABASE_LOGGING'),
        synchronize: env.asBoolean('DATABASE_SYNC'),
        migrationsRun: env.asBoolean('DATABASE_AUTO_MIGRATIONS'),
    },
};

type AppConfig = typeof config;

const appConfig: AppConfig = config;
export default appConfig;
