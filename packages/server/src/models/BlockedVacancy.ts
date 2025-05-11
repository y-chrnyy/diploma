import { Entity, PrimaryColumn } from "npm:typeorm";

@Entity()
export class BlockedVacancy {
    @PrimaryColumn()
    vacancyId: string;

    constructor(vacancyId: string) {
        this.vacancyId = vacancyId;
    }
} 