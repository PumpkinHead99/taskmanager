/**
* @file task-service.ts provides function over Task entity
* @author Adam Baťala
* @copyright 2023
*/

import { injectable, inject } from "inversify";
import { Repository } from "typeorm";
import { Task } from "../model/entities/task";
import { ITag } from "../model/interfaces/ITag";
import { ITask, TaskFilter } from "../model/interfaces/ITask";
import { NotFoundError, ServerError } from "../server/errors";
import RepositoryProvider from "../server/repository-provider";
import TagService from "./tag-service";

@injectable()
export default class TaskService {
    private _repository: Repository<Task>;

	constructor(
        @inject(RepositoryProvider) private _provider: RepositoryProvider,
        @inject(TagService) private _tagService: TagService,
    ) {
        this._repository = _provider.get(Task);
    }

    /**
     * Gets all tasks
     * @returns {Task[]}
     */
	public async getAll(filter?: TaskFilter): Promise<Task[]> {
        if (filter) {
            let query = this._repository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.Tags', 'tag');

            Object.entries(filter).map(([key, val], index) => {
                let filter = "";
                let parameter;
                if (key === "Tag") {
                    Object.entries(filter[key]).map()
                    filter = `task.${key} = :param`;
                    parameter = val;
                } else {
                    filter = `tag.${key} = :param`;
                }

                filter.length > 0 ? index === 0 ? query.where(filter, { param: val }) : query.orWhere(filter, { param: val }) : null;
            });
            
            return await query.getMany();
        } else {
            return await this._repository.find();
        }
	}

    private getFilterString(key: string, value: string): string {
        switch (key) {
            case "Description":
                return `task.${key}`
        }
    }

    /**
     * Creates new task
     * @param data 
     * @returns {Task}
     */
	public async create(data: ITask): Promise<Task> {
        const task = this._repository.create(data);
		return await this._repository.save(task);
	}

    /**
     * Gets task by ID
     * @param {number} ID task ID
     * @returns {Task}
     */
    public async getByID(ID: number): Promise<Task> {
        return await this._byId(ID);
    }

    /**
     * Updates existing task
     * @param {ITask} data 
     * @returns {Task}
     */
	public async update(data: ITask): Promise<Task> {
        const task = await this._byId(data.ID);
        
        Object.assign(task, data, {
            Description: data.Description || task.Description,
            Status: data.Status || task.Status,
            Tags: data.Tags || task.Tags
        });

		return await this._repository.save(task);
	}

    /**
     * Adds tag to existing task
     * @param ID task ID
     * @param data new tag
     * @returns 
     */
    public async addTag(ID: number, data: ITag): Promise<Task> {
        const task = await this._byId(ID);

        if (task.Tags.length >= 100) {
            throw new ServerError("Task cannot have more than 100 tags");
        }

        const tag = await this._tagService.create(data);
        task.Tags.push(tag);

        return await this.update(task);
    }

    /**
     * Deletes task by ID
     * @param ID task ID
     */
    public async delete(ID: number): Promise<void> {
        const task = await this._byId(ID);

        if (task.Tags.length > 0) {
            this._tagService.deleteTags(task.Tags);
        }

        await this._repository.remove(task);
    }

    /**
     * Gets task by ID
     * @param {number} ID task ID
     * @returns {Task}
     */
    private async _byId(ID: number): Promise<Task> {
        const task = await this._repository.findOne({
            where: {
                ID: ID
            },
            relations: ["Tags"]
        });

        if (!task) {
            throw new NotFoundError(`Task with ID ${ID} doesn't exist`);
        }

        return task;
    }
}