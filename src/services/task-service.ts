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
import UtilsService from "./utils-service";

@injectable()
export default class TaskService {
    private _repository: Repository<Task>;

	constructor(
        @inject(RepositoryProvider) private _provider: RepositoryProvider,
        @inject(TagService) private _tagService: TagService,
        @inject(UtilsService) private _utils: UtilsService
    ) {
        this._repository = _provider.get(Task);
    }

    /**
     * Gets all tasks or filtered ones if filter is filled
     * @param filter
     * @returns {Task[]}
     */
	public async getAll(filter?: TaskFilter): Promise<Task[]> {
        if (filter) {
            let query = this._repository.createQueryBuilder('task');
            
            if (filter.Tag) query.leftJoinAndSelect('task.Tags', 'tag');
            if (filter.Project) query.leftJoinAndSelect('task.Project', 'project');

            return await this._utils.getFilterQuery(query, filter).getMany();
        } else {
            return await this._repository.find();
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
     * Gets tags for specific task
     * @param ID task ID
     * @returns {ITag[]}
     */
    public async getTags(ID: number): Promise<ITag[]> {
        const task = await this._byIdWithRelations(ID);
        return task.Tags;
    }

    /**
     * Deletes task by ID
     * @param ID task ID
     */
    public async delete(ID: number): Promise<void> {
        const task = await this._byIdWithRelations(ID);

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
            }
        });

        if (!task) {
            throw new NotFoundError(`Task with ID ${ID} doesn't exist`);
        }

        return task;
    }

    /**
     * Gets task by ID with relations
     * @param {number} ID task ID
     * @returns {Task}
     */
    private async _byIdWithRelations(ID: number): Promise<Task> {
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