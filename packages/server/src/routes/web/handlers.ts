import type { RequestHandler } from "express";
import { Database } from "../../models/index.ts";
import { HhService } from "../../modules/hh.service.ts";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import { UserRole } from "../../models/User.ts";
import { BlockedVacancy } from "../../models/BlockedVacancy.ts";
import { UserType } from "../../types/index.ts";
const hhService = new HhService(Database);

export const searchVacanciesHandler: RequestHandler = async (req, res) => {
  try {
    const params = req.query;
    const result = await hhService.searchVacancies({
      text: params.text as string,
      area: params.area as string | string[],
      salary: params.salary ? parseInt(params.salary as string) : undefined,
      experience: params.experience as string,
      employment: params.employment as string[],
      schedule: params.schedule as string[],
      only_with_salary: params.only_with_salary === 'true',
      specialization: params.specialization as string | string[],
      industry: params.industry as string | string[],
      per_page: params.per_page ? parseInt(params.per_page as string) : undefined,
      page: params.page ? parseInt(params.page as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error in searchVacanciesHandler:', error);
    throw new HttpError(500, 'Failed to search vacancies');
  }
};

export const getVacancyHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new HttpError(400, 'Vacancy ID is required');
    }

    // Проверяем, заблокирована ли вакансия
    const blockedRepo = Database.getRepository(BlockedVacancy);
    const isBlocked = await blockedRepo.findOneBy({ vacancyId: id });

    // Если вакансия заблокирована и пользователь не админ - возвращаем 403
    const user = (req as unknown as Request & { user?: UserType }).user;
    if (isBlocked && (!user || user.role !== UserRole.ADMIN)) {
      res.status(403).json({ message: 'Vacancy is blocked' });
      return;
    }

    try {
      // Получаем данные вакансии
      const vacancy = await hhService.getVacancy(id);
      
      // Добавляем флаг blocked в ответ
      res.json({
        ...vacancy,
        blocked: !!isBlocked
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Vacancy is blocked') {
        res.status(403).json({ message: 'Vacancy is blocked' });
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in getVacancyHandler:', error);
    throw new HttpError(500, 'Failed to get vacancy');
  }
}; 