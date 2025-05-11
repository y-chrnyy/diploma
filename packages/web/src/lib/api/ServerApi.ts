import axios, { AxiosError, AxiosInstance } from 'axios';
import type { 
  ApiConfig, 
  ApiError, 
  ApiLoginResponse, 
  ApiResponse,
  ApiFavoritesResponse,
  ApiViewedResponse,
  ApiSignupResponse, 
  ApiGetUsersResponse,
  ApiUserDetailsResponse,
  ApiBlockedVacanciesResponse,
  AuthPayload,
  User,
  HhVacancySearchParams,
  HhVacancySearchResponse,
  HhVacancyFull,
} from './types.ts';

export class ServerApi {
  private readonly api: AxiosInstance;

  constructor(config: ApiConfig) {
    this.api = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      withCredentials: true,
    });


  }

  async login(payload: AuthPayload): Promise<ApiLoginResponse> {
    const r = await this.api.post<User>('/auth/login', payload);

    return {
      login: r.data.login,
      id: r.data.id,
      role: r.data.role,
      status: r.status,
      message: r.statusText
    };
  }

  async signUp(payload: AuthPayload): Promise<ApiSignupResponse> {
    const r =  await this.api.post<User>('/auth/signup', {
      authPayload: payload
    });

    return {
      login: r.data.login,
      id: r.data.id,
      role: r.data.role,
      status: r.status,
      message: r.statusText
    };
  }


  async deleteUser(): Promise<ApiResponse> {
    const response = await this.api.delete('/auth/delete-user');
    return {
      status: response.status,
      message: response.statusText
    };
  }

  async updateTokens(): Promise<ApiLoginResponse> {
    const r = await this.api.get<User>('/auth/update');
    return {
        login: r.data.login,
        id: r.data.id,
        role: r.data.role,
        status: r.status,
        message: r.statusText
    };
  }

  async loginWithJWT(): Promise<ApiLoginResponse> {
    const r = await this.api.post<User>('/auth/login-jwt');
    return {
      login: r.data.login,
      id: r.data.id,
      role: r.data.role,
      status: r.status,
      message: r.statusText
    };
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.api.post('/auth/logout');
    return {
      status: response.status,
      message: response.data?.message || response.statusText
    };
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return {
      status: response.status,
      message: response.data?.message || response.statusText
    };
  }

  async addToFavorites(vacancyId: string): Promise<ApiFavoritesResponse> {
    const response = await this.api.post<ApiFavoritesResponse>('/web/favorites/add', { vacancyId });
    return response.data;
  }

  async getFavorites(): Promise<ApiFavoritesResponse> {
    const response = await this.api.get<ApiFavoritesResponse>('/web/favorites');
    return response.data;
  }

  async removeFromFavorites(vacancyId: string): Promise<ApiFavoritesResponse> {
    const response = await this.api.post<ApiFavoritesResponse>('/web/favorites/remove', { vacancyId });
    return response.data;
  }

  async addToViewed(vacancyId: string): Promise<ApiViewedResponse> {
    const response = await this.api.post<ApiViewedResponse>('/web/viewed/add', { vacancyId });
    return response.data;
  }

  async getViewed(): Promise<ApiViewedResponse> {
    const response = await this.api.get<ApiViewedResponse>('/web/viewed');
    return response.data;
  }

  // Admin methods
  async getAllUsers(search?: string): Promise<ApiGetUsersResponse> {
    const response = await this.api.get<ApiGetUsersResponse>('/admin/users', {
      params: { search }
    });
    return response.data;
  }

  async getUserDetails(userId: number): Promise<ApiUserDetailsResponse> {
    const response = await this.api.get<ApiUserDetailsResponse>(`/admin/users/${userId}`);
    return response.data;
  }

  async promoteToAdmin(userId: number): Promise<ApiResponse> {
    const response = await this.api.post('/admin/users/promote', { userId });
    return {
      status: response.status,
      message: response.data.message
    };
  }

  async deleteUserAsAdmin(userId: number): Promise<ApiResponse> {
    const response = await this.api.delete('/admin/users/delete', { 
      data: { userId } 
    });
    return {
      status: response.status,
      message: response.data.message
    };
  }

  async blockVacancy(vacancyId: string): Promise<ApiResponse> {
    const response = await this.api.post('/admin/vacancies/block', { vacancyId });
    return {
      status: response.status,
      message: response.data.message
    };
  }

  async unblockVacancy(vacancyId: string): Promise<ApiResponse> {
    const response = await this.api.post('/admin/vacancies/unblock', { vacancyId });
    return {
      status: response.status,
      message: response.data.message
    };
  }

  async getBlockedVacancies(): Promise<ApiBlockedVacanciesResponse> {
    const response = await this.api.get<ApiBlockedVacanciesResponse>('/admin/vacancies/blocked');
    return response.data;
  }

  async searchVacancies(params: HhVacancySearchParams): Promise<HhVacancySearchResponse> {
    const response = await this.api.get<HhVacancySearchResponse>('/web/vacancies/search', { params });
    return response.data;
  }

  async getVacancy(id: string): Promise<HhVacancyFull> {
    const response = await this.api.get<HhVacancyFull>(`/web/vacancies/${id}`);
    return response.data;
  }

  async getVacancyDetails(id: string): Promise<HhVacancyFull> {
    const response = await this.api.get<{ vacancy: HhVacancyFull }>(`/admin/vacancies/${id}`);
    return response.data.vacancy;
  }

  private handleError(error: AxiosError<ApiError>): never {
    const errorData = {
      message: error.message || 'unknown error',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors
    };
    throw errorData;
  }
} 

export const SERVER_API_URL = "http://localhost:3000";

export const api = new ServerApi({
  baseURL: SERVER_API_URL,
  timeout: 10000,
  headers: {}
});