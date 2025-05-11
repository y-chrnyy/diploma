import { RequestHandler } from "express";
import { HttpError } from "./errorMiddleware.ts";
import { UserRole } from "../models/User.ts";
import { UserType } from "../types/index.ts";
export const AdminOnlyMiddleware: RequestHandler = (req, res, next) => {
    if ((req as unknown as Request & { user?: UserType }).user?.role !== UserRole.ADMIN) {
        throw new HttpError(403, 'Access denied. Admin only.');
    }
    next();
}; 