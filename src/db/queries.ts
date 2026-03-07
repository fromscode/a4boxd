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
    await deleteMovieGenre(undefined, genreId);
    await pool.query("delete from genre where id = $1", [genreId]);
}

async function insertMovie(
    title: string,
    year: number,
    dir: string,
    desc: string,
    genreId1: number,
    genreId2: number,
    genreId3: number,
    added_by: string,
) {
    await pool.query(
        `INSERT INTO movie (title, year, director, description, added_by, added_at) VALUES
        ($1, $2, $3, $4, $5, NOW())`,
        [title, year, dir, desc, added_by],
    );

    const result = await pool.query("select max(id) from movie");
    const movieId = result.rows[0].max;

    let insertQuery = `INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2)`;
    let values = [movieId, genreId1];

    if (genreId2 && genreId3) {
        insertQuery += `, ($1, $3), ($1, $4)`;
        values.push(genreId2, genreId3);
    } else if (genreId2) {
        insertQuery += `, ($1, $3)`;
        values.push(genreId2);
    } else if (genreId3) {
        insertQuery += `, ($1, $3)`;
        values.push(genreId3);
    }

    insertQuery += ";";

    await pool.query(insertQuery, values);
}

async function getMovie(movieId: number) {
    const { rows } = await pool.query("SELECT * FROM movie WHERE id = $1", [
        movieId,
    ]);
    return rows[0];
}

async function getReviews(movieId: number) {
    const { rows } = await pool.query(
        "SELECT * from review WHERE movie_id = $1",
        [movieId],
    );
    return rows;
}

async function getReview(reviewId: number) {
    const { rows } = await pool.query("SELECT * FROM review WHERE id = $1", [
        reviewId,
    ]);
    return rows[0];
}

async function addReview(
    movieId: number,
    rating: string,
    review: number,
    added_by: string,
) {
    await pool.query(
        `INSERT INTO review (movie_id, rating, review, added_by, added_at) VALUES 
        ($1, $2, $3, $4, NOW())`,
        [movieId, rating, review, added_by],
    );
}

async function deleteReview(reviewId: number) {
    await pool.query("DELETE FROM review WHERE id = $1", [reviewId]);
}

async function deleteReviewForMovie(movieId: number) {
    await pool.query("DELETE FROM review WHERE movie_id = $1", [movieId]);
}

async function deleteMovie(movieId: number) {
    await deleteMovieGenre(movieId);
    await deleteReviewForMovie(movieId);
    await pool.query("DELETE FROM movie WHERE id = $1", [movieId]);
}

async function deleteMovieGenre(movieId?: number, genreId?: number) {
    if (movieId === undefined && genreId === undefined) return;
    if (movieId === undefined) {
        await pool.query(
            `
            DELETE FROM movie_genre WHERE genre_id = $1;`,
            [genreId],
        );
        return;
    }

    if (genreId === undefined) {
        await pool.query(
            `
            DELETE FROM movie_genre WHERE movie_id = $1;`,
            [movieId],
        );
        return;
    }

    await pool.query(
        `
        DELETE FROM movie_genre WHERE movie_id = $1 and genre_id = $2`,
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
    getMovie,
    getReviews,
    getReview,
    addReview,
    deleteReview,
    deleteMovie,
};
