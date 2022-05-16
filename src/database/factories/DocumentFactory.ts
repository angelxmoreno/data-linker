import { FactorizedAttrs, Factory, InstanceAttribute } from '@jorgebodega/typeorm-seeding';
import { DocumentEntity } from '@database/entities/DocumentEntity';
import faker from '@faker-js/faker';
import { writeFile, realpath } from 'fs/promises';
import path from 'path';
import download from 'image-downloader';

const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_TEXT = 'text/plain';
const CONTENT_TYPE_IMAGE = 'image/jpeg';

type ContentGenerator = {
    contentType: string;
    fileName: () => string;
    writeContents: (filePath: string) => Promise<void>;
};

const documentContentGenerator: ContentGenerator[] = [
    {
        contentType: CONTENT_TYPE_JSON,
        fileName: () => faker.system.commonFileName('json'),
        writeContents: async filePath => {
            const contents = faker.datatype.json();
            await writeFile(filePath, contents);
        },
    },
    {
        contentType: CONTENT_TYPE_TEXT,
        fileName: () => faker.system.commonFileName('txt'),
        writeContents: async filePath => {
            const numSentences = faker.datatype.number({ max: 5 });
            const contents = faker.lorem.sentences(numSentences);
            await writeFile(filePath, contents);
        },
    },
    {
        contentType: CONTENT_TYPE_IMAGE,
        fileName: () => {
            const ext = faker.helpers.arrayElement(['jpeg', 'jpg']);
            return faker.system.commonFileName(ext);
        },
        writeContents: async filePath => {
            const imageUrl = faker.image.imageUrl(
                faker.datatype.number({ min: 75, max: 750 }),
                faker.datatype.number({ min: 75, max: 750 }),
                undefined,
                true,
            );
            await download.image({
                url: imageUrl,
                dest: filePath,
                extractFilename: false,
            });
        },
    },
];

export default class DocumentFactory extends Factory<DocumentEntity> {
    protected entity = DocumentEntity;
    protected attrs: FactorizedAttrs<DocumentEntity> = {
        classification: () => {
            return [faker.commerce.department(), faker.company.companyName()].join('/');
        },
        filePath: async () => {
            const generator = faker.helpers.arrayElement(documentContentGenerator);
            const fileName = generator.fileName();
            const filePath = (await realpath('./uploads')) + '/' + fileName;
            await generator.writeContents(filePath);
            return filePath;
        },
        contentType: new InstanceAttribute(instance => {
            const ext = path.extname(instance.filePath);
            if (ext === '.json') return CONTENT_TYPE_JSON;
            if (ext === '.txt') return CONTENT_TYPE_TEXT;
            if (ext === '.jpeg' || ext === '.jpg') return CONTENT_TYPE_IMAGE;

            throw new Error(`Unknown extension '${ext}'`);
        }),
        fileName: new InstanceAttribute(instance => {
            return path.parse(instance.filePath).base;
        }),
    };
}
