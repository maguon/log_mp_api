'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RequireTaskDAO.js');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) => {
    let query = "insert into dp_require_task (order_id,route_start,route_end,route_start_id,route_end_id,date_id,car_num)";
    query += " values (?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.routeStart;
    paramsArray[i++] = params.routeEnd;
    paramsArray[i++] = params.routeStartId;
    paramsArray[i++] = params.routeEndId;
    paramsArray[i++] = params.dateId;
    paramsArray[i] = params.carNum;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRequireTask');
        callback(error,rows);
    })
}
const getRequireOrder = (params,callback) => {
    let query = "select ";
    query += " values (?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.routeStart;
    paramsArray[i++] = params.routeEnd;
    paramsArray[i++] = params.routeStartId;
    paramsArray[i++] = params.routeEndId;
    paramsArray[i++] = params.dateId;
    paramsArray[i] = params.carNum;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRequireTask');
        callback(error,rows);
    })
}
module.exports={
    add,
    getRequireOrder
}