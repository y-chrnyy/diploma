import type { RequestHandler } from "npm:express";
import { HttpError } from "../../middleware/errorMiddleware.ts";
import { Database } from "../../models/index.ts";
import { User } from "../../models/User.ts";


export const deleteUserHandler: RequestHandler = async (req, res) => {
    const id = req.user?.id

    if (!id) {
        console.error(`Failed to delete user: ${id}`)
        throw new HttpError(400, 'Bad request')
    }

    try {
        await Database.getRepository(User).delete({ id })
        res.status(201).send({
            code: 201,
            status_text: "OK"
        })
    } catch (error) {
        console.error(error)
        throw new HttpError(500, 'Failed to delete user')
    }
}