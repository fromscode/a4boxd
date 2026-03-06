import type { NextFunction, Request, Response } from "express";
import GenreCache from "../cache/GenreCache.js";
import { body, matchedData, param, validationResult } from "express-validator";
import BadRequest from "../errors/BadRequest.js";
import queries from "../db/queries.js";
import NotFoundError from "../errors/NotFoundError.js";
import MovieCache from "../cache/MovieCache.js";

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
        .notEmpty()
        .isLength({
            max: 200,
        })
        .matches(/^[\w *\-]+$/gmv),
    body("year").notEmpty().isInt({
        min: 1900,
        max: new Date().getFullYear(),
    }),
    body("director")
        .notEmpty()
        .isLength({
            min: 2,
            max: 50,
        })
        .matches(/^[a-zA-Z]+[a-zA-Z. ]*$/gmv),
    body("genre1")
        .notEmpty()
        .isInt({
            min: 1,
            max: 2147483647,
        })
        .toInt(),
    body("genre2")
        .notEmpty()
        .isInt({
            min: 0,
            max: 2147483647,
        })
        .toInt(),
    body("genre3")
        .notEmpty()
        .isInt({
            min: 0,
            max: 2147483647,
        })
        .toInt(),
    body("desc"),
    body("added-by"),
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
        const maxId = GenreCache.maxId();

        const { genre1, genre2, genre3 } = sanitized;
        if (genre1 > maxId || genre2 > maxId || genre3 > maxId) {
            next(BadRequest);
            return;
        }

        await queries.insertMovie(
            sanitized.title,
            sanitized.year,
            sanitized.director,
            sanitized.desc,
            genre1,
            genre2,
            genre3,
            sanitized.added_by || "Anonymous",
        );

        GenreCache.fetchGenres();

        res.redirect("/");
    },
];

const validateMovieId = [
    param("movieId")
        .notEmpty()
        .isLength({
            max: 10,
        })
        .isInt({
            min: 1,
            max: 2147483647,
        })
        .toInt(),
];

const viewMovie = [
    ...validateMovieId,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(NotFoundError);
            return;
        }

        const { movieId } = matchedData(req);

        if (!MovieCache.movie || MovieCache.movie.id != movieId) {
            const movie = await queries.getMovie(movieId);
            if (!movie) {
                next(NotFoundError);
                return;
            }
            MovieCache.movie = movie;
        }

        const reviews = await queries.getReviews(movieId);

        const renderData = {
            movie: MovieCache.movie,
            reviews: reviews,
        };

        res.render("viewMovie", renderData);
    },
];

export default {
    addMovie,
    confirmAddMovie,
    viewMovie,
};
