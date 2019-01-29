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
    let query = "select drt.*,oi.service_type,au.real_name ,oi.created_on order_created_on,oi.total_trans_price,oi.total_insure_price ";
    query += " ,oi.send_address,oi.recv_address,oi.remark order_remark,oi.admin_mark";
    query += " from dp_require_task drt left join order_info oi on drt.order_id = oi.id";
    query += " left join admin_user au on oi.admin_id = au.id where 1=1";
    let paramsArray = [],i=0;
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " and drt.order_id = ?";
    }
    if (params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query += " and drt.route_start_id = ?";
    }
    if (params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query += " and drt.route_end_id = ?";
    }
    if (params.serviceType){
        paramsArray[i++] = params.serviceType;
        query += " and oi.service_type = ?";
    }
    if (params.createOrderUserId){
        paramsArray[i++] = params.createOrderUserId;
        query += " and au.id = ?";
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
const getById = (params,callback) => {
    let query = "select * from dp_require_task where 1=1";
    let paramsArray = [],i=0;
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " and order_id = ?";
    }
    if (params.startCity){
        paramsArray[i++] = params.startCity;
        query += " and route_start = ?";
    }
    if (params.endCity){
        paramsArray[i++] = params.endCity;
        query += " and route_end = ?";
    }
    if (params.requireId){
        paramsArray[i] = params.requireId;
        query += " and id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRequireTaskById');
        callback(error,rows);
    })
}
module.exports={
    add,
    getRequireOrder,
    getById
}