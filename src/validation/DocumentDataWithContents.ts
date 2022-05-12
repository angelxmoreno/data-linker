import { IsDefined, isJSON, IsString } from 'class-validator';
import DocumentData from '@validation/DocumentData';
import { DocumentEntity } from '@database/entities/DocumentEntity';
import * as fs from 'fs';
import generator from 'generate-password';

export default class DocumentDataWithContents extends DocumentData {
    @IsString()
    @IsDefined()
    fileName: string;

    @IsString()
    @IsDefined()
    plainText: string;

    toDocumentEntity(): Partial<DocumentEntity> {
        const isJson = isJSON(this.plainText);

        let uploadsPath = 'uploads/';
        uploadsPath += generator.generate({
            length: 32,
            numbers: false,
            symbols: false,
            lowercase: true,
            uppercase: false,
            excludeSimilarCharacters: true,
        });
        uploadsPath += isJson ? '.json' : '.txt';

        const entity = super.toDocumentEntity();

        entity.contentType = isJson ? 'application/json' : 'text/plain';
        entity.fileName = this.fileName;
        fs.writeFileSync(uploadsPath, this.plainText);
        entity.s3Path = uploadsPath;

        return entity;
    }
}
