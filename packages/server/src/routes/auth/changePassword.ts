import type { RequestHandler } from "npm:express";
import { Database } from "../../models/index.ts";
import { User } from "../../models/User.ts";
import { authService } from "../../modules/index.ts";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import bcrypt from "npm:bcryptjs";
import { config } from "../../config/index.ts";

export const changePasswordHandler: RequestHandler = async (req, res) => {
    try {
        const userRepo = Database.getRepository(User)
        const { currentPassword, newPassword } = req.body
        const userId = req.user?.id

        if (!userId) {
            throw new HttpError(401, 'Пользователь не авторизован')
        }

        if (!currentPassword || !newPassword) {
            throw new HttpError(400, 'Не указан текущий или новый пароль')
        }

        const user = await userRepo.findOneBy({ id: userId })
        if (!user) {
            throw new HttpError(404, 'Пользователь не найден')
        }

        const isPasswordMatch = await authService.comparePassword(currentPassword, user.password)
        if (!isPasswordMatch) {
            throw new HttpError(401, 'Неверный текущий пароль')
        }

        const hashedPassword = await bcrypt.hash(newPassword, config.salt)
        user.password = hashedPassword
        await userRepo.save(user)

        res.json({ message: 'Пароль успешно изменен' })
    } catch (error) {
        if (error instanceof HttpError) {
            throw error
        }
        console.error('Ошибка при смене пароля:', error)
        throw new HttpError(500, 'Внутренняя ошибка сервера')
    }
} 