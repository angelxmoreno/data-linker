import CakePhpNamingStrategy from '@database/CakePhpNamingStrategy';
import appConfig from '../config';
import { DriverBuilderOptions, TypeOrmDriverBuilder } from '@utils/TypeOrmDriverBuilder';

const options: DriverBuilderOptions = {
    sharedOptions: {
        namingStrategy: new CakePhpNamingStrategy(),
        synchronize: appConfig.database.synchronize,
        logging: appConfig.database.logging,
        migrationsRun: appConfig.database.migrationsRun,
        entities: [`${__dirname}/entities/*Entity.{js,ts}`],
        subscribers: [`${__dirname}/subscribers/*.{js,ts}`],
        migrations: [`${__dirname}/migrations/*.{js,ts}`],
        migrationsTableName: 'migrations',
    },
    mysql: {
        type: 'mysql',
        url: appConfig.database.url,
        charset: 'utf8mb4',
        timezone: 'Z',
    },
    postgres: {
        type: 'postgres',
        url: appConfig.database.url,
        ssl: appConfig.database.useSsl,
        extra: {
            ssl: !appConfig.database.useSsl
                ? undefined
                : {
                      rejectUnauthorized: false,
                  },
        },
    },
};

const dbOptions = TypeOrmDriverBuilder.build(options);
export default dbOptions;
