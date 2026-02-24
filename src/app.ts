import express from "express";

import indexRouter from "./routes/index.js";
import genreRouter from "./routes/genres.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import path from "node:path";
import genreCache from "./middlewares/cachedGenres.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "..", "views"));

app.use(express.static(path.join(import.meta.dirname, "..", "public")));

app.use(genreCache);
app.use(indexRouter);
app.use("/genres", genreRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.port || 3000;

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server up and running at port ${PORT}`);
    }
});
