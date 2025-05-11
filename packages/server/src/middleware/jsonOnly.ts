import type { RequestHandler } from "express";

export const jsonOnlyMiddleware: RequestHandler = (req, res, next) => {
    const contentType = req.headers['content-type'];

    if (contentType !== 'application/json') {
        res.status(400).send('This route handles JSON requests only');
        return;
    }

    next();
}