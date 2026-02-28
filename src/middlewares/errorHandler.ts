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
    if (!err.status) console.error(err);
    res.status(err.status || 500).render("error", { err: err });
}
