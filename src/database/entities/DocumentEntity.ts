import { Column, Entity, Index } from 'typeorm';
import { EntityBase } from '@database/entities/EntityBase';
import { IsDefined, Validate } from 'class-validator';
import ExistsInTable from '@database/validators/ExistsInTable';
import { UserEntity } from '@database/entities/UserEntity';

@Entity()
export class DocumentEntity extends EntityBase {
    @Column({
        type: 'varchar',
        length: 64,
        nullable: false,
        default: undefined,
    })
    @Index({ unique: false })
    @IsDefined()
    subjectId: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,
        default: undefined,
    })
    @Index({ unique: false })
    @IsDefined()
    classification: string;

    @Column({
        type: 'char',
        length: 36,
        nullable: false,
        default: undefined,
    })
    @Index({ unique: false })
    @Validate(ExistsInTable, [UserEntity, 'id'])
    @IsDefined()
    publisherId: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,
        default: undefined,
    })
    @Index({ unique: false })
    contentType: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 200,
        default: undefined,
    })
    fileName: string;

    @Column({
        type: 'text',
        nullable: false,
        default: undefined,
    })
    filePath: string;

    @Column({
        type: 'text',
        nullable: false,
        default: undefined,
    })
    s3Path: string;
}
