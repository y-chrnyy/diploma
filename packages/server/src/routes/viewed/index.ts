import type { RequestHandler } from "express";
import { Database } from "../../models/index.ts";
import { ViewedVacancy } from "../../models/ViewedVacancy.ts";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import { UserType } from "../../types/index.ts";
export const getViewedHandler: RequestHandler = async (req, res) => {
    try {
        const userId = (req as unknown as Request & { user?: UserType }).user?.id;
        
        if (!userId) {
            throw new HttpError(401, "User is not authorized");
        }

        const viewedVacancyRepository = Database.getRepository(ViewedVacancy);
        const viewedVacancies = await viewedVacancyRepository.find({
            where: { userId },
            select: ["vacancyId"]
        });

        res.json({
            viewed: viewedVacancies.map((vacancy: ViewedVacancy) => vacancy.vacancyId)
        });
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(500, "Failed to get viewed vacancies");
    }
};

export const addToViewedHandler: RequestHandler = async (req, res) => {
    try {
        const userId = (req as unknown as Request & { user?: UserType }).user?.id;
        
        if (!userId) {
            throw new HttpError(401, "User is not authorized");
        }

        const { vacancyId } = req.body;

        if (!vacancyId) {
            throw new HttpError(400, "Vacancy ID is not provided");
        }

        const viewedVacancyRepository = Database.getRepository(ViewedVacancy);
        const existingVacancy = await viewedVacancyRepository.findOne({
            where: { userId, vacancyId }
        });

        if (!existingVacancy) {
            const viewedVacancy = new ViewedVacancy(userId, vacancyId);
            await viewedVacancyRepository.save(viewedVacancy);
        }

        const viewedVacancies = await viewedVacancyRepository.find({
            where: { userId },
            select: ["vacancyId"]
        });

        res.json({
            viewed: viewedVacancies.map((vacancy: ViewedVacancy) => vacancy.vacancyId)
        });
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(500, "Failed to add vacancy to viewed");
    }
}; 