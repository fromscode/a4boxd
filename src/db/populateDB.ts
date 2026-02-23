import { Client } from "pg";

const createQueries = `
CREATE TABLE IF NOT EXISTS movie (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(200),
    year INTEGER,
    director VARCHAR(50),
    description TEXT,
    added_by VARCHAR(50),
    added_at TIMESTAMPTZ,
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS genre (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre VARCHAR(50),
    added_by VARCHAR(50) DEFAULT 'fromscode'
);

CREATE TABLE IF NOT EXISTS movie_genre (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_id INTEGER REFERENCES movie(id),
    genre_id INTEGER REFERENCES genre(id)
);

CREATE TABLE IF NOT EXISTS review (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_id INTEGER REFERENCES movie(id),
    rating REAL,
    review TEXT,
    added_by VARCHAR(50),
    added_at TIMESTAMPTZ
);
`;

const insertMovies = `
INSERT INTO movie (title, year, director, description, added_by, added_at) VALUES
('There Will Be Blood', 2007, 'Paul Thomas Anderson', 
'Ruthless silver miner, turned oil prospector, Daniel Plainview, 
moves to oil-rich California. Using his son to project a trustworthy, 
family-man image, Plainview cons local landowners into selling him their 
valuable properties for a pittance. However, local preacher Eli Sunday suspects 
Plainview''s motives and intentions, starting a slow-burning feud that threatens both their lives.',
'fromscode', NOW()),

('Harakiri', 1962, 'Masaki Kobayashi', 
'Down-on-his-luck veteran Tsugumo Hanshirō enters the courtyard of the prosperous House of Iyi. 
Unemployed, and with no family, he hopes to find a place to commit seppuku—and a worthy second to deliver the coup de grâce in his suicide ritual. 
The senior counselor for the Iyi clan questions the ronin''s resolve and integrity, suspecting Hanshirō of seeking charity rather than an honorable end. 
What follows is a pair of interlocking stories which lay bare the difference between honor and respect, 
and promises to examine the legendary foundations of the Samurai code.',
'fromscode', NOW()),

('Taxi Driver', 1976, 'Martin Scorsese', 
'Suffering from insomnia, disturbed loner Travis Bickle takes a job as a New York City cabbie, haunting the streets nightly, 
growing increasingly detached from reality as he dreams of cleaning up the filthy city.',
'fromscode', NOW()),

('GoodFellas', 1990, 'Martin Scorsese', 
'The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age 
and climbs the ranks of a Mafia family under the guidance of Jimmy Conway.',
'fromscode', NOW()),

('Fight Club', 1999, 'David Fincher', 
'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. 
Their concept catches on, with underground “fight clubs” forming in every town, 
until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
'fromscode', NOW());
`;

const insertGenres = `
INSERT INTO genre (genre) VALUES 
('Action'), ('Adventure'), ('Animation'), ('Biography'), ('Comedy'), ('Crime'), ('Documentary'), ('Drama'), ('Family'), ('Fantasy'),
('History'), ('Horror'), ('Music'), ('Musical'), ('Romance'), ('Sci-Fi'), ('Thriller'), ('War'), ('Western');
`;

const insertMovieGenres = `
INSERT INTO movie_genre (movie_id, genre_id) VALUES 
(1, 8), (2, 1), (2, 8), (2, 11), (3, 6), (3, 8), (4, 6), (4, 8), (5, 8), (5, 17);
`;

const insertReviews = `
INSERT INTO review (movie_id, rating, review, added_by, added_at) VALUES 
(1, 5, 'I just witnessed a god tonight and his name was Daniel Day Lewis', 'fromscode', NOW()),
(2, 5, 'Cinema really peaked in 1962 and nothing since then has come close', 'fromscode', NOW()),
(3, 4.5, 'The real American Psycho', 'fromscode', NOW()),
(4, 5, null, 'fromscode', NOW()),
(5, 4.5, 'Tyler wears the coolest jackets in existence', 'fromscode', NOW())
`;

const db_uri = process.argv[2];

async function main() {
    const client = new Client({
        connectionString: db_uri,
    });
    console.log("----------- BEGINNING POPULATING PROCESS -----------");
    try {
        await client.connect();
        await client.query(createQueries);
        console.log("Tables created");
        await client.query(insertMovies);
        console.log("Movies inserted");
        await client.query(insertGenres);
        console.log("Genres inserted");
        await client.query(insertMovieGenres);
        console.log("Movies-Genres inserted");
        await client.query(insertReviews);
        console.log("Reviews inserted");
        console.log();
        console.log("----------- ALL QUERIES EXECUTED SUCCESFULLY -----------");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
