import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    Name: string;

    @Column()
    Description: string;

    @Column()
    Date: Date;

    @OneToMany(() => Task, task => task.Project, {
        cascade: true,
    })
    Tasks: Task[];
}