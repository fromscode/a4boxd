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

async function insertMovie(
    title: string,
    year: number,
    dir: string,
    desc: string,
    genreId: number,
    added_by: string,
) {
    await pool.query(
        `INSERT INTO movie (title, year, director, description, added_by, added_at) VALUES
        ($1, $2, $3, $4, $5, NOW())`,
        [title, year, dir, desc, added_by],
    );

    const result = await pool.query("select max(id) from movie");
    const movieId = result.rows[0].max;

    await pool.query(
        `INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2)`,
        [movieId, genreId],
    );
}

export default {
    getAllGenres,
    getAllGenresSortedByMovies,
    getMoviesByGenreId,
    insertGenre,
    deleteGenre,
    insertMovie,
};
