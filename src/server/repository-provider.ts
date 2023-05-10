/**
* @file repository-provider.ts provides repository for entities from datasource
* @author Adam Baťala
* @copyright 2023
*/

import * as typeorm from "typeorm";
import { injectable } from "inversify";
import { DataSource } from "typeorm";

export class Repository<T> extends typeorm.Repository<T> { }

@injectable()
export default class RepositoryProvider {
	private static _dataSource: DataSource

	public static configure(dataSource: DataSource) {
		this._dataSource = dataSource
	}

	public get<T>(repoType: new () => T): Repository<T> {
		return RepositoryProvider._dataSource.getRepository(repoType);
	}
}