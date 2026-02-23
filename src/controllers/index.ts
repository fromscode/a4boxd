import type { Request, Response } from "express";

function getHome(req: Request, res: Response) {
    res.send("Hello world");
}

export default {
    getHome,
};
