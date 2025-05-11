import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "npm:typeorm";
import { User } from "./User.ts";

@Entity()
export class ViewedVacancy {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    vacancyId: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    constructor(userId: number, vacancyId: string) {
        this.userId = userId;
        this.vacancyId = vacancyId;
    }
} 