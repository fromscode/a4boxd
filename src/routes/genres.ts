import express from "express";

import genreRouter from "../controllers/genres.js";

const router = express.Router();

router.get("/:param", genreRouter.getGenre);

router.post("/add", genreRouter.addGenre);

router.post("/confirm-delete/:genreId", genreRouter.confirmDelete);

router.post("/delete/:genreId", genreRouter.deleteGenre);

export default router;
