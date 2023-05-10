/**
* @file project-service.ts provides function over Project entity
* @author Adam Baťala
* @copyright 2023
*/

import { injectable, inject } from "inversify";
import { Repository } from "typeorm";
import { Project } from "../model/entities/project";
import { IProject } from "../model/interfaces/IProject";
import { ITask } from "../model/interfaces/ITask";
import { NotFoundError } from "../server/errors";
import RepositoryProvider from "../server/repository-provider";
import TaskService from "./task-service";

@injectable()
export default class ProjectService {
    private _repository: Repository<Project>;

	constructor(
        @inject(RepositoryProvider) private _provider: RepositoryProvider,
        @inject(TaskService) private _taskService: TaskService
    ) {
        this._repository = _provider.get(Project);
    }

    /**
     * Gets all projects
     * @returns {Project[]}
     */
	public async getAll(): Promise<Project[]> {
		return this._repository.find();
	}

    /**
     * Creates new project
     * @param data 
     * @returns {Project}
     */
	public async create(data: IProject): Promise<Project> {
        const project = this._repository.create(data);
		return await this._repository.save(project);
	}

    /**
     * Gets project by ID
     * @param ID project ID
     * @returns {Project}
     */
    public async getByID(ID: number): Promise<Project> {
        return await this._byId(ID);
    }

   /**
    * Deletes project by ID
    * @param ID project ID
    */
    public async delete(ID: number): Promise<void> {
        const project = await this._byId(ID);
        
        if (project.Tasks.length > 0) {
            for (let i = 0; i < project.Tasks.length; i++) {
                await this._taskService.delete(project.Tasks[i].ID);
            }
        }
        
        await this._repository.remove(project);
    }

    /**
     * Updates existing project
     * @param data 
     * @returns {Project}
     */
	public async update(data: IProject): Promise<Project> {
        const project = await this._byId(data.ID);
        
        Object.assign(project, data, {
            Name: data.Name || project.Name,
            Description: data.Description || project.Description,
            Date: data.Date || project.Date
        });

		return await this._repository.save(project);
	}

    /**
     * Adds task to existing project
     * @param ID task ID
     * @param data new tag
     * @returns 
     */
    public async addTask(ID: number, data: ITask): Promise<Project> {
        const project = await this._byId(ID);
        const tag = await this._taskService.create(data);

        project.Tasks.push(tag);

        return await this.update(project);
    }

    /**
     * Gets project by ID
     * @param ID project ID
     * @returns 
     */
    private async _byId(ID: number): Promise<Project> {
        const project = await this._repository.findOne({
            where: {
                ID: ID
            },
            relations: ["Tasks"]
        });

        if (!project) {
            throw new NotFoundError(`Project with ID ${ID} doesn't exist`);
        }

        return project;
    }
}