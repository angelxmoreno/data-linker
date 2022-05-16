import { Seeder } from '@jorgebodega/typeorm-seeding';
import UserFactory from '@database/factories/UserFactory';
import faker from '@faker-js/faker';
import DocumentFactory from '@database/factories/DocumentFactory';
import s3Service from '@services/cloud-storage/S3Service';

export class RootSeeder extends Seeder {
    async run() {
        const subjectId = faker.datatype.uuid();
        const users = await new UserFactory().createMany(10);
        const promises = users.map(async user => {
            const documents = await new DocumentFactory().makeMany(10, {
                subjectId,
                publisherId: user.id,
            });

            return documents.map(async document => {
                await s3Service.uploadDocument(document);
                return document.save();
            });
        });

        await Promise.all(promises);
    }
}
