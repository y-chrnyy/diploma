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
  HhVacancySearchParams,
  HhVacancySearchResponse,
  HhVacancyFull,
  UserRole,
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
    const r = await this.api.post<{
      status: string,
      code: number,
      data: {
        id: number,
        login: string,
        role: UserRole
      }
    }>('/auth/login', payload);

    return {
      login: r.data.data.login,
      id: r.data.data.id,
      role: r.data.data.role,
      status: r.status,
      message: r.statusText
    };
  }

  async signUp(payload: AuthPayload): Promise<ApiSignupResponse> {
    const r = await this.api.post<{
      status: string,
      code: number,
      data: {
        id: number,
        login: string,
        role: UserRole
      }
    }>('/auth/signup', {
      authPayload: payload
    });

    return {
      login: r.data.data.login,
      id: r.data.data.id,
      role: r.data.data.role,
      status: r.status,
      message: r.statusText
    };
  }


  async deleteUser(userId?: number): Promise<ApiResponse> {
    try {
      const response = await this.api.delete('/auth/delete-user', {
        data: userId ? { userId } : undefined
      });
      return {
        status: response.status,
        message: response.data?.message || response.statusText
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async updateTokens(): Promise<ApiLoginResponse> {
    const r = await this.api.get<{
      status: string,
      code: number,
      data: {
        id: number,
        login: string,
        role: UserRole
      }
    }>('/auth/update');
    return {
      login: r.data.data.login,
      id: r.data.data.id,
      role: r.data.data.role,
      status: r.status,
      message: r.statusText
    };
  }

  async loginWithJWT(): Promise<ApiLoginResponse> {
    const r = await this.api.post<{
      status: string,
      code: number,
      data: {
        id: number,
        login: string,
        role: UserRole
      }
    }>('/auth/login-jwt');
    return {
      login: r.data.data.login,
      id: r.data.data.id,
      role: r.data.data.role,
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
    const response = await this.api.post<{data: ApiFavoritesResponse}>('/web/favorites/add', { vacancyId });
    return response.data.data;
  }

  async getFavorites(): Promise<ApiFavoritesResponse> {
    const response = await this.api.get<{data: ApiFavoritesResponse}>('/web/favorites');
    return response.data.data;
  }

  async removeFromFavorites(vacancyId: string): Promise<ApiFavoritesResponse> {
    const response = await this.api.post<{data: ApiFavoritesResponse}>('/web/favorites/remove', { vacancyId });
    return response.data.data;
  }

  async addToViewed(vacancyId: string): Promise<ApiViewedResponse> {
    const response = await this.api.post<{data: ApiViewedResponse}>('/web/viewed/add', { vacancyId });
    return response.data.data;
  }

  async getViewed(): Promise<ApiViewedResponse> {
    const response = await this.api.get<{data: ApiViewedResponse}>('/web/viewed');
    return response.data.data;
  }

  // Admin methods
  async getAllUsers(search?: string): Promise<ApiGetUsersResponse> {
    const response = await this.api.get<{data: ApiGetUsersResponse}>('/admin/users', {
      params: { search }
    });
    return response.data.data;
  }

  async getUserDetails(userId: number): Promise<ApiUserDetailsResponse> {
    const response = await this.api.get<{data: ApiUserDetailsResponse}>(`/admin/users/${userId}`);
    return response.data.data;
  }

  async promoteToAdmin(userId: number): Promise<ApiResponse> {
    const response = await this.api.post('/admin/users/promote', { userId });
    return {
      status: response.status,
      message: response.data.message
    };
  }

  async deleteUserAsAdmin(userId: number): Promise<ApiResponse> {
    try {
      const response = await this.api.delete('/admin/users/delete', { 
        data: { userId } 
      });
      return {
        status: response.status,
        message: response.data.message
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
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
    const response = await this.api.get<{data: ApiBlockedVacanciesResponse}>('/admin/vacancies/blocked');
    return response.data.data;
  }

  async searchVacancies(params: HhVacancySearchParams): Promise<HhVacancySearchResponse> {
    const response = await this.api.get<{data: HhVacancySearchResponse}>('/web/vacancies/search', { params });
    return response.data.data;
  }

  async getVacancy(id: string): Promise<HhVacancyFull> {
    const response = await this.api.get<{data: HhVacancyFull}>(`/web/vacancies/${id}`);
    return response.data.data;
  }

  async getVacancyDetails(id: string): Promise<HhVacancyFull> {
    try {
      const response = await this.api.get<{data: { vacancy: HhVacancyFull}}>(`/admin/vacancies/${id}`);
      if (!response.data.data) {
        throw new Error(`No data returned for vacancy ${id}`);
      }
      return response.data.data.vacancy;
    } catch (error) {
      console.error(`Failed to fetch vacancy details for ${id}:`, error);
      throw error;
    }
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

export const SERVER_API_URL = "http://158.160.159.69:3000";

export const api = new ServerApi({
  baseURL: SERVER_API_URL,
  timeout: 10000,
  headers: {}
});