import type { Request, Response } from "express";
import queries from "../db/queries.js";

async function getHome(req: Request, res: Response) {
    const topGenreId = res.locals.genres[0].id;

    const movies = await queries.getMoviesByGenreId(topGenreId);

    const renderData = {
        genre: res.locals.genres[0],
        movies: movies,
    };

    res.render("index", renderData);
}

export default {
    getHome,
};
