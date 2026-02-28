import type { NextFunction, Request, Response } from "express";
import NotFoundError from "../errors/NotFoundError.js";

export default function (req: Request, res: Response, next: NextFunction) {
    next(NotFoundError);
}
