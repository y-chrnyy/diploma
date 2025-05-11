import { Request, Response } from "npm:express";
import type { ErrorResponse } from "../types/response.ts";

export class HttpError extends Error {
    status: number
    statusText: string

    constructor(status: number, statusText: string) {
        super()
        this.status = status
        this.statusText = statusText
    }
}

export const errorMiddleware = (error: HttpError, _req: Request, res: Response, _next: any) => {
    const statusCode = error.status || 500;
    const errorResponse: ErrorResponse = {
        status: 'error',
        message: error.statusText || "Internal Server Error",
        code: statusCode
    };
    
    res.status(statusCode).json(errorResponse);
};