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
    order by count desc;
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

export default {
    getAllGenres,
    getAllGenresSortedByMovies,
    getMoviesByGenreId,
};
