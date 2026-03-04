import express from "express";
const router = express.Router();

import movieController from "../controllers/movies.js";

router.get("/addMovie/", movieController.addMovie);

router.post("/addMovie/confirm", movieController.confirmAddMovie);

export default router;
