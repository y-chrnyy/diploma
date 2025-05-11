import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class BlockedVacancy {
    @PrimaryColumn({ type: "varchar" })
    vacancyId!: string;

    constructor(vacancyId: string) {
        this.vacancyId = vacancyId;
    }
} 