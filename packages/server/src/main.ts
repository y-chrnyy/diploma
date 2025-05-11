import "reflect-metadata"
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser"
import { Database } from "./models/index.ts";
import { 
  loginWithJWTHandler, 
  loginWithPasswordHandler, 
  signUpHandler, 
  updateAccessTokenHandler,
  addToFavoritesHandler,
  getFavoritesHandler,
  removeFromFavoritesHandler,
  getViewedHandler,
  addToViewedHandler,
  getAllUsersHandler,
  getUserDetailsHandler,
  promoteToAdminHandler,
  deleteUserHandler,
  blockVacancyHandler,
  unblockVacancyHandler,
  getBlockedVacanciesHandler,
  getVacancyDetailsHandler,
  changePasswordHandler,
  createAdminHandler
} from "./routes/index.ts";
import { errorMiddleware, jsonOnlyMiddleware } from "./middleware/index.ts";
import bodyParser from "body-parser";
import { AuthOnlyMiddleware } from "./middleware/authOnly.ts";
import { AdminOnlyMiddleware } from "./middleware/adminOnly.ts";
import cors from "cors"
import errorHandler from 'express-async-handler'
import { logoutHandler } from "./routes/auth/logout.ts";
import { responseFormatter } from "./middleware/responseFormatter.ts";
import { searchVacanciesHandler, getVacancyHandler } from "./routes/web/handlers.ts";

const app = express();
const PORT = 3000;

// Lib middlewares
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // разрешаем preflight для всех роутов

/***
 *    ███╗   ███╗██╗██████╗ ██████╗ ██╗     ███████╗██╗    ██╗ █████╗ ██████╗ ███████╗███████╗
 *    ████╗ ████║██║██╔══██╗██╔══██╗██║     ██╔════╝██║    ██║██╔══██╗██╔══██╗██╔════╝██╔════╝
 *    ██╔████╔██║██║██║  ██║██║  ██║██║     █████╗  ██║ █╗ ██║███████║██████╔╝█████╗  ███████╗
 *    ██║╚██╔╝██║██║██║  ██║██║  ██║██║     ██╔══╝  ██║███╗██║██╔══██║██╔══██╗██╔══╝  ╚════██║
 *    ██║ ╚═╝ ██║██║██████╔╝██████╔╝███████╗███████╗╚███╔███╔╝██║  ██║██║  ██║███████╗███████║
 *    ╚═╝     ╚═╝╚═╝╚═════╝ ╚═════╝ ╚══════╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝
 *                                                                                            
 */
app.use(responseFormatter); // Добавляем форматирование ответов
const jsonContentTypeExceptions = [
  '/auth/login-jwt',
  '/auth/logout',
];
app.post('*', errorHandler((req: Request, res: Response, next: NextFunction) => {
  if (jsonContentTypeExceptions.includes(req.url)) return next();
  return jsonOnlyMiddleware(req, res, next);
})); // Проверяем Content-Type только для POST запросов, кроме /auth/login-jwt


/***
 *    ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
 *    ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
 *    ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
 *    ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
 *    ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
 *    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
 *                                                       
 */
app.post("/auth/signup", errorHandler(signUpHandler));
app.post("/auth/create-admin", errorHandler(createAdminHandler));
app.post("/auth/login-jwt", errorHandler(loginWithJWTHandler));
app.post("/auth/login", errorHandler(loginWithPasswordHandler));
app.get('/auth/update', errorHandler(updateAccessTokenHandler));
app.post("/auth/logout", errorHandler(AuthOnlyMiddleware), errorHandler(logoutHandler));
app.post("/auth/change-password", errorHandler(AuthOnlyMiddleware), errorHandler(changePasswordHandler));

// Web routes
app.get("/web/vacancies/search", errorHandler(AuthOnlyMiddleware), errorHandler(searchVacanciesHandler));
app.get("/web/vacancies/:id", errorHandler(AuthOnlyMiddleware), errorHandler(getVacancyHandler));
app.delete("/auth/delete-user", errorHandler(AuthOnlyMiddleware), errorHandler(deleteUserHandler));
app.post("/web/favorites/add", errorHandler(AuthOnlyMiddleware), errorHandler(addToFavoritesHandler));
app.post("/web/favorites/remove", errorHandler(AuthOnlyMiddleware), errorHandler(removeFromFavoritesHandler));
app.get("/web/favorites", errorHandler(AuthOnlyMiddleware), errorHandler(getFavoritesHandler));
app.get("/web/viewed", errorHandler(AuthOnlyMiddleware), errorHandler(getViewedHandler));
app.post("/web/viewed/add", errorHandler(AuthOnlyMiddleware), errorHandler(addToViewedHandler));
app.get('/web/ping', (_: Request, res: Response) => {
  res.send('pong')
})

// Admin routes
app.get("/admin/users", errorHandler(AuthOnlyMiddleware), errorHandler(AdminOnlyMiddleware), errorHandler(getAllUsersHandler));
app.get("/admin/users/:userId", errorHandler(AuthOnlyMiddleware), errorHandler(AdminOnlyMiddleware), errorHandler(getUserDetailsHandler));
app.post("/admin/users/promote", errorHandler(AuthOnlyMiddleware), errorHandler(AdminOnlyMiddleware), errorHandler(promoteToAdminHandler));
app.delete("/admin/users/delete", errorHandler(AuthOnlyMiddleware), errorHandler(AdminOnlyMiddleware), errorHandler(deleteUserHandler));
app.post("/admin/vacancies/block", errorHandler(AuthOnlyMiddleware), errorHandler(AdminOnlyMiddleware), errorHandler(blockVacancyHandler));
app.post("/admin/vacancies/unblock", errorHandler(AuthOnlyMiddleware), errorHandler(AdminOnlyMiddleware), errorHandler(unblockVacancyHandler));
app.get("/admin/vacancies/blocked", errorHandler(AuthOnlyMiddleware), errorHandler(AdminOnlyMiddleware), errorHandler(getBlockedVacanciesHandler));
app.get("/admin/vacancies/:vacancyId", errorHandler(AuthOnlyMiddleware), errorHandler(AdminOnlyMiddleware), errorHandler(getVacancyDetailsHandler));

app.use(errorMiddleware)


Database.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT: ${PORT}`);
  });
})

