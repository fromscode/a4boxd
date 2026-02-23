import type { Request, Response } from "express";
import queries from "../db/queries.js";

async function getHome(req: Request, res: Response) {
    const genres = await queries.getAllGenresSortedByMovies();
    const renderData = {
        genres: genres,
    };

    res.render("index", renderData);
}

export default {
    getHome,
};
