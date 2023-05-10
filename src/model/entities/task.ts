import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../enums/task-status";
import { Project } from "./project";
import { Tag } from "./tag";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    Description: string;

    @Column({
        type: "enum",
        enum: TaskStatus,
        default: TaskStatus.NEW
    })
    Status: TaskStatus;

    @OneToMany(() => Tag, tag => tag.Task, {
        cascade: true,
    })
    Tags: Tag[];

    @ManyToOne(() => Project, project => project.Tasks)
    Project: Project;
}