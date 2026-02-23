import type { NextFunction, Request, Response } from "express";

class NotFoundError extends Error {
    status = 404;
    constructor(msg: string) {
        super(msg);
    }
}

export default function (req: Request, res: Response, next: NextFunction) {
    next(
        new NotFoundError(
            "The resource that you are looking for is unavailable",
        ),
    );
}
