import type { Request, Response } from "express";
import queries from "../db/queries.js";

async function getGenre(req: Request, res: Response) {
    const genreId = +(req.params.genreId as string);
    console.log(genreId);

    const movies = await queries.getMoviesByGenreId(genreId);
    const genre = res.locals.genres.find((genre: any) => genre.id === genreId);
    const renderData = {
        genre: genre,
        movies: movies,
    };
    console.log(res.locals.genres);
    console.log(genre);
    res.render("index", renderData);
}

export default {
    getGenre,
};
