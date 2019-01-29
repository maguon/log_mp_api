'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('LoadTaskDAO.js');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) => {
    let query = "insert into dp_load_task (admin_id,order_id,route_start,route_end,route_start_id,route_end_id,require_id,supplier_id,plan_date_id,trans_type";
    if (params.remark){
        query += ",remark";
    }
    query += ") values (?,?,?,?,?,?,?,?,?,?"
    if (params.remark){
        query += ",?"
    }
    query += ")";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.routeStart;
    paramsArray[i++] = params.routeEnd;
    paramsArray[i++] = params.routeStartId;
    paramsArray[i++] = params.routeEndId;
    paramsArray[i++] = params.requireId;
    paramsArray[i++] = params.supplierId;
    paramsArray[i++] = params.planDateId;
    paramsArray[i++] = params.transType;
    if (params.remark){
        paramsArray[i] = params.remark;
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addLoadTask');
        callback(error,rows);
    })
}
const getById = (params,callback) => {
    let query = "select * from dp_load_task where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskId){
        paramsArray[i] = params.loadTaskId;
        query += " and id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLoadTaskById');
        callback(error,rows);
    })
}
const updateById =(params,callback) => {
    let query = "update dp_load_task set id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.loadTaskId;
    if (params.carNum){
        paramsArray[i++] = params.carNum;
        query += " ,car_count = ?";
    }
    paramsArray[i] = params.loadTaskId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateLoadTaskById');
        callback(error,rows);
    })
}
module.exports={
    add,getById,updateById
}