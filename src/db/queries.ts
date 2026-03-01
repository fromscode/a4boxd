import pool from "./pool.js";

async function getAllGenres() {
    const { rows } = await pool.query("SELECT * FROM genre;");
    return rows;
}

async function getAllGenresSortedByMovies() {
    const query = `
    select genre.*, count(movie_genre.genre_id)
    from genre left join movie_genre on genre.id = movie_genre.genre_id
    group by genre.id
    order by count desc, id;
    `;

    const { rows } = await pool.query(query);
    return rows;
}

async function getMoviesByGenreId(genreId: number) {
    const query = `
    select movie.*                             
    from movie inner join movie_genre on movie.id = movie_genre.movie_id
    where movie_genre.genre_id = $1;
    `;

    const { rows } = await pool.query(query, [genreId]);
    return rows;
}

async function insertGenre(genre: string, addedBy: string) {
    await pool.query("insert into genre (genre, added_by) values ($1, $2)", [
        genre,
        addedBy,
    ]);
}

async function deleteGenre(genreId: number) {
    await pool.query("delete from genre where id = $1", [genreId]);
}

export default {
    getAllGenres,
    getAllGenresSortedByMovies,
    getMoviesByGenreId,
    insertGenre,
    deleteGenre,
};
