export interface ApiResponse<T = undefined> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  code: number;
}

export type SuccessResponse<T> = ApiResponse<T> & {
  status: 'success';
  data: T;
};

export type ErrorResponse = ApiResponse & {
  status: 'error';
  message: string;
};

export type AuthResponse = SuccessResponse<{
  id: number;
  login: string;
  role: string;
}>;

export type VacancyResponse = SuccessResponse<{
  id: string;
  name: string;
  employer: {
    name: string;
  };
  salary?: {
    from?: number;
    to?: number;
    currency?: string;
  };
  area: {
    name: string;
  };
  published_at: string;
  blocked?: boolean;
}>;

export type FavoritesResponse = SuccessResponse<{
  favorites: string[];
}>;

export type ViewedResponse = SuccessResponse<{
  viewed: string[];
}>; 