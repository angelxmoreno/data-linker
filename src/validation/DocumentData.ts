import { IsDefined, IsUUID, Validate } from 'class-validator';
import ExistsInTable from '@database/validators/ExistsInTable';
import { UserEntity } from '@database/entities/UserEntity';
import BaseValidation from '@validation/BaseValidation';
import { Request } from 'express';
import { ClassConstructor } from 'class-transformer';
import { DocumentEntity } from '@database/entities/DocumentEntity';

export default class DocumentData extends BaseValidation {
    @IsDefined()
    subjectId: string;

    @IsDefined()
    classification: string;

    @Validate(ExistsInTable, [UserEntity, 'id'])
    @IsUUID(undefined)
    @IsDefined()
    publisherId: string;

    static fromRequest<T extends DocumentData>(this: ClassConstructor<T>, req: Request): T {
        const data: Partial<DocumentData> = {
            ...req.body,
            ...req.body.contents,
            ...req.file,
            publisherId: req.user.id,
        };
        return new this(data);
    }

    toDocumentEntity(): Partial<DocumentEntity> {
        const { subjectId, classification, publisherId } = this;
        return DocumentEntity.build<DocumentEntity>({
            subjectId,
            classification,
            publisherId,
        });
    }
}
