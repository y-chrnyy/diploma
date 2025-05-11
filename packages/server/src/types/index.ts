export * from './request.ts';
export * from './response.ts';
export * from './routeFn.ts';
export type UserType = {
    access: string;
    refresh: string;
    id: number;
    login: string;
    role: string;
}