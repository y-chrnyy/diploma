import type { RequestHandler } from "express";
import { verifyJwt } from "../utils/index.ts";
import { Database } from "../models/index.ts";
import { User } from "../models/User.ts";
import { UserType } from "../types/index.ts";


// работает
export const AuthOnlyMiddleware: RequestHandler = async (req, res, next) => {
    const { Authorization: auth, Refresh: refresh } = req.cookies;

    if (!auth) {
        console.error(`Authorization header is not found: ${JSON.stringify(req.cookies)}`);
        res.status(403).json({
            err_code: "403",
            status_text: "Forbidden"
        });
        return;
    }

    const authToken = auth.replace('Bearer ', "");
    const userPayload = await verifyJwt(authToken);
    const userId = userPayload?.id;

    if (!userId) {
        res.status(403).json({
            err_code: "403",
            status_text: "Forbidden"
        });
        return;
    }

    const userRepo = Database.getRepository(User);
    const user = await userRepo.findOneBy({
        id: userId
    });

    if (user === null) {
        console.error(`Failed to find user by id: ${userId}`);
        res.status(403).json({
            err_code: "403",
            status_text: "Forbidden"
        });
        return;
    }

    (req as unknown as Request & {
        user?: UserType
    }).user = {
        ...user.getUserCredentials(),
        access: authToken,
        refresh: refresh?.replace("Bearer ", "")
    };
    next();
}