import type { NextFunction, Request, Response } from "express";
import queries from "../db/queries.js";

let cachedGenres: any[] = [];

export default async function genreCache(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        if (!cachedGenres.length) {
            cachedGenres = await queries.getAllGenresSortedByMovies();
        }
        res.locals.genres = cachedGenres;
        next();
    } catch (err) {
        next(err);
    }
}
