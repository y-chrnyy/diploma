import type { RequestHandler } from "express";
import { Database } from "../../models/index.ts";
import { User } from "../../models/User.ts";
import { UserType } from "../../types/index.ts";
export const logoutHandler: RequestHandler = async (req, res) => {
    const id = (req as unknown as Request & { user?: UserType }).user?.id;
    if (!id) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const userRepo = Database.getRepository(User);
    const user = await userRepo.findOneBy({ id });
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    user.refresh_token = '';
    await userRepo.save(user);
    res.cookie('Authorization', '', { maxAge: 0 });
    res.cookie('Refresh', '', { maxAge: 0 });
    res.status(200).json({ message: "Successfully logged out" });
} 