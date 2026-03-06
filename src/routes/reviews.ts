import express from "express";
import reviewController from "../controllers/reviews.js";
const router = express.Router();

router.get("/view/:reviewId", reviewController.viewReview);

router.get("/add/:movieId", reviewController.addReviewForm);

export default router;
