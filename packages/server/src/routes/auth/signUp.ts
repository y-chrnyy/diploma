import type { RequestHandler } from "express";
import type { AuthPayload } from "../../types/index.ts";
import { authService } from "../../modules/index.ts";
import { applyTokenToResponse } from "./applyTokenToResponse.ts";

const isAuthPayload = (obj: unknown): obj is AuthPayload => {
    if (!obj || typeof obj !== "object") return false

    const typedObj = obj as { [x: string]: unknown }

    return typeof typedObj.password === "string"
        && typeof typedObj.login === 'string'
}


// Работает
export const signUpHandler: RequestHandler = async (req, res) => {
    const authPayload = req.body.authPayload;

    if (!isAuthPayload(authPayload)) {
        console.error(`Invalid payload: ${authPayload}`)
        res.status(400).send('Bad Request. Check if login and password have been provided')
        return
    }

    const { accessToken, refreshToken, userId, login, role } = await authService.signUp(authPayload)

    applyTokenToResponse(res, accessToken, refreshToken)

    res.status(200)
    res.setHeader('Content-type', 'application/json')
    res.send({
        id: userId,
        login,
        role
    })
}