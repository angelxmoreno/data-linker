import { FactorizedAttrs, Factory } from '@jorgebodega/typeorm-seeding';
import { DocumentEntity } from '@database/entities/DocumentEntity';
import faker from '@faker-js/faker';

export default class DocumentFactory extends Factory<DocumentEntity> {
    protected entity = DocumentEntity;
    protected attrs: FactorizedAttrs<DocumentEntity> = {
        classification: () => {
            return [faker.commerce.department(), faker.company.companyName()].join('/');
        },
    };
}
