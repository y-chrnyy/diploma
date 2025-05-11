import axios, { AxiosInstance } from "axios";
import { DataSource, Repository } from "typeorm";
import { BlockedVacancy } from "../models/BlockedVacancy.ts";

interface HhVacancySearchParams {
  text?: string;
  area?: string | string[];
  specialization?: string | string[];
  industry?: string | string[];
  per_page?: number;
  page?: number;
  salary?: number;
  experience?: string;
  employment?: string[];
  schedule?: string[];
  only_with_salary?: boolean;
}

interface HhVacancySearchResponse {
  items: any[];
  found: number;
  pages: number;
  per_page: number;
  page: number;
}

export class HhService {
  private readonly api: AxiosInstance;
  private readonly blockedVacancyRepo: Repository<BlockedVacancy>;

  constructor(db: DataSource) {
    this.api = axios.create({
      baseURL: 'https://api.hh.ru',
      timeout: 15000,
      headers: {},
    });
    this.blockedVacancyRepo = db.getRepository(BlockedVacancy);
  }

  async searchVacancies(params: HhVacancySearchParams): Promise<HhVacancySearchResponse> {
    try {
      // Получаем список заблокированных вакансий
      const blockedVacancies = await this.blockedVacancyRepo.find();
      const blockedIds = new Set(blockedVacancies.map(v => v.vacancyId));

      // Увеличиваем per_page на количество заблокированных вакансий
      // чтобы после фильтрации получить нужное количество
      const adjustedPerPage = (params.per_page || 20) + blockedIds.size;

      // Преобразуем параметры для HH API
      const apiParams = {
        ...params,
        per_page: adjustedPerPage,
        area: Array.isArray(params.area) ? params.area.join(',') : params.area,
        specialization: Array.isArray(params.specialization) ? params.specialization.join(',') : params.specialization,
        industry: Array.isArray(params.industry) ? params.industry.join(',') : params.industry,
        employment: Array.isArray(params.employment) ? params.employment.join(',') : params.employment,
        schedule: Array.isArray(params.schedule) ? params.schedule.join(',') : params.schedule,
        only_with_salary: params.only_with_salary ? 'true' : undefined,
        salary: params.salary ? params.salary.toString() : undefined,
      };

      // Делаем запрос к HH API
      const response = await this.api.get<HhVacancySearchResponse>('/vacancies', {
        params: apiParams
      });

      const data = response.data;
      
      // Фильтруем заблокированные вакансии
      const filteredItems = data.items.filter(item => !blockedIds.has(item.id));
      
      // Обрезаем до изначально запрошенного количества
      const items = filteredItems.slice(0, params.per_page || 20);

      // Корректируем метаданные
      const blockedCount = data.items.length - filteredItems.length;
      
      return {
        items,
        found: Math.max(0, data.found - blockedIds.size), // Уменьшаем общее количество
        pages: Math.ceil((data.found - blockedIds.size) / (params.per_page || 20)), // Пересчитываем страницы
        per_page: items.length, // Реальное количество вакансий на странице
        page: params.page || 0
      };
    } catch (error) {
      console.error('Error searching vacancies:', error);
      throw error;
    }
  }

  async getVacancyDetails(id: string): Promise<any> {
    try {
      const response = await this.api.get(`/vacancies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting vacancy details:', error);
      throw error;
    }
  }

  async getVacancy(id: string): Promise<any> {
    try {
      // Проверяем, не заблокирована ли вакансия
      const isBlocked = await this.blockedVacancyRepo.findOneBy({ vacancyId: id });
      if (isBlocked) {
        throw new Error('Vacancy is blocked');
      }

      const response = await this.api.get(`/vacancies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting vacancy:', error);
      throw error;
    }
  }
} 