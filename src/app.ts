import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello world");
});

const PORT = process.env.port || 3000;

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server up and running at port ${PORT}`);
    }
});
