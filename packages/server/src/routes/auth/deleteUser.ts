import type { RequestHandler } from "express";
import { Database } from "../../models/index.ts";
import { User, UserRole } from "../../models/User.ts";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import type { AuthenticatedRequest } from "../../types/express/index.ts";

export const deleteUserHandler: RequestHandler = async (req: AuthenticatedRequest, res) => {
    try {
        const userRepo = Database.getRepository(User);
        const currentUserId = req.user?.id;
        // Получаем ID пользователя для удаления либо из body (админ панель), либо текущего пользователя (профиль)
        const targetUserId = req.body.userId || currentUserId;

        if (!currentUserId) {
            throw new HttpError(401, "User is not authenticated");
        }

        const userToDelete = await userRepo.findOneBy({ id: targetUserId });
        if (!userToDelete) {
            throw new HttpError(404, "User not found");
        }

        const currentUser = await userRepo.findOneBy({ id: currentUserId });
        if (!currentUser) {
            throw new HttpError(404, "Current user not found");
        }

        // Проверяем права на удаление:
        // 1. Пользователь может удалить сам себя
        // 2. Админ может удалить любого пользователя, кроме других админов
        if (currentUserId !== targetUserId && // Не самоудаление
            (currentUser.role !== UserRole.ADMIN || // Не админ
             (userToDelete.role === UserRole.ADMIN && currentUserId !== targetUserId))) { // Пытается удалить другого админа
            throw new HttpError(403, "Cannot delete another admin user");
        }

        await userRepo.remove(userToDelete);

        // Очищаем куки только если пользователь удаляет сам себя
        if (currentUserId === targetUserId) {
            res.clearCookie("Authorization");
            res.clearCookie("Refresh");
        }

        res.json({ message: "User successfully deleted" });
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error while deleting user:", error);
        throw new HttpError(500, "Internal server error while deleting user");
    }
};