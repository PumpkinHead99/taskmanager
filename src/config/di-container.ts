/**
* @file di-container.ts provides inversify container
* @author Adam Baťala
* @copyright 2023
*/

import "reflect-metadata";
import { Container, interfaces } from "inversify";

export default class DIContainer {
	public static container: Container;

	public static configure(): Container {
		this.container = new Container({
			autoBindInjectable: true
		});

		return this.container;
	}

	public static get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
		return this.container.get(serviceIdentifier);
	}
}