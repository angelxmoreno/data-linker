import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import pluralize from 'pluralize';
import { Table } from 'typeorm';
import { snakeCase } from 'lodash';

export default class CakePhpNamingStrategy extends SnakeNamingStrategy {
    tableName(className: string, customName: string): string {
        return customName || pluralize(snakeCase(className.replace('Entity', '')));
    }

    indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const replacedTableName = tableName.replace('.', '_');
        let key = `${replacedTableName.substring(0, 10)}_${clonedColumnNames.join('_').substring(0, 10)}`;
        if (where) key += `_${where}`;

        return key.substring(0, 20);
    }
}
