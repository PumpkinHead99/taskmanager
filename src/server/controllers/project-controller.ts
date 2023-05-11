import { BaseHttpController, httpDelete, httpGet, httpPost, httpPut, requestBody, requestParam } from "inversify-express-utils";
import { controller } from "inversify-express-utils";
import { inject } from "inversify";
import { results } from "inversify-express-utils";
import ProjectService from "../../services/project-service"
import { IProject, ProjectFilter } from "../../model/interfaces/IProject";
import CONST from "../../config/constants";
import { ITask } from "../../model/interfaces/ITask";

@controller("/Project")
export default class ProjectController extends BaseHttpController {
    constructor(
		@inject(ProjectService) private _service: ProjectService
	) {
        super();
	}

    @httpGet("/")
	public async getAll(@requestBody() data?: ProjectFilter): Promise<results.JsonResult> {
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

    @httpGet("/:id/getTasks")
	public async getTasks(@requestParam("id") id: number): Promise<results.JsonResult> {
		return this.json(
			await this._service.getTasks(id)
		);
	}

    @httpPut("/")
	public async update(@requestBody() data: IProject): Promise<results.JsonResult> {
		return this.json(
			await this._service.update(data)
		);
	}

    @httpPost("/")
	public async create(@requestBody() data: IProject): Promise<results.JsonResult> {
		return this.json(
			await this._service.create(data)
		);
	}

    @httpPost("/addTask/:id")
	public async addTask(@requestParam("id") id: number, @requestBody() data: ITask): Promise<results.JsonResult> {
		return this.json(
			await this._service.addTask(id, data)
		);
	}

    @httpDelete("/:id")
	public async delete(@requestParam("id") id: number): Promise<results.StatusCodeResult> {
		await this._service.delete(id);
		return this.statusCode(CONST.HTTP_RESPONSE_CODES.OK);
	}
}