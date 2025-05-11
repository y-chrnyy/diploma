import type { Request, Response, NextFunction } from "npm:express";
import type { ApiResponse, SuccessResponse, ErrorResponse } from "../types/response.ts";

export const responseFormatter = (_req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  const originalSend = res.send;

  // Перехватываем res.json()
  res.json = function (body: any): Response {
    if (body && typeof body === 'object') {
      const statusCode = res.statusCode || 200;
      const formattedResponse: ApiResponse = {
        status: statusCode >= 400 ? 'error' : 'success',
        code: statusCode,
        ...body
      };

      if (statusCode >= 400 && body.message) {
        formattedResponse.message = body.message;
        delete formattedResponse.data;
      }

      return originalJson.call(this, formattedResponse);
    }
    return originalJson.call(this, body);
  };

  // Перехватываем res.send()
  res.send = function (body: any): Response {
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