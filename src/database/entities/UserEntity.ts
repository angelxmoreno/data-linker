import { Column, Entity, Index } from 'typeorm';
import { EntityBase } from '@database/entities/EntityBase';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import IsUniqueInTable from '@database/validators/IsUniqueInTable';

export enum UserRole {
    CONSUMER = 'consumer',
    PUBLISHER = 'publisher',
    GUEST = 'guest',
}

@Entity()
export class UserEntity extends EntityBase {
    @Column({ length: 100 })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    name: string;

    @Column({
        nullable: true,
        type: 'enum',
        enum: UserRole,
        default: null,
    })
    role: UserRole;

    @Column({ type: 'char', length: 64, nullable: true, default: null })
    @Index({ unique: true })
    @Validate(IsUniqueInTable, [UserEntity, 'apiKey'])
    apiKey?: string;
}
