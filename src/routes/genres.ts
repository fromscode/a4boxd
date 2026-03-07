import express from "express";

import genreRouter from "../controllers/genres.js";

const router = express.Router();

router.get("/view/:genreId", genreRouter.getGenre);

router.get("/add", genreRouter.showGenreForm);

router.post("/add", genreRouter.addGenre);

router.get("/delete/:genreId", genreRouter.deleteGenre);

router.post("/delete/:genreId", genreRouter.confirmDelete);

export default router;
