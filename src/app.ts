import "reflect-metadata";
import DIContainer from "./config/di-container";
import Initializer from "./initializer";

const container = DIContainer.configure();
const initializer = container.get(Initializer);

initializer.start(container);