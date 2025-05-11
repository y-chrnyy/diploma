import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types/response.ts";

export const responseFormatter = (_req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  const originalSend = res.send;

  // Перехватываем res.json()
  res.json = function <T extends object>(body: T): Response {
    if (body && typeof body === 'object') {
      const statusCode = res.statusCode || 200;
      const formattedResponse: ApiResponse<T> = {
        status: statusCode >= 400 ? 'error' : 'success',
        code: statusCode,
        data: statusCode >= 400 ? undefined : body,
        message: statusCode >= 400 ? (body as { message?: string }).message : undefined
      };

      return originalJson.call(this, formattedResponse);
    }
    return originalJson.call(this, body);
  };

  // Перехватываем res.send()
  res.send = function (body: unknown): Response {
    // Пропускаем форматирование для ping endpoint
    if (body === 'pong') {
      return originalSend.call(this, body);
    }

    if (body && typeof body === 'object') {
      return res.json(body);
    }
    return originalSend.call(this, body);
  };

  next();
}; 