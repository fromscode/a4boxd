import type { NextFunction, Request, Response } from "express";
import { validationResult, param, matchedData } from "express-validator";
import NotFoundError from "../errors/NotFoundError.js";
import queries from "../db/queries.js";

const validateViewRequest = [
    param("reviewId")
        .escape()
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

const viewReview = [
    ...validateViewRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(NotFoundError);
            return;
        }

        const { reviewId } = matchedData(req);
        console.log(reviewId);

        const review = await queries.getReview(reviewId);
        const movieId = review.movie_id;
        const movie = await queries.getMovie(movieId);

        const renderData = {
            review: review,
            movie: movie,
        };

        res.render("viewReview", renderData);
    },
];

const validateViewFormRequest = [
    param("movieId")
        .escape()
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

const addReviewForm = [
    ...validateViewFormRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(NotFoundError);
            return;
        }

        const { movieId } = matchedData(req);
        console.log(movieId);

        const movie = await queries.getMovie(movieId);

        const renderData = {
            movie: movie,
        };

        res.render("addReview", renderData);
    },
];

export default {
    viewReview,
    addReviewForm,
};
