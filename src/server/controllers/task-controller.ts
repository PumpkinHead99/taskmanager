import { BaseHttpController, httpDelete, httpGet, httpPost, httpPut, requestBody, requestParam } from "inversify-express-utils";
import { controller } from "inversify-express-utils";
import { inject } from "inversify";
import { results } from "inversify-express-utils";
import CONST from "../../config/constants";
import TaskService from "../../services/task-service";
import { ITask, TaskFilter } from "../../model/interfaces/ITask";
import { ITag } from "../../model/interfaces/ITag";

@controller("/Task")
export default class TaskController extends BaseHttpController {
    constructor(
		@inject(TaskService) private _service: TaskService
	) {
        super();
	}

    @httpGet("/")
	public async getAll(@requestBody() data?: TaskFilter): Promise<results.JsonResult> {
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
	public async update(@requestBody() data: ITask): Promise<results.JsonResult> {
		return this.json(
			await this._service.update(data)
		);
	}

    @httpPost("/")
	public async create(@requestBody() data: ITask): Promise<results.JsonResult> {
		return this.json(
			await this._service.create(data)
		);
	}

    @httpPost("/addTag/:id")
	public async addTag(@requestParam("id") id: number, @requestBody() data: ITag): Promise<results.JsonResult> {
		return this.json(
			await this._service.addTag(id, data)
		);
	}

    @httpDelete("/:id")
	public async delete(@requestParam("id") id: number): Promise<results.StatusCodeResult> {
		await this._service.delete(id);
		return this.statusCode(CONST.HTTP_RESPONSE_CODES.OK);
	}
}