import { DataSource } from "npm:typeorm";
import path from 'node:path'
import { User } from "./User.ts";
import { FavoriteVacancy } from "./FavoriteVacancy.ts";
import { ViewedVacancy } from "./ViewedVacancy.ts";
import { BlockedVacancy } from "./BlockedVacancy.ts";

const dir = import.meta.dirname

if (!dir) {
    throw new Error('Failed to get current directory')
}

const database = path.resolve(dir, '../../db.sql')

export const Database = new DataSource({
    "type": "sqlite",
    entities: [User, FavoriteVacancy, ViewedVacancy, BlockedVacancy],
    synchronize: true,
    database,
    migrations: []
})

