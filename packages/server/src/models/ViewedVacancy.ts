import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.ts";

@Entity()
export class ViewedVacancy {
    @PrimaryColumn({ type: "int" })
    userId!: number;

    @PrimaryColumn({ type: "varchar" })
    vacancyId!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;

    constructor(userId: number, vacancyId: string) {
        this.userId = userId;
        this.vacancyId = vacancyId;
    }
} 