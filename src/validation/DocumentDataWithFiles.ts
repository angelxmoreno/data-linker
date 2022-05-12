import { IsDefined, IsString } from 'class-validator';
import DocumentData from '@validation/DocumentData';
import { DocumentEntity } from '@database/entities/DocumentEntity';

export default class DocumentDataWithFile extends DocumentData {
    @IsString()
    @IsDefined()
    originalname: string;

    @IsString()
    @IsDefined()
    mimetype: string;

    @IsString()
    @IsDefined()
    destination: string;

    @IsString()
    @IsDefined()
    filename: string;

    @IsString()
    @IsDefined()
    path: string;

    toDocumentEntity(): Partial<DocumentEntity> {
        const entity = super.toDocumentEntity();

        entity.contentType = this.mimetype;
        entity.fileName = this.originalname;
        entity.s3Path = this.path;

        return entity;
    }
}
