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