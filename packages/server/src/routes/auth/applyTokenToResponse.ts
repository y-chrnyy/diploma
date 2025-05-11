import type { Response } from "express";

export const applyTokenToResponse = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie('Authorization', `Bearer ${accessToken}`, {
        "httpOnly": true,
        // Пока тестирую локально нужно ставить в none
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30,
    })

    res.cookie('Refresh', refreshToken, {
        'httpOnly': true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30,
    })
}