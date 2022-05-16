import { FactorizedAttrs, Factory } from '@jorgebodega/typeorm-seeding';
import { UserEntity, UserRole } from '@database/entities/UserEntity';
import faker from '@faker-js/faker';

export default class UserFactory extends Factory<UserEntity> {
    protected entity = UserEntity;
    protected attrs: FactorizedAttrs<UserEntity> = {
        name: faker.company.companyName,
        role: UserRole.PUBLISHER,
    };
}
