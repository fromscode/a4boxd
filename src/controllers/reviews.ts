import type { NextFunction, Request, Response } from "express";
import { validationResult, param, matchedData, body } from "express-validator";
import NotFoundError from "../errors/NotFoundError.js";
import queries from "../db/queries.js";
import BadRequest from "../errors/BadRequest.js";

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

const validateParamMovieId = [
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
    ...validateParamMovieId,
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

const validateFormBody = [
    body("rating")
        .escape()
        .isNumeric()
        .custom((rating) => {
            const num = +rating;
            const validRatings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
            if (!validRatings.includes(num)) return false;
            return true;
        })
        .toFloat(),

    body("review")
        .trim()
        .custom((review, { req }) => {
            if (!review.length && req.body.rating == 0) {
                return false;
            }

            if (review.length && review.length < 3) {
                return false;
            }

            return true;
        }),

    body("added_by").escape(),
];

const confirmAddReview = [
    ...validateParamMovieId,
    ...validateFormBody,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(BadRequest);
            return;
        }

        const { movieId, rating, review, added_by } = matchedData(req);
        try {
            await queries.addReview(
                movieId,
                rating,
                review,
                added_by || "Anonymous",
            );
        } catch (err) {
            next(BadRequest);
            return;
        }

        res.redirect("/movies/" + movieId);
    },
];

export default {
    viewReview,
    addReviewForm,
    confirmAddReview,
};
