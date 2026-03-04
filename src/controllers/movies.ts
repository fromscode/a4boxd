import type { NextFunction, Request, Response } from "express";
import NotFoundError from "../errors/NotFoundError.js";
import GenreCache from "../cache/GenreCache.js";

const addMovie = [
    async (req: Request, res: Response, next: NextFunction) => {
        if (GenreCache.isEmpty()) {
            await GenreCache.fetchGenres();
        }

        const renderData = {
            genres: GenreCache.genres,
        };
        res.render("addMovie", renderData);
    },
];

export default {
    addMovie,
};
