import express from "express";

import indexRouter from "./routes/index.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import path from "node:path";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "..", "views"));

app.use(indexRouter);

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
