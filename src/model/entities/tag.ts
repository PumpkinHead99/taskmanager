import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    Name: string;

    @ManyToOne(() => Task, task => task.Tags)
    Task: Task;
}