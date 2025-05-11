export interface AuthPayload {
    login: string;
    password: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface VacancySearchParams {
    text?: string;
    area?: string | string[];
    specialization?: string | string[];
    industry?: string | string[];
    per_page?: number;
    page?: number;
}

export interface VacancyActionPayload {
    vacancyId: string;
}

export interface UserActionPayload {
    userId: number;
} 