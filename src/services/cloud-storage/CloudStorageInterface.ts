import { DocumentEntity } from '@database/entities/DocumentEntity';
import ReadableStream = NodeJS.ReadableStream;

export type GetObjectResult<T> = { data: T; readStream: ReadableStream };
export interface CloudStorageInterface {
    listFolders: () => string[];
    uploadDocument: (document: DocumentEntity) => void;
    getDocument: (document: DocumentEntity) => Promise<GetObjectResult<unknown>>;
}
