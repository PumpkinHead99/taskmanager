import { BaseHttpController, httpDelete, httpGet, httpPost, httpPut, requestBody, requestParam } from "inversify-express-utils";
import { controller } from "inversify-express-utils";
import { inject } from "inversify";
import { results } from "inversify-express-utils";
import CONST from "../../config/constants";
import TagService from "../../services/tag-service";
import { ITag, TagFilter } from "../../model/interfaces/ITag";

@controller("/Tag")
export default class TagController extends BaseHttpController {
    constructor(
		@inject(TagService) private _service: TagService
	) {
        super();
	}

    @httpGet("/")
	public async getAll(@requestBody() data?: TagFilter): Promise<results.JsonResult> {
		return this.json(
			await this._service.getAll(data)
		);
	}

    @httpGet("/:id")
	public async getByID(@requestParam("id") id: number): Promise<results.JsonResult> {
		return this.json(
			await this._service.getByID(id)
		);
	}

    @httpPut("/")
	public async update(@requestBody() data: ITag): Promise<results.JsonResult> {
		return this.json(
			await this._service.update(data)
		);
	}

    @httpPost("/")
	public async create(@requestBody() data: ITag): Promise<results.JsonResult> {
		return this.json(
			await this._service.create(data)
		);
	}

    @httpDelete("/:id")
	public async delete(@requestParam("id") id: number): Promise<results.StatusCodeResult> {
		await this._service.delete(id);
		return this.statusCode(CONST.HTTP_RESPONSE_CODES.OK);
	}
}