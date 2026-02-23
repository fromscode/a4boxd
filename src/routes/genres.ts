import express from "express";

import genreRouter from "../controllers/genres.js";

const router = express.Router();

router.get("/:genreId", genreRouter.getGenre);

export default router;
