import { HttpException } from '@exceptions/HttpException';

export class ForbiddenException extends HttpException {
    constructor(message = 'You do not have access to this route') {
        super(403, message, 'ForbiddenException');
    }
}
