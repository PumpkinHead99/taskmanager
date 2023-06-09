import { Task } from "../entities/task";

export interface IProject {
    ID: number;
    Name: string;
    Description: string;
    Date: Date;
    Tasks?: Task[];
}

export interface ProjectFilter {
    ID?: number;
    Name?: string;
    Description?: string;
    Date?: Date;
    Task?: Task;
}