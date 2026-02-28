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
    const message = status == 500 ? "Internal Server Error" : err.message;
    const renderData = {
        status: status,
        message: message,
    };
    if (status != 404) console.error(err);
    res.status(status).render("error", { err: renderData });
}
