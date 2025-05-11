import { SignJWT, jwtVerify } from 'jose';
import { config } from "../config/index.ts";
import type { User } from "../models/User.ts";
import type { JWTVerifyResult } from 'jose';

// Добавляем тип для JWT payload
type JWTPayload = User & {
    exp?: number;
    iat?: number;
};

export const signJwt = async (payload: Record<string, string | number | boolean>, type: 'access' | 'refresh') => {
    const jwt = await new SignJWT(payload)
        .setExpirationTime(config[`${type}TokenExp`])
        .setProtectedHeader({ "alg": "HS256", typ: "JWT" })
        .setIssuedAt()
        .sign(config.secret)

    return jwt
}

export const verifyJwt = async (token: string): Promise<JWTPayload | null> => {
    try {
        const data = await jwtVerify(token, config.secret, {
            algorithms: ["HS256"]
        }) as JWTVerifyResult & { payload: JWTPayload };

        return data.payload;
    } catch (error) {
        console.error(`Failed to verify JWT: ${error}`)
        return null
    }
}

export const generateTokens = async (payload: Record<string, string | number | boolean>, type: 'access' | 'refresh') => {
    return await signJwt(payload, type);
}