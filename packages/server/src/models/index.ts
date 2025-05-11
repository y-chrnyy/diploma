import { DataSource } from "typeorm";
import path from 'node:path';
import { User } from "./User.ts";
import { FavoriteVacancy } from "./FavoriteVacancy.ts";
import { ViewedVacancy } from "./ViewedVacancy.ts";
import { BlockedVacancy } from "./BlockedVacancy.ts";

// Используем __dirname для Node.js
const database = path.resolve(__dirname, '../../../db.sql');

export const Database = new DataSource({
    "type": "sqlite",
    entities: [User, FavoriteVacancy, ViewedVacancy, BlockedVacancy],
    synchronize: true,
    database,
    migrations: []
});

