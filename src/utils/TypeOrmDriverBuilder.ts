import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSourceOptions } from 'typeorm';
import appConfig from '../config';

export type DatabaseTypes = 'mysql' | 'postgresql';
export type DriverBuilderOptions = {
    sharedOptions: Partial<BaseDataSourceOptions>;
    mysql?: MysqlConnectionOptions;
    postgres?: PostgresConnectionOptions;
};

export class TypeOrmDriverBuilder {
    static build(options: DriverBuilderOptions): DataSourceOptions {
        let dbOptions: DataSourceOptions;

        const databaseType = this.databaseType();
        switch (databaseType) {
            case 'mysql':
                dbOptions = { ...options.sharedOptions, ...options.mysql };
                break;

            case 'postgresql':
                dbOptions = { ...options.sharedOptions, ...options.postgres };
                break;

            default:
                throw new Error(`Unsupported DB protocol '${databaseType}'`);
        }

        return dbOptions;
    }

    static databaseType(): DatabaseTypes {
        const uriParts = new URL(appConfig.database.url);
        return uriParts.protocol.slice(0, -1) as DatabaseTypes;
    }
}
