import { NextFunction } from "express";

export type Routehandler = (
    req: Express.Request,
    res: Express.Response,
    next: NextFunction
) => void