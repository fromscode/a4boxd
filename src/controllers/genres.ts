import type { Request, Response } from "express";
import queries from "../db/queries.js";

async function getGenre(req: Request, res: Response) {
    const genreId = +(req.params.genreId as string);

    const movies = await queries.getMoviesByGenreId(genreId);
    const genre = res.locals.genres.find((genre: any) => genre.id === genreId);
    const renderData = {
        genre: genre,
        movies: movies,
    };
    res.render("index", renderData);
}

export default {
    getGenre,
};
