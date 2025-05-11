import type { RequestHandler } from "express";
import { verifyJwt } from "../utils/index.ts";
import { Database } from "../models/index.ts";
import { User } from "../models/User.ts";


// работает
export const AuthOnlyMiddleware: RequestHandler = async (req, res, next) => {
    const { Authorization: auth, Refresh: refresh } = req.cookies as Record<string, number | string | boolean | null>

    if (!auth || typeof auth !== 'string') {
        console.error(`Authorization header is not found: ${req.cookies.toString()}`)
        res.status(403)
            .setHeader('Content-type', 'application/json')
            .send({
                err_code: "403",
                status_text: "Forbidden"
            })
        return
    }

    const authToken = auth.replace('Bearer ', "")
    const userPayload = await verifyJwt(authToken)
    const userId = userPayload?.id

    if (!userId) {
        res.status(403)
            .setHeader('Content-type', 'application/json')
            .send({
                err_code: "403",
                status_text: "Forbidden"
            })
        return
    }

    const userRepo = Database.getRepository(User)
    const user = await userRepo.findOneBy({
        "id": userId
    })

    if (user === null) {
        console.error(`Failed to fynd user by id: ${userId}`)
        res.status(403)
            .setHeader('Content-type', 'application/json')
            .send({
                err_code: "403",
                status_text: "Forbidden"
            })
        return
    }

    req.user = {
        ...user,
        access: authToken,
        refresh: typeof refresh === "string" ? refresh.replace("Bearer ", "") : null
    }
    next()
}