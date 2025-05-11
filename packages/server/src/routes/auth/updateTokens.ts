import type { RequestHandler } from "express";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import { verifyJwt } from "../../utils/jwt.ts";
import { Database } from "../../models/index.ts";
import { User } from "../../models/User.ts";
import { authService } from "../../modules/index.ts";
import { applyTokenToResponse } from "./index.ts";

// Работает
export const updateAccessTokenHandler: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies["Refresh"]

    if (!refreshToken) {
        console.error(`Failed to get refresh token: ${refreshToken}`)
        throw new HttpError(401, 'Unauthorized')
    }

    const userCredentials = await verifyJwt(refreshToken)
    const id = userCredentials?.id || -1

    const user = await Database.getRepository(User).findOneBy({ id })

    if (!user || user.refresh_token !== refreshToken) {
        throw new HttpError(401, 'Unauthorized')
    }


    const { refreshToken: newRefreshToken, accessToken } = await authService.issueTokens(user)

    applyTokenToResponse(res, accessToken, newRefreshToken)
    user.refresh_token = newRefreshToken
    await Database.getRepository(User).save(user)

    res.status(200).send({
        code: 200,
        status_text: "Success",
        data: user.getUserCredentials()
    })
}