import type { Request, Response } from "express";
import queries from "../db/queries.js";

async function getGenre(req: Request, res: Response) {
    const param = req.params.param as string;
    if (param == "add") {
        showGenreForm(req, res);
        return;
    }

    const genreId = +param;

    const movies = await queries.getMoviesByGenreId(genreId);
    const genre = res.locals.genres.find((genre: any) => genre.id === genreId);
    const renderData = {
        genre: genre,
        movies: movies,
    };
    res.render("index", renderData);
}

function showGenreForm(req: Request, res: Response) {
    res.render("addGenre");
}

function addGenre(req: Request, res: Response) {
    console.log(req.body);
    res.render("addGenre");
}

export default {
    getGenre,
    addGenre,
};
