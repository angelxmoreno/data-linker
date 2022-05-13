import { DocumentEntity } from '@database/entities/DocumentEntity';

export interface CloudStorageInterface {
    listFolders: () => string[];
    uploadDocument: (document: DocumentEntity) => void;
    downloadDocument: () => DocumentEntity;
}
