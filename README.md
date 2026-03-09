# a4boxd

A small movie management app. Check it out live -> [Click Here](https://a4boxd.onrender.com/)

## This app allows users to 

- Create a movie entry
- Edit a movie entry
- Rate and review the movies
- Delete a movie entry (Requires knowing the password)
- Delete a genre (Requires knowing the password)
- Delete a review (requires knowing the password)

## Current db design:

1. Movie (id, title, year, director, description)
2. Genre (id, genre)
3. Movie-Genre (id, movie_id, genre_id)
4. Reviews (id, rating, review, movie_id)

### Additional fields:

- Movie table also has fields: added_by, added_at, updated_by, updated_at
- Genre table has fields: added_by
- Review table has fields: added_by, added_at

### Relationships: 
- Movies and Genres have a **many to many** relationship whereby one movie can fall under multiple genres and one genre can have multiple movies
- Movies and Reviews have a **one to many** relationship, whereby one movie can have multiple reviews but one review belongs to only one movie


## Some considerations:

- There is no auth (hence requiring passwords for deletion)
- Movies, Genres and Reviews can be added by anybody
- Movies can be updated/edited by anybody
- Movies, Genres and Reviews can only be deleted if the user knows the password (Which allows me to delete them if I want to)
- Genres cannot be edited (I cannot think of any possible reason why one would want to edit a genre, if you want to classify / de-classify movies then you edit those movies instead)
- Reviews can only be added and not updated. (This is perhaps the biggest bottleneck of not having an auth system. Allowing updation of reviews will allow one user to edit reviews of another user which is wrong)


### Some final thoughts:

- This is a toy project, made with the aim to learn about express backends, views, server side validation, using caches for optimization, and other beginner backend topics.