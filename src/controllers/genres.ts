import type { NextFunction, Request, Response } from "express";
import queries from "../db/queries.js";
import genreCache from "../cache/GenreCache.js";
import { matchedData, param, validationResult } from "express-validator";
import NotFoundError from "../errors/NotFoundError.js";

const validateGetRequest = param("param").custom((value) => {
    if (!value) return false;
    if (value == "add") return true;
    const numericValue = +value;
    if (
        (!numericValue && numericValue != 0) ||
        numericValue < 0 ||
        numericValue > 2147483647
    )
        return false;
    return true;
});

const getGenre = [
    validateGetRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(NotFoundError);
            return;
        }

        console.log(matchedData(req));
        const param = req.params.param as string;
        if (param == "add") {
            showGenreForm(req, res);
            return;
        }

        const genreId = +param;
        const genre = genreCache.getGenre(genreId);

        if (!genre) {
            next(NotFoundError);
            return;
        }

        const movies = await queries.getMoviesByGenreId(genreId);

        if (genreCache.isEmpty()) {
            await genreCache.fetchGenres();
        }
        const renderData = {
            genres: genreCache.genres,
            genre: genre,
            movies: movies,
        };
        res.render("index", renderData);
    },
];

function showGenreForm(req: Request, res: Response) {
    res.render("addGenre");
}

async function addGenre(req: Request, res: Response) {
    const genre = req.body["genre"];
    const addedBy = req.body["added-by"] || "Anonymous";

    await queries.insertGenre(genre, addedBy);
    await genreCache.fetchGenres();
    res.redirect("/");
}

export default {
    getGenre,
    addGenre,
};
