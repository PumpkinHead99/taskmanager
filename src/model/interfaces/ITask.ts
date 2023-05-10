import { Tag } from "../entities/tag";
import { TaskStatus } from "../enums/task-status";

export interface ITask {
    ID: number;
    Description: string;
    Status: TaskStatus;
    Tags?: Tag[];
}