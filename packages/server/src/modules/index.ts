import { Database } from "../models/index.ts";
import { AuthService } from "./auth.service.ts";

export const authService = new AuthService(Database)