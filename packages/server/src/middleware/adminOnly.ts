import { RequestHandler } from "express";
import { HttpError } from "./errorMiddleware";
import { UserRole } from "../models/User";
import { UserType } from "../types/index";
export const AdminOnlyMiddleware: RequestHandler = (req, res, next) => {
    if ((req as unknown as Request & { user?: UserType }).user?.role !== UserRole.ADMIN) {
        throw new HttpError(403, 'Access denied. Admin only.');
    }
    next();
}; 