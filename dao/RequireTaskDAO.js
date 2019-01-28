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
    let query = "select drt.*,oi.service_type,au.real_name from dp_require_task drt ";
    query += " left join order_info oi on drt.order_id = oi.id";
    query += " left join admin_user au on oi.admin_id = au.id where 1=1";
    let paramsArray = [],i=0;
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " drt.order_id = ?";
    }
    if (params.startCity){
        paramsArray[i++] = params.startCity;
        query += " drt.route_start = ?";
    }
    if (params.endCity){
        paramsArray[i++] = params.endCity;
        query += " drt.route_end = ?";
    }
    if (params.serviceType){
        paramsArray[i++] = params.serviceType;
        query += " oi.service_type = ?";
    }
    if (params.createOrderUser){
        paramsArray[i++] = params.createOrderUser;
        query += " au.real_name = ?";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(drt.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(drt.created_on,'%Y-%m-%d') <= ? ";
    }

    query = query + " order by drt.created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    paramsArray[i] = params.carNum;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRequireOrder');
        callback(error,rows);
    })
}
module.exports={
    add,
    getRequireOrder
}