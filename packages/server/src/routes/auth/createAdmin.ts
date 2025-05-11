import type { RequestHandler } from "express";
import { Database } from "../../models/index.ts";
import { User, UserRole } from "../../models/User.ts";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import { authService } from "../../modules/index.ts";
import { applyTokenToResponse } from "./applyTokenToResponse.ts";
import bcrypt from "bcryptjs";
import { config } from "../../config/index.ts";

export const createAdminHandler: RequestHandler = async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            throw new HttpError(400, "Login and password are required");
        }

        const userRepo = Database.getRepository(User);
        
        // Проверяем существование пользователя
        const existingUser = await userRepo.findOneBy({ login });
        if (existingUser) {
            throw new HttpError(409, "User already exists");
        }

        // Создаем нового пользователя
        const hashedPassword = await bcrypt.hash(password, config.salt);
        const user = new User(login, hashedPassword);
        user.role = UserRole.ADMIN;

        // Сохраняем пользователя
        const savedUser = await userRepo.save(user);

        // Генерируем токены
        const { accessToken, refreshToken } = await authService.issueTokens(savedUser);
        savedUser.refresh_token = refreshToken;
        await userRepo.save(savedUser);

        // Применяем токены к ответу
        applyTokenToResponse(res, accessToken, refreshToken);

        res.status(201).json({
            message: "Admin created successfully",
            user: savedUser.getUserCredentials()
        });
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error while creating admin:", error);
        throw new HttpError(500, "Internal server error while creating admin");
    }
}; 