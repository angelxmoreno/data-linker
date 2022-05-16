import { Seeder } from '@jorgebodega/typeorm-seeding';
import UserFactory from '@database/factories/UserFactory';

export class UserSeeder extends Seeder {
    async run() {
        await new UserFactory().createMany(10);
    }
}
