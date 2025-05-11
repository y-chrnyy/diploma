import type { RequestHandler } from "npm:express";
import { Database } from "../../models/index.ts";
import { User, UserRole } from "../../models/User.ts";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import { BlockedVacancy } from "../../models/BlockedVacancy.ts";
import { FavoriteVacancy } from "../../models/FavoriteVacancy.ts";
import { ViewedVacancy } from "../../models/ViewedVacancy.ts";
import { HH_API_URL } from "../../config/index.ts";
import { HhService } from "../../modules/hh.service.ts";

const hhService = new HhService(Database);

export const getAllUsersHandler: RequestHandler = async (req, res) => {
    try {
        const { search } = req.query;
        const userRepo = Database.getRepository(User);
        
        let query = userRepo.createQueryBuilder("user");
        
        if (search) {
            query = query.where("user.login LIKE :search OR CAST(user.id as TEXT) LIKE :search", { 
                search: `%${search}%` 
            });
        }
        
        const users = await query.getMany();
        res.json({ users: users.map(u => u.getUserCredentials()) });
    } catch (error) {
        console.error('Error in getAllUsersHandler:', error);
        throw new HttpError(500, 'Failed to get users');
    }
};

export const getUserDetailsHandler: RequestHandler = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new HttpError(400, 'User ID is required');
        }

        const userRepo = Database.getRepository(User);
        const favoritesRepo = Database.getRepository(FavoriteVacancy);
        const viewedRepo = Database.getRepository(ViewedVacancy);

        const user = await userRepo.findOneBy({ id: parseInt(userId) });
        if (!user) {
            throw new HttpError(404, `User with id ${userId} not found`);
        }

        const favorites = await favoritesRepo.find({ where: { userId: parseInt(userId) } });
        const viewed = await viewedRepo.find({ where: { userId: parseInt(userId) } });

        res.json({
            user: user.getUserCredentials(),
            favorites: favorites.map(f => f.vacancyId),
            viewed: viewed.map(v => v.vacancyId)
        });
    } catch (error) {
        console.error('Error in getUserDetailsHandler:', error);
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(500, 'Failed to get user details');
    }
};

export const promoteToAdminHandler: RequestHandler = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            throw new HttpError(400, 'User ID is required');
        }

        const userRepo = Database.getRepository(User);
        
        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
            throw new HttpError(404, `User with id ${userId} not found`);
        }

        if (user.role === UserRole.ADMIN) {
            throw new HttpError(400, 'User is already an admin');
        }

        user.role = UserRole.ADMIN;
        await userRepo.save(user);
        
        res.json({ message: 'User promoted to admin successfully', user: user.getUserCredentials() });
    } catch (error) {
        console.error('Error in promoteToAdminHandler:', error);
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(500, 'Failed to promote user to admin');
    }
};

export const deleteUserHandler: RequestHandler = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            throw new HttpError(400, 'User ID is required');
        }

        const userRepo = Database.getRepository(User);
        
        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
            throw new HttpError(404, `User with id ${userId} not found`);
        }

        if (user.role === UserRole.ADMIN) {
            throw new HttpError(400, 'Cannot delete admin user');
        }

        await userRepo.remove(user);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUserHandler:', error);
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(500, 'Failed to delete user');
    }
};

export const blockVacancyHandler: RequestHandler = async (req, res) => {
    try {
        const { vacancyId } = req.body;
        if (!vacancyId) {
            throw new HttpError(400, 'Vacancy ID is required');
        }

        const blockedRepo = Database.getRepository(BlockedVacancy);
        
        const existingBlock = await blockedRepo.findOneBy({ vacancyId });
        if (existingBlock) {
            throw new HttpError(400, 'Vacancy is already blocked');
        }

        const blocked = new BlockedVacancy(vacancyId);
        await blockedRepo.save(blocked);
        
        res.json({ message: 'Vacancy blocked successfully' });
    } catch (error) {
        console.error('Error in blockVacancyHandler:', error);
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(500, 'Failed to block vacancy');
    }
};

export const unblockVacancyHandler: RequestHandler = async (req, res) => {
    try {
        const { vacancyId } = req.body;
        if (!vacancyId) {
            throw new HttpError(400, 'Vacancy ID is required');
        }

        const blockedRepo = Database.getRepository(BlockedVacancy);
        
        const existingBlock = await blockedRepo.findOneBy({ vacancyId });
        if (!existingBlock) {
            throw new HttpError(404, 'Vacancy is not blocked');
        }

        await blockedRepo.delete({ vacancyId });
        
        res.json({ message: 'Vacancy unblocked successfully' });
    } catch (error) {
        console.error('Error in unblockVacancyHandler:', error);
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(500, 'Failed to unblock vacancy');
    }
};

export const getBlockedVacanciesHandler: RequestHandler = async (req, res) => {
    try {
        const blockedRepo = Database.getRepository(BlockedVacancy);
        const blocked = await blockedRepo.find();
        
        res.json({ blockedVacancies: blocked.map(b => b.vacancyId) });
    } catch (error) {
        console.error('Error in getBlockedVacanciesHandler:', error);
        throw new HttpError(500, 'Failed to get blocked vacancies');
    }
};

export const getVacancyDetailsHandler: RequestHandler = async (req, res) => {
    try {
        const { vacancyId } = req.params;
        if (!vacancyId) {
            throw new HttpError(400, 'Vacancy ID is required');
        }

        // Получаем информацию о блокировке
        const blockedRepo = Database.getRepository(BlockedVacancy);
        const isBlocked = await blockedRepo.findOneBy({ vacancyId });

        try {
            // Используем новый метод для получения деталей вакансии
            const vacancy = await hhService.getVacancyDetails(vacancyId);
            
            // Добавляем информацию о блокировке в ответ
            res.json({ 
                vacancy: {
                    ...vacancy,
                    blocked: !!isBlocked
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('404')) {
                    throw new HttpError(404, 'Vacancy not found');
                }
            }
            throw error;
        }
    } catch (error) {
        console.error('Error in getVacancyDetailsHandler:', error);
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(500, 'Failed to get vacancy details');
    }
}; 