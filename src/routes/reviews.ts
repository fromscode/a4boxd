import express from "express";
import reviewController from "../controllers/reviews.js";
const router = express.Router();

router.get("/view/:reviewId", reviewController.viewReview);

router.get("/add/:movieId", reviewController.addReviewForm);

router.post("/confirm/:movieId", reviewController.confirmAddReview);

export default router;
