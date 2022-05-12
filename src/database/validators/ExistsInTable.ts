import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { AppDataSource } from '@database/data-source';

@ValidatorConstraint({ name: 'exists', async: true })
export default class ExistsInTable implements ValidatorConstraintInterface {
    async validate(text: string, args: ValidationArguments) {
        const { constraints, value } = args;
        const [EntityClass, column] = constraints as [EntityTarget<unknown>, string];
        const count = await AppDataSource.getRepository(EntityClass).count({
            where: { [column]: value },
        });
        return count !== 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultMessage(args: ValidationArguments) {
        return '$value does not exist.';
    }
}
