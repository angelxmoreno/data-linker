export class HttpException extends Error {
    public status: number;
    public message: string;
    constructor(status: number, message: string, type: string) {
        super(message);
        this.status = status;
        this.message = message;
        this.name = type;
    }

    toJSON() {
        return {
            type: this.name,
            error: this.message,
        };
    }
}
