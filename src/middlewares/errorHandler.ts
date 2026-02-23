import type { NextFunction, Request, Response } from "express";

interface HTTPError extends Error {
    status?: number;
}

export default function (
    err: HTTPError,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const status = err.status || 500;
    const message = err.status == 500 ? "Internal Server Error" : err.message;
    res.status(status).send(message);
}
