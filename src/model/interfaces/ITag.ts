import { Task } from "../entities/task";

export interface ITag {
    ID: number;
    Name: string;
    Task?: Task;
}

export interface TagFilter {
    ID?: number;
    Name?: string;
    Task?: Task;
}