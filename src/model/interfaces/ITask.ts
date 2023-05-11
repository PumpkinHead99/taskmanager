import { Project } from "../entities/project";
import { Tag } from "../entities/tag";
import { TaskStatus } from "../enums/task-status";

export interface ITask {
    ID: number;
    Description: string;
    Status: TaskStatus;
    Tags?: Tag[];
}

export interface TaskFilter {
    ID?: number;
    Description?: string;
    Status?: TaskStatus;
    Tag?: Tag;
    Project?: Project;
}