import type { NextFunction, Request, Response } from "express";
import GenreCache from "../cache/GenreCache.js";
import { body, matchedData, validationResult } from "express-validator";
import BadRequest from "../errors/BadRequest.js";
import queries from "../db/queries.js";

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

const validateMovieForm = [
    body("title")
        .escape()
        .notEmpty()
        .isLength({
            max: 200,
        })
        .matches(/^[\w *\-]+$/gmv),
    body("year").escape().notEmpty().isInt({
        min: 1900,
        max: new Date().getFullYear(),
    }),
    body("director")
        .escape()
        .notEmpty()
        .isLength({
            min: 2,
            max: 50,
        })
        .matches(/^[a-zA-Z]+[a-zA-Z. ]*$/gmv),
    body("genre").escape().notEmpty().isInt({
        min: 0,
        max: 2147483647,
    }),
    body("desc").escape(),
    body("added-by").escape(),
];

const confirmAddMovie = [
    ...validateMovieForm,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            BadRequest.errors = result.array();
            next(BadRequest);
            return;
        }

        const sanitized = matchedData(req);
        await queries.insertMovie(
            sanitized.title,
            sanitized.year,
            sanitized.director,
            sanitized.desc,
            sanitized.genre,
            sanitized.added_by || "Anonymous",
        );

        GenreCache.fetchGenres();

        res.redirect("/");
    },
];

export default {
    addMovie,
    confirmAddMovie,
};
