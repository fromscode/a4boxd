import type { NextFunction, Request, Response } from "express";
import { validationResult, param, matchedData, body } from "express-validator";
import NotFoundError from "../errors/NotFoundError.js";
import queries from "../db/queries.js";
import BadRequest from "../errors/BadRequest.js";
import MovieCache from "../cache/MovieCache.js";

const validateReviewId = [
    param("reviewId")
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
    ...validateReviewId,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(NotFoundError);
            return;
        }

        const { reviewId } = matchedData(req);

        const review = await queries.getReview(reviewId);
        if (!review) {
            next(NotFoundError);
            return;
        }

        const movieId = review.movie_id;

        await MovieCache.fetchMovieIfDifferent(movieId);

        const renderData = {
            review: review,
            movie: MovieCache.movie,
            genres: MovieCache.genres,
        };

        res.render("viewReview", renderData);
    },
];

const validateParamMovieId = [
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

const addReviewForm = [
    ...validateParamMovieId,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(NotFoundError);
            return;
        }

        const { movieId } = matchedData(req);

        const movie = await queries.getMovie(movieId);

        const renderData = {
            movie: movie,
        };

        res.render("addReview", renderData);
    },
];

const validateFormBody = [
    body("rating")
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

    body("added-by").default("Anonymous"),
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

        const data = matchedData(req);
        try {
            await queries.addReview(
                data.movieId,
                data.rating,
                data.review,
                data["added-by"],
            );
        } catch (err) {
            next(BadRequest);
            return;
        }

        res.redirect("/movies/view/" + data.movieId);
    },
];

const reviewDeleteForm = [
    ...validateReviewId,
    (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(NotFoundError);
            return;
        }

        const { reviewId } = matchedData(req);
        const renderData = {
            reviewId: reviewId,
            msg: "",
        };

        res.render("deleteReview", renderData);
    },
];

const confirmDelete = [
    ...validateReviewId,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(NotFoundError);
            return;
        }

        const { reviewId } = matchedData(req);
        const password = req.body.password;
        if (password === process.env.admin_pass) {
            await queries.deleteReview(reviewId);
            if (!MovieCache.movie) res.redirect("/");
            else res.redirect("/movies/view/" + MovieCache.movie.id);
            return;
        }

        res.render("deleteReview", {
            reviewId: reviewId,
            msg: "Password is incorrect",
        });
    },
];

export default {
    viewReview,
    addReviewForm,
    confirmAddReview,
    reviewDeleteForm,
    confirmDelete,
};
