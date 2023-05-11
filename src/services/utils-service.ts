/**
* @file utils-service.ts provides utility functions
* @author Adam Baťala
* @copyright 2023
*/

import { injectable } from "inversify";
import { SelectQueryBuilder } from "typeorm";

@injectable()
export default class UtilsService {

    /**
     * Creates query to filter entity by correct parameters
     * @param query 
     * @param filter 
     * @returns {SelectQueryBuilder<any>} query with correct filters
     */
    public getFilterQuery(query: SelectQueryBuilder<any>, filter: Object): SelectQueryBuilder<any> {
        const filters = new Map();
        Object.entries(filter).map(([key, val]) => {
            if (typeof val === 'object') {
                const entity = key.toLowerCase();
                Object.entries(filter[key]).map(([key, val]) => {
                    filters.set(`${entity}.${key} = :param`, val);
                });
            } else {
                filters.set(`entity.${key} = :param`, val);
            }
        });

        
        let index = 0
        for (let [filter, param] of filters.entries()) {
            index === 0 ? query.where(filter, { param: param }) : query.orWhere(filter, { param: param });
            index++;
        }

        return query;
    }

}