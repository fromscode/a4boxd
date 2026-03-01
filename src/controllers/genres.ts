import type { NextFunction, Request, Response } from "express";
import queries from "../db/queries.js";
import genreCache from "../cache/GenreCache.js";
import { body, matchedData, param, validationResult } from "express-validator";
import NotFoundError from "../errors/NotFoundError.js";
import FormError from "../errors/FormError.js";

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
        console.log("called");
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

const validateForm = [
    body("genre")
        .escape()
        .notEmpty()
        .withMessage("Genre cannot be empty")
        .matches(/^[0-9a-zA-Z]+([\-_]?[0-9a-zA-Z]+)*$/mv)
        .withMessage(
            `Genre cannot contain any special characters except - and _.
    Genre cannot start or end with - or _`,
        )
        .isLength({ max: 20 })
        .withMessage("Genre must be less than 20 characters"),

    body("added-by")
        .escape()
        .isLength({ max: 30 })
        .withMessage("Username must be less than 30 characters"),
];

const addGenre = [
    ...validateForm,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            FormError.errors = result.array();
            next(FormError);
            return;
        }
        const body = matchedData(req);
        const genre = body["genre"];
        const addedBy = body["added-by"] || "Anonymous";

        await queries.insertGenre(genre, addedBy);
        await genreCache.fetchGenres();
        res.redirect("/");
    },
];

const confirmDelete = [
    async (req: Request, res: Response, next: NextFunction) => {
        const genreId = +(req.params.genreId as string);
        await queries.deleteGenre(genreId);
        genreCache.fetchGenres();
        res.redirect("/");
    },
];

export default {
    getGenre,
    addGenre,
    confirmDelete,
};
