import express from "express";

import genreRouter from "../controllers/genres.js";

const router = express.Router();

router.get("/:param", genreRouter.getGenre);

router.post("/add", genreRouter.addGenre);

export default router;
