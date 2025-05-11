import type { Request } from "express";
import { UserRole } from "../../models/User.ts";

export interface AuthenticatedUser {
    id: number;
    login: string;
    role: UserRole;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
} 