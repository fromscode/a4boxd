import express from "express";

import indexRouter from "./routes/index.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

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
