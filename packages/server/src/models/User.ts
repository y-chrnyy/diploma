import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    REGULAR = "regular",
    ADMIN = "admin"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        "unique": true,
        "type": "varchar"
    })
    login: string;

    @Column({
        "type": "varchar"
    })
    password: string;

    @Column({
        "nullable": true,
        "type": "text"
    })
    refresh_token: string = '';

    @Column({
        type: "text",
        default: UserRole.REGULAR
    })
    role: UserRole;

    constructor(login: string, password: string) {
        this.login = login;
        this.password = password;
        this.role = UserRole.REGULAR;
    }

    getUserCredentials(): UserCredentials {
        return {
            id: this.id,
            login: this.login,
            role: this.role
        }
    }
}

export type UserCredentials = {
    id: number,
    login: string,
    role: UserRole
}
