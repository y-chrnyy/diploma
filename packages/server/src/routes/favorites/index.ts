import type { RequestHandler } from "express";
import { Database } from "../../models/index.ts";
import { FavoriteVacancy } from "../../models/FavoriteVacancy.ts";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import { UserType } from "../../types/index.ts";
export const getFavoritesHandler: RequestHandler = async (req, res) => {
    const userId = (req as unknown as Request & { user?: UserType }).user?.id;

    if (!userId) {
        throw new HttpError(401, 'User is not authorized');
    }

    const favoriteRepo = Database.getRepository(FavoriteVacancy);
    
    try {
        const favorites = await favoriteRepo.find({
            where: { userId },
            select: ['vacancyId']
        });

        res.json({ 
            message: 'Favorites retrieved successfully',
            favorites: favorites.map(f => f.vacancyId)
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw new HttpError(500, 'Failed to fetch favorites');
    }
};

export const removeFromFavoritesHandler: RequestHandler = async (req, res) => {
    const { vacancyId } = req.body;
    const userId = (req as unknown as Request & { user?: UserType }).user?.id;

    if (!userId) {
        throw new HttpError(401, 'User is not authorized');
    }

    if (!vacancyId) {
        throw new HttpError(400, 'Vacancy ID is required');
    }

    const favoriteRepo = Database.getRepository(FavoriteVacancy);

    try {
        await favoriteRepo.delete({ userId, vacancyId });
        
        const favorites = await favoriteRepo.find({
            where: { userId },
            select: ['vacancyId']
        });

        res.json({ 
            message: 'Vacancy removed from favorites',
            favorites: favorites.map(f => f.vacancyId)
        });
    } catch (error) {
        console.error('Error removing vacancy from favorites:', error);
        throw new HttpError(500, 'Failed to remove vacancy from favorites');
    }
};

export const addToFavoritesHandler: RequestHandler = async (req, res) => {
    const { vacancyId } = req.body;
    const userId = (req as unknown as Request & { user?: UserType }).user?.id;

    if (!userId) {
        throw new HttpError(401, 'User is not authorized');
    }

    if (!vacancyId) {
        throw new HttpError(400, 'Vacancy ID is required');
    }

    const favoriteRepo = Database.getRepository(FavoriteVacancy);

    try {
        const favorite = new FavoriteVacancy(userId, vacancyId);
        await favoriteRepo.save(favorite);
        
        // Получаем обновленный список избранных
        const favorites = await favoriteRepo.find({
            where: { userId },
            select: ['vacancyId']
        });

        res.json({ 
            message: 'Vacancy added to favorites',
            favorites: favorites.map(f => f.vacancyId)
        });
    } catch (error) {
        console.error('Error adding vacancy to favorites:', error);
        throw new HttpError(500, 'Failed to add vacancy to favorites');
    }
}; 