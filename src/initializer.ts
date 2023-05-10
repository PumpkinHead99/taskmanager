/**
* @file initializer.ts starts server
* @author Adam Baťala
* @copyright 2023
*/

import { injectable, Container } from "inversify";
import Server from "./server/server";
import CONST from "./config/constants";
import { DataSource } from "typeorm";
import RepositoryProvider from "./server/repository-provider";
import { Project } from "./model/entities/project";
import { Task } from "./model/entities/task";
import { Tag } from "./model/entities/tag";

@injectable()
export default class Initializer {
    public async start(container: Container): Promise<void> {
		await this.startDatabase();
		await this.startServer(container);
	}

    private async startDatabase(): Promise<void> {
		const dataSource = new DataSource({
            name: "default",
            type: "postgres",
            host: CONST.DATABASE.HOST,
            username: CONST.DATABASE.USER,
            port: CONST.DATABASE.PORT,
            password: CONST.DATABASE.PASSWORD,
            database: CONST.DATABASE.DB_NAME,
            synchronize: true,
            logging: false,
            entities: [
                Project,
                Task,
                Tag
            ]
        });
        await RepositoryProvider.configure(dataSource);
        await dataSource.initialize();
	}

	private async startServer(container: Container): Promise<void> {
		const server = new Server(container, null, {
			rootPath: "/api/v1"
		});
		
		server.start(CONST.SERVER.PORT);
	}
}