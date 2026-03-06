import express from "express";
import reviewController from "../controllers/reviews.js";
const router = express.Router();

router.get("/:reviewId", reviewController.viewReview);

export default router;
