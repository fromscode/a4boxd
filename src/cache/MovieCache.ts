import queries from "../db/queries.js";

class MovieCache {
    movie: any = null;
    genres: any[] = [];

    async fetchMovie(movieId: number) {
        const rows = await queries.getMovieAndGenresByMovieId(movieId);
        const {
            id,
            title,
            year,
            director,
            description,
            added_by,
            added_at,
            updated_by,
            updated_at,
        } = rows[0];

        this.movie = {
            id: id,
            title: title,
            year: year,
            director: director,
            description: description,
            added_by: added_by,
            added_at: added_at,
            updated_by: updated_by,
            updated_at: updated_at,
        };

        this.genres = [];

        for (const { gid, genre } of rows) {
            if (!gid) continue;
            this.genres.push({ id: gid, genre });
        }
    }

    async fetchMovieIfDifferent(movieId: number) {
        if (this.movie && this.movie.id === movieId) return;
        await this.fetchMovie(movieId);
    }

    isEmpty() {
        return this.movie == null;
    }
}

export default new MovieCache();
