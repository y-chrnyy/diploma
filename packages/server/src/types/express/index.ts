import { UserRole } from "../../models/User";

export interface AuthenticatedUser {
    id: number;
    login: string;
    role: UserRole;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
} 