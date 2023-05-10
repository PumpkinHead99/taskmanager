/**
* @file tag-service.ts provides function over Tag entity
* @author Adam Baťala
* @copyright 2023
*/

import { injectable, inject } from "inversify";
import { Repository } from "typeorm";
import { Tag } from "../model/entities/tag";
import { ITag } from "../model/interfaces/ITag";
import { NotFoundError } from "../server/errors";
import RepositoryProvider from "../server/repository-provider";

@injectable()
export default class TagService {
    private _repository: Repository<Tag>;

	constructor(
        @inject(RepositoryProvider) private _provider: RepositoryProvider
    ) {
        this._repository = _provider.get(Tag);
    }

    /**
     * Gets all tags
     * @returns {ITag[]}
     */
	public async getAll(): Promise<ITag[]> {
		return this._repository.find();
	}

    /**
     * Creates new tag
     * @param data 
     * @returns {Tag}
     */
	public async create(data: ITag): Promise<Tag> {
        const tag = this._repository.create(data);
        return await this._repository.save(tag);
	}

    /**
     * Gets tag by ID
     * @param ID task ID
     * @returns {Tag}
     */
    public async getByID(ID: number): Promise<Tag> {
        return await this._byId(ID);
    }

    /**
     * Updates existing tag
     * @param data 
     * @returns {Tag}
     */
	public async update(data: ITag): Promise<Tag> {
        const tag = await this._byId(data.ID);
        
        Object.assign(tag, data, {
            Description: data.Name || tag.Name
        });

		return await this._repository.save(tag);
	}

    /**
     * Deletes tag by ID
     * @param ID tag ID
     */
    public async delete(ID: number): Promise<void> {
        const tag = await this._byId(ID);
        await this._repository.delete(tag);
    }

    /**
     * Deletes array of tags
     * @param tags array of tags
     */
    public async deleteTags(tags: Tag[]): Promise<void> {
        await this._repository.remove(tags);
    }

    /**
     * Gets tag by ID
     * @param ID tag ID
     * @returns {Tag}
     */
    private async _byId(ID: number): Promise<Tag> {
        const tag = await this._repository.findOne({
            where: {
                ID: ID
            }
        });

        if (!tag) {
            throw new NotFoundError(`Tag with ID ${ID} doesn't exist`);
        }

        return tag;
    }
}