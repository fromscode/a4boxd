### This app allows users to:

- Create a movie entry
- Update a movie entry
- Rate and review the movies
- Categorize the movie into existing genres
- Add / Remove genres from a movie (Removing genre requires knowing the password)
- Delete a movie entry (Requires knowing the password)
- Delete a genre (Requires knowing the password)

### Currently proposed db design:

1. Movie (id, title, year, director, description)
2. Genre (id, genre)
3. Movie-Genre (id, movie_id, genre_id)
4. Reviews (id, rating, review, movie_id)

- Movie and Genre tables will also have fields: added_by, add_timestamp, updated_by, updated_timestamp
- Review table will also have fields: added_by, add_timestamp
- Movies and Genres have a many to many relationship whereby one movie can fall under multiple genres and one genre can have multiple movies

### Some considerations:

- Movies and genres can be added by anybody (I think this is alright)
- They can only be deleted if the user knows the password (Which allows me to delete them if I want to)
- Reviews can only be added and not updated as giving the option to update reviews might allow one user to update another user's reviews since there is currently no authentication