import express from "express";
import reviewController from "../controllers/reviews.js";
const router = express.Router();

router.get("/view/:reviewId", reviewController.viewReview);

router.get("/add/:movieId", reviewController.addReviewForm);

router.post("/confirm/:movieId", reviewController.confirmAddReview);

router.get("/delete/:reviewId", reviewController.reviewDeleteForm);

router.post("/confirm-delete/:reviewId", reviewController.confirmDelete);

export default router;
