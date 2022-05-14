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
import inflection from 'inflection';

export type SimpleWhere<T> = Partial<Record<keyof T, PropertyKey>>;

export type PaginatedItems<T> = {
    pagination: {
        limit: number;
        totalItems: number;
        page: number;
        totalPages: number;
    };
    items: T[];
};

type ApplyPaginationParams<T> = {
    limit: number;
    count: number;
    page: number;
    items: T[];
};

export const applyPagination = <T>({ limit, count, page, items }: ApplyPaginationParams<T>): PaginatedItems<T> => {
    return {
        pagination: {
            limit,
            totalItems: count,
            page,
            totalPages: Math.ceil(count / limit),
        },
        items,
    };
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

        return applyPagination<T>({
            limit,
            count,
            page,
            items,
        });
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

    static async getDistinctFieldCount<T>(field: keyof T, where: SimpleWhere<T> = {}): Promise<number> {
        const $field = inflection.underscore(field);

        const { count } = await this.createQueryBuilder()
            .select('COUNT(DISTINCT(`' + $field + '`))', 'count')
            .where(where)
            .getRawOne();

        return count;
    }

    static getDistinctField<T>(field: keyof T, page = 1, limit = 100, where: SimpleWhere<T> = {}) {
        const $field = inflection.underscore(field);
        return this.createQueryBuilder()
            .select('DISTINCT(' + $field + ')', $field)
            .addSelect('COUNT(*)', 'count')
            .where(where)
            .groupBy($field)
            .limit(limit)
            .offset((page - 1) * limit)
            .getRawMany();
    }

    static async getPaginatedDistinctField<T>(
        field: keyof T,
        page = 1,
        limit = 100,
        where: SimpleWhere<T> = {},
    ): Promise<PaginatedItems<T>> {
        const count = await this.getDistinctFieldCount(field, where);
        const items = await this.getDistinctField(field, page, limit, where);

        return applyPagination<T>({
            limit,
            count,
            page,
            items,
        });
    }
}
