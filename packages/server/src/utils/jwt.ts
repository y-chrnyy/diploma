import { SignJWT, jwtVerify } from "npm:jose"
import { config } from "../config/index.ts";
import type { User } from "../models/User.ts";

export const signJwt = async (payload: Record<string, string | number | boolean>, type: 'access' | 'refresh') => {
    const jwt = await new SignJWT(payload)
        .setExpirationTime(config[`${type}TokenExp`])
        .setProtectedHeader({ "alg": "HS256", typ: "JWT" })
        .setIssuedAt()
        .sign(config.secret)

    return jwt
}

export const verifyJwt = async (token: string) => {
    try {
        const data = await jwtVerify<User>(token, config.secret, {
            algorithms: ["HS256"]
        })

        return data.payload
    } catch (error) {
        console.error(`Failed to verify JWT: ${error}`)
        return null
    }
}