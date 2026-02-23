import express from "express";

import indexController from "../controllers/index.js";
const app = express.Router();

app.get("/", indexController.getHome);

export default app;
