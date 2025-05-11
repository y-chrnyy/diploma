import { DataSource, Repository } from "npm:typeorm";
import { User } from "../models/User.ts";
import { signJwt } from "../utils/index.ts";
import { AuthPayload } from "../types/index.ts";
import bcrypt from "npm:bcryptjs"
import { config } from "../config/index.ts";
import { HttpError } from "../middleware/index.ts";


export class AuthService {
    db: DataSource
    userRepo: Repository<User>

    constructor(db: DataSource) {
        this.db = db
        this.userRepo = db.getRepository(User)
    }

    async issueTokens(user: User) {
        const accessToken = await signJwt(user.getUserCredentials(), 'access')
        const refreshToken = await signJwt(user.getUserCredentials(), 'refresh')

        return {
            accessToken,
            refreshToken
        }
    }

    /**
     * Принимает данные пользователя и возвращает JWT токены и ID пользоватея
     */
    async signUp(authPayload: AuthPayload) {
        const hashedPassword = await bcrypt.hash(authPayload.password, config.salt)

        const user = new User(authPayload.login, hashedPassword)

        const userWithSameLogin = await this.db.getRepository(User).findOneBy({ login: authPayload.login })

        if (userWithSameLogin !== null) {
            throw new HttpError(409, 'Login is already taken')
        }

        const result = await this.db.getRepository(User).save(user)

        const { accessToken, refreshToken } = await this.issueTokens(result)

        user.refresh_token = refreshToken
        await this.db.getRepository(User).save(user)

        return {
            userId: result.id,
            login: result.login,
            role: result.role,
            accessToken,
            refreshToken
        }
    }

    /**
     * Сравнивает пароль и хэшированный пароль
     * @param password 
     */
    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    }
}