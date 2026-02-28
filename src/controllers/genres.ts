import type { Request, Response } from "express";
import queries from "../db/queries.js";
import genreCache from "../cache/GenreCache.js";

async function getGenre(req: Request, res: Response) {
    const param = req.params.param as string;
    if (param == "add") {
        showGenreForm(req, res);
        return;
    }

    const genreId = +param;

    const movies = await queries.getMoviesByGenreId(genreId);

    if (genreCache.isEmpty()) {
        await genreCache.fetchGenres();
    }

    const genre = genreCache.getGenre(genreId);
    const renderData = {
        genres: genreCache.genres,
        genre: genre,
        movies: movies,
    };
    res.render("index", renderData);
}

function showGenreForm(req: Request, res: Response) {
    res.render("addGenre");
}

async function addGenre(req: Request, res: Response) {
    const genre = req.body["genre"];
    const addedBy = req.body["added-by"] || "Anonymous";

    await queries.insertGenre(genre, addedBy);
    await genreCache.fetchGenres();
    res.redirect("/");
}

export default {
    getGenre,
    addGenre,
};
