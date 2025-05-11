export type ApiConfig = {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
};

export type ApiError = {
    message: string;
    status: number;
    errors?: string[];
};

export type ApiResponse = {
    status: number;
    message: string;
};

export type User = {
    id: number;
    login: string;
    role: UserRole;
};

export enum UserRole {
    REGULAR = "regular",
    ADMIN = "admin"
}

export type AuthPayload = {
    login: string;
    password: string;
};

export type ApiLoginResponse = {
    login: string;
    id: number;
    role: UserRole;
    status: number;
    message: string;
};

export type ApiSignupResponse = ApiLoginResponse;

export type ApiUpdateTokensResponse = {
    status: number;
    message: string;
};

export type ApiFavoritesResponse = {
    message: string;
    favorites: string[];
};

export type ApiViewedResponse = {
    message: string;
    viewed: string[];
};

export type ApiGetUsersResponse = {
    users: User[];
};

export type ApiUserDetailsResponse = {
    user: User;
    favorites: string[];
    viewed: string[];
};

export type ApiBlockedVacanciesResponse = {
    blockedVacancies: string[];
};

export interface HhVacancySearchParams {
  text?: string;
  area?: string | string[];
  specialization?: string | string[];
  industry?: string | string[];
  page?: number;
  per_page?: number;
  salary?: number;
  experience?: string;
  employment?: string[];
  schedule?: string[];
  only_with_salary?: boolean;
}

export interface HhVacancySalary {
  from?: number;
  to?: number;
  currency?: string;
  gross?: boolean;
}

export interface HhVacancyEmployer {
  id: string;
  name: string;
  url: string;
  alternate_url: string;
  logo_urls?: {
    original?: string;
    [key: string]: string | undefined;
  };
  trusted: boolean;
}

export interface HhVacancySnippet {
  requirement?: string;
  responsibility?: string;
}

export interface HhVacancy {
  id: string;
  premium: boolean;
  name: string;
  department?: {
    id: string;
    name: string;
  };
  salary?: HhVacancySalary;
  address?: {
    city?: string;
    street?: string;
    building?: string;
    description?: string;
    lat?: number;
    lng?: number;
    raw?: string;
    metro?: {
      station_name: string;
      line_name: string;
    };
  };
  employer: HhVacancyEmployer;
  published_at: string;
  created_at: string;
  archived: boolean;
  apply_alternate_url: string;
  url: string;
  alternate_url: string;
  snippet: HhVacancySnippet;
}

export interface HhVacancySearchResponse {
  items: HhVacancy[];
  found: number;
  pages: number;
  per_page: number;
  page: number;
}

export interface HhVacancyFull extends HhVacancy {
  description: string;
  branded_description?: string;
  key_skills?: { name: string }[];
  experience?: { id: string; name: string };
  schedule?: { id: string; name: string };
  employment?: { id: string; name: string };
  contacts?: Record<string, unknown>;
  address?: HhVacancy["address"] & { metro_stations?: unknown[] };
  salary_range?: Record<string, unknown>;
} 