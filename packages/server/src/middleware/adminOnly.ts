import { RequestHandler } from "npm:express";
import { HttpError } from "./errorMiddleware.ts";
import { UserRole } from "../models/User.ts";

export const AdminOnlyMiddleware: RequestHandler = (req, res, next) => {
    if (req.user?.role !== UserRole.ADMIN) {
        throw new HttpError(403, 'Access denied. Admin only.');
    }
    next();
}; 