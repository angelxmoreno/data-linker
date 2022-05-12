import { HttpException } from './HttpException';
import { ValidationError } from 'class-validator';

type NormalizedError = Record<string, Record<string, string>>;
export class ValidationException extends HttpException {
    validationErrors: ValidationError[];

    constructor(validationErrors: ValidationError[], message?: string) {
        super(400, message || 'Unable to validate entry', 'ValidationError');
        this.validationErrors = validationErrors;
    }

    get normalizedErrors(): NormalizedError {
        const normalized: NormalizedError = {};
        this.validationErrors.forEach(validationError => {
            if (!normalized[validationError.property]) {
                normalized[validationError.property] = {};
            }
            Object.keys(validationError.constraints).forEach(constraint => {
                normalized[validationError.property][constraint] = validationError.constraints[constraint];
            });
        });
        return normalized;
    }

    toJSON() {
        return {
            type: this.name,
            error: this.message,
            errors: this.normalizedErrors,
            trace: this.stack,
        };
    }
}
