import CakePhpNamingStrategy from '@database/CakePhpNamingStrategy';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import env from '@utils/env';

const appConfig = {
    database: {
        url: env.asString('DATABASE_URL'),
        logging: env.asBoolean('DATABASE_LOGGING'),
        synchronize: env.asBoolean('DATABASE_SYNC'),
        migrationsRun: env.asBoolean('DATABASE_AUTO_MIGRATIONS'),
    },
};
const dbOptions: MysqlConnectionOptions = {
    type: 'mysql',
    url: appConfig.database.url,
    charset: 'utf8mb4',
    timezone: 'Z',
    namingStrategy: new CakePhpNamingStrategy(),
    synchronize: appConfig.database.synchronize,
    logging: appConfig.database.logging,
    migrationsRun: appConfig.database.migrationsRun,
    entities: [`${__dirname}/entities/*Entity.{js,ts}`],
    subscribers: [`${__dirname}/subscribers/*.{js,ts}`],
    migrations: [`${__dirname}/migrations/*.{js,ts}`],
    migrationsTableName: 'migrations',
};

export default dbOptions;
