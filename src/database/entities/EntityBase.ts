import {
    BaseEntity,
    CreateDateColumn,
    DeepPartial,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export type PaginatedItems<T> = {
    pagination: {
        limit: number;
        totalItems: number;
        page: number;
        totalPages: number;
    };
    items: T[];
};

export class EntityBase extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @VersionColumn()
    @Exclude()
    ver: number;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @DeleteDateColumn()
    @Exclude()
    deleted: Date;

    static build<T extends BaseEntity>(data: Partial<T>): Partial<T> {
        const entity = this.create();
        return Object.assign(entity, data);
    }

    static async findLastModified<T extends EntityBase>(
        this: {
            new (): T;
        } & typeof EntityBase,
        where: FindOptionsWhere<T> = {},
    ): Promise<T> {
        const entity = await this.findOne({
            order: { updated: 'DESC' },
            where,
        });

        return !!entity ? (entity as T) : null;
    }

    static async findPaginated<T>(page = 1, options: FindManyOptions<T> = {}): Promise<PaginatedItems<T>> {
        const { take } = options;
        const limit = take || 20;
        const skip = (page - 1) * limit;

        const findOptions: FindManyOptions = {
            ...options,
            take: limit,
            skip,
        };

        const [items, count] = await this.findAndCount(findOptions);

        return {
            pagination: {
                limit,
                totalItems: count,
                page,
                totalPages: Math.ceil(count / limit),
            },
            items,
        };
    }

    static async upsertMany<T>(entityLike: DeepPartial<T>[], keys: (keyof T)[]): Promise<T[]> {
        const keyAsArray = keys as string[];
        const partials = entityLike as QueryDeepPartialEntity<T>[];
        await this.upsert(partials, keyAsArray);

        const where: FindOptionsWhere<T>[] = partials.map(partial => {
            const lookUp: Partial<Record<keyof T, unknown>> = {};
            keys.forEach(key => {
                lookUp[key as keyof T] = partial[key as keyof DeepPartial<T>];
            });

            return lookUp as FindOptionsWhere<T>;
        });

        return (await this.find({ where })) as unknown as T[];
    }
}
