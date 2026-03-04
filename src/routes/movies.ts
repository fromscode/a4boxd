import express from "express";
const router = express.Router();

import movieController from "../controllers/movies.js";

router.get("/addMovie/", movieController.addMovie);

export default router;
