import express from "express";
const router = express.Router();

import movieController from "../controllers/movies.js";

router.get("/addMovie/", movieController.addMovie);

router.post("/addMovie/confirm", movieController.confirmAddMovie);

router.get("/view/:movieId", movieController.viewMovie);

router.post("/delete/:movieId", movieController.deleteForm);

router.post("/confirm-delete/:movieId", movieController.confirmDelete);

router.get("/edit/:movieId", movieController.viewEditMovieForm);

router.post("/edit/:movieId", movieController.editMovie);

export default router;
