import type { RequestHandler } from "npm:express";
import { Database } from "../../models/index.ts";
import { User } from "../../models/User.ts";

export const logoutHandler: RequestHandler = async (req, res) => {
    const id = req.user?.id;
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