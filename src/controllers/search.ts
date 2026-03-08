import type { NextFunction, Request, Response } from "express";
import { body, matchedData, validationResult } from "express-validator";
import queries from "../db/queries.js";

const validateSearch = body("search").notEmpty();

const search = [
    validateSearch,
    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.redirect("/");
            return;
        }

        const { search } = matchedData(req);
        let renderData = await queries.search(search);
        (renderData as any).param = search;

        res.render("searchResult", renderData);
    },
];

export default {
    search,
};
