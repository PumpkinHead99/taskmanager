/**
* @file error-handler.ts handles error responses
* @author Adam Baťala
* @copyright 2023
*/

import { IServerError, ServerError } from "./errors";

export default (err: any, res: any): void => {
	let data: IServerError = {
		status: err.status || 500,
		message: err.message || "",
		details: err.details || ""
	};

	if (err instanceof ServerError) {
		data = err.asObject();
	} else if (err instanceof Error) {
		data.message = err.message;
	} else if (typeof err === "string") {
		data.message = err;
	}

	res.status(data.status).json(data);
};