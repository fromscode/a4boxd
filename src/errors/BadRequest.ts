import type { ValidationError } from "express-validator";

class BadRequest extends Error {
    status = 400;
    errors: ValidationError[] = [];
    constructor() {
        super("Bad Request");
    }
}

export default new BadRequest();
