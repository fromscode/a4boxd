import type { Request, Response } from "express";
import queries from "../db/queries.js";

async function getHome(req: Request, res: Response) {
    const genres = await queries.getAllGenresSortedByMovies();
    const topGenreId = genres[0].id;

    const movies = await queries.getMoviesByGenreId(topGenreId);

    const renderData = {
        genres: genres,
        movies: movies,
    };

    res.render("index", renderData);
}

export default {
    getHome,
};
