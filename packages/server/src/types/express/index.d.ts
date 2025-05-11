import { UserCredentials } from "../../models/User.ts";

declare global {
    namespace Express {
        interface Request {
            user?: UserCredentials & {
                access: string
                refresh: string | null
            }
        }
    }
}
export { }