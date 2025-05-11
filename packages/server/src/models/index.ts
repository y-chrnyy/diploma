import { DataSource } from "typeorm";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { User } from "./User.ts";
import { FavoriteVacancy } from "./FavoriteVacancy.ts";
import { ViewedVacancy } from "./ViewedVacancy.ts";
import { BlockedVacancy } from "./BlockedVacancy.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const database = path.resolve(__dirname, '../../../db.sql');

export const Database = new DataSource({
    "type": "sqlite",
    entities: [User, FavoriteVacancy, ViewedVacancy, BlockedVacancy],
    synchronize: true,
    database,
    migrations: []
});

