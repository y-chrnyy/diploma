import { Buffer } from "node:buffer";
import { createSecretKey } from "node:crypto";
import bcrypt from "npm:bcryptjs";
const key = 'someBullshit'
const encodedKey = createSecretKey(Buffer.from(key, 'utf-8'))

export const config = {
    accessTokenExp: '24h',
    refreshTokenExp: '72h',
    secret: encodedKey,
    salt: bcrypt.genSaltSync(5)
}

export const HH_API_URL = "https://api.hh.ru";