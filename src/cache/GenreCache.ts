import queries from "../db/queries.js";

class GenreCache {
    genres: any[] = [];
    noGenreCount: number = 0;

    async fetchGenres() {
        this.genres = await queries.getAllGenresSortedByMovies();
        this.noGenreCount = (await queries.countMoviesWithNoGenres()).count;
    }

    isEmpty() {
        return this.genres.length == 0;
    }

    async getGenre(genreId: number) {
        if (this.isEmpty()) {
            await this.fetchGenres();
        }
        return this.genres.find((genre) => genre.id === genreId);
    }

    async maxId() {
        if (this.isEmpty()) {
            await this.fetchGenres();
        }
        let max = -1;
        for (const genre of this.genres) {
            max = Math.max(max, genre.id);
        }

        return max;
    }
}

export default new GenreCache();
