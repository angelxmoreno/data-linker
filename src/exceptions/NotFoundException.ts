import { HttpException } from '@exceptions/HttpException';

export class NotFoundException extends HttpException {
    constructor(entityName = 'Route') {
        super(404, `${entityName} Not Found`, 'NotFoundException');
    }
}
