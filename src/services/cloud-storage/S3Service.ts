import AWS, { S3 } from 'aws-sdk';
import appConfig from '../../config';
import { Credentials } from 'aws-sdk/lib/credentials';
import { DocumentEntity } from '@database/entities/DocumentEntity';
import { CloudStorageInterface, GetObjectResult } from '@services/cloud-storage/CloudStorageInterface';
import * as fs from 'fs';
import path from 'path';
import { instanceToPlain } from 'class-transformer';
import { GetObjectOutput } from 'aws-sdk/clients/s3';

export class S3Service implements CloudStorageInterface {
    s3: AWS.S3;
    bucket: string;

    constructor(bucket: string, s3: Credentials | AWS.S3);
    constructor(bucket: string, credentials: Credentials | AWS.S3) {
        this.bucket = bucket;
        const $credentials = credentials as Credentials;
        const $s3 = credentials as AWS.S3;

        if ($credentials.accessKeyId) {
            AWS.config.update({ region: appConfig.aws.region, credentials: $credentials });
            this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
        } else {
            this.s3 = $s3;
        }
    }

    async getDocument(document: DocumentEntity): Promise<GetObjectResult<GetObjectOutput>> {
        const params = {
            Bucket: this.bucket,
            Key: this.s3KeyFromDocument(document),
        };

        const result = this.s3.getObject(params);
        const data = await result.promise();
        const readStream = result.createReadStream();

        return { data, readStream };
    }

    listFolders(): string[] {
        return [];
    }

    s3KeyFromDocument(document: DocumentEntity): string {
        const classification = document.classification.replace(/^[^a-z0-9]/i, '').replace(/[^a-z0-9]$/i, '');
        return [document.subjectId, classification, document.publisherId, path.basename(document.fileName)].join('/');
    }

    async uploadDocument(document: DocumentEntity): Promise<unknown> {
        const uploadParams: S3.Types.PutObjectRequest = {
            Bucket: this.bucket,
            Key: this.s3KeyFromDocument(document),
            ContentType: document.contentType,
            Metadata: instanceToPlain(document),
            Body: null,
        };
        const fileStream = fs.createReadStream(document.filePath);
        fileStream.on('error', function (err) {
            console.log('File Error', err);
            throw err;
        });

        uploadParams.Body = fileStream;

        const { Key } = await this.s3.upload(uploadParams).promise();
        document.s3Path = `${this.bucket}:${Key}`;
        return document;
    }
}

const credentials = new AWS.Credentials({
    accessKeyId: appConfig.aws.accessKeyId,
    secretAccessKey: appConfig.aws.secretAccessKey,
});

const s3Service = new S3Service(appConfig.aws.bucket, credentials);
export default s3Service;
