import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { AppDataSource } from '@database/data-source';
import { EntityTarget } from 'typeorm/common/EntityTarget';

@ValidatorConstraint({ name: 'uniqueInTable', async: true })
export default class IsUniqueInTable implements ValidatorConstraintInterface {
    async validate(text: string | undefined, args: ValidationArguments) {
        if (!text) return true;
        const { constraints, value } = args;
        const [EntityClass, column] = constraints as [EntityTarget<unknown>, string];
        const count = await AppDataSource.getRepository(EntityClass).count({
            where: { [column]: value },
        });

        return count === 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultMessage(args: ValidationArguments) {
        return '$value is already in use.';
    }
}
