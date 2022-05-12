import { validateOrReject } from 'class-validator';

export default abstract class BaseValidation {
    public constructor(data: unknown) {
        Object.assign(this, data);
    }

    validateOrReject(): Promise<void> {
        return validateOrReject(this);
    }
}
