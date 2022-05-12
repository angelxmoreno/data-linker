import { HttpException } from './HttpException';

export class MissingSubjectData extends HttpException {
    constructor() {
        super(400, 'Subject must have content of type text or a file', 'MissingSubjectData');
    }
}
