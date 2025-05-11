import type { RequestHandler, Response } from "express";
import { Database } from "../../models/index.ts";
import { User } from "../../models/User.ts";
import { authService } from "../../modules/index.ts";
import { applyTokenToResponse } from "./applyTokenToResponse.ts";
import { verifyJwt } from "../../utils/jwt.ts";
import { HttpError } from "../../middleware/errorMiddleware.ts";

export const loginWithJWTHandler: RequestHandler = async (req, res) => {
    const accessTokenFromCookie = req.cookies['Authorization'] as string | undefined
    if (!accessTokenFromCookie) {
        throw new HttpError(400, 'Не найден access token в cookies')
    }
    await loginWithJWT(res, accessTokenFromCookie)
}

export const loginWithPasswordHandler: RequestHandler = async (req, res) => {
    const userRepo = Database.getRepository(User)
    const { login, password } = req.body
    if (!login || !password) {
        throw new HttpError(400, 'Bad request. Cannot find password or login in request body')
    }
    const user = await userRepo.findOneBy({ login: login })
    if (!user) {
        throw new HttpError(401, `Cannot find user with login: ${login}`)
    }
    const isPasswordsMatch = await authService.comparePassword(password, user.password)
    if (!isPasswordsMatch) {
        throw new HttpError(401, 'Invalid password')
    }
    const { refreshToken, accessToken } = await authService.issueTokens(user)
    user.refresh_token = refreshToken
    await userRepo.save(user)
    applyTokenToResponse(res, accessToken, refreshToken)
    res.json(user.getUserCredentials())
}

const SECOND = 1000

const loginWithJWT = async (res: Response, _accessToken: string) => {
    const payload = await verifyJwt(_accessToken.replace('Bearer ', ''))
    const expiratinTime = payload?.exp
    if (!payload) {
        throw new HttpError(401, "Failed to verify JWT")
    }
    if (!expiratinTime) {
        throw new HttpError(401, "Token without expiration time")
    }
    if (Date.now() / SECOND > expiratinTime) {
        throw new HttpError(401, "Expired token")
    }
    const userId = payload.id
    const userRepo = Database.getRepository(User)
    const user = await userRepo.findOneBy({ id: userId })
    if (!user) {
        throw new HttpError(401, `Cannot find user with id: ${userId}`)
    }
    const { accessToken, refreshToken } = await authService.issueTokens(user)
    user.refresh_token = refreshToken
    await userRepo.save(user)
    applyTokenToResponse(res, accessToken, refreshToken)
    res.json(user.getUserCredentials())
}