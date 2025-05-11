import { DataSource } from "typeorm";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from "../config/index";
import { User } from "./User";
import { FavoriteVacancy } from "./FavoriteVacancy";
import { ViewedVacancy } from "./ViewedVacancy";
import { BlockedVacancy } from "./BlockedVacancy";

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

