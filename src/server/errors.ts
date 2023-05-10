/**
* @file errors.ts provides error types
* @author Adam Baťala
* @copyright 2023
*/

import CONST from "../config/constants";

export interface IServerError {
	status: number;
	message: string;
	details: string;
}

export class ServerError {
	public status: number = CONST.HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR;

	constructor(public message: string, public details: string = "") { }

	public asObject(): IServerError {
		return {
			status: this.status,
			message: this.message,
			details: this.details
		};
	}
}

export class NotFoundError extends ServerError {
	public status: number = CONST.HTTP_RESPONSE_CODES.NOT_FOUND;
}

export class BadRequestError extends ServerError {
	public status: number = CONST.HTTP_RESPONSE_CODES.BAD_REQUEST;
}

export class UnauthorizedError extends ServerError {
	public status: number = CONST.HTTP_RESPONSE_CODES.UNAUTHORIZED;
}

export class ConflictError extends ServerError {
	public status: number = CONST.HTTP_RESPONSE_CODES.CONFLICT;
}