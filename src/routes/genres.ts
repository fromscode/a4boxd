import express from "express";

import genreRouter from "../controllers/genres.js";

const router = express.Router();

router.get("/:param", genreRouter.getGenre);

router.post("/add", genreRouter.addGenre);

router.post("/confirm-delete/:genreId", genreRouter.confirmDelete);

export default router;
