import { RequestHandler } from "express";

export const jsonOnlyMiddleware: RequestHandler = (req, res, next) => {
    const contentType = req.headers['content-type']

    if (contentType !== 'application/json') {
        res.status(400).send('Thiw route handle json request only')
        return
    }

    next()
}