import type { ValidationError } from "express-validator";

class FormError extends Error {
    status = 400;
    errors: ValidationError[] = [];
    constructor() {
        super("Bad Request");
    }
}

export default new FormError();
