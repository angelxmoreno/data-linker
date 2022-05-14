import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSourceOptions } from 'typeorm';

export type DriverBuilderOptions = {
    sharedOptions: Partial<BaseDataSourceOptions>;
    mysql?: MysqlConnectionOptions;
    postgres?: PostgresConnectionOptions;
};

export class TypeOrmDriverBuilder {
    static build(databaseUri: string, options: DriverBuilderOptions): DataSourceOptions {
        let dbOptions: DataSourceOptions;

        const uriParts = new URL(databaseUri);
        switch (uriParts.protocol) {
            case 'mysql:':
                dbOptions = { ...options.sharedOptions, ...options.mysql };
                break;

            case 'postgresql:':
                dbOptions = { ...options.sharedOptions, ...options.postgres };
                break;

            default:
                throw new Error(`Unsupported DB protocol '${uriParts.protocol}'`);
        }

        return dbOptions;
    }
}
