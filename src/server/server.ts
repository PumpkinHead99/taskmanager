/**
* @file server.ts server class that creates inversify express server
* @author Adam Baťala
* @copyright 2023
*/

import cors from "cors";
import express from "express";
import errorHandler from "./error-handler";
import { InversifyExpressServer } from "inversify-express-utils";

/** Controllers **/
import "./controllers"

export default class Server extends InversifyExpressServer {
    public start(port: number): void {
        this.setConfig((app) => {
            app.use(cors());
            app.use(express.static("public"));
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
        });

        this.setErrorConfig((app) => {
            app.use(errorHandler);
        });

        let app = this.build();
        
        app.listen(port, () => {
            return console.log(`server is listening on ${port}`);
        });
    }
}