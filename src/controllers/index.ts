import type { Request, Response } from "express";
import queries from "../db/queries.js";
import genreCache from "../cache/GenreCache.js";

async function getHome(req: Request, res: Response) {
    if (genreCache.isEmpty()) {
        await genreCache.fetchGenres();
    }

    const topGenreId = genreCache.genres[0].id;

    const movies = await queries.getMoviesByGenreId(topGenreId);

    const renderData = {
        genres: genreCache.genres,
        genre: genreCache.genres[0],
        movies: movies,
    };

    res.render("index", renderData);
}

export default {
    getHome,
};
