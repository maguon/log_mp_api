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
    if (params.carNum || params.carNum == 0){
        paramsArray[i++] = params.carNum;
        query += " ,car_count = ?";
    }
    if (params.supplierTransPrice || params.supplierTransPrice ==0){
        paramsArray[i++] = params.supplierTransPrice;
        query += " ,supplier_trans_price = ?";
    }
    if (params.supplierInsurePrice || params.supplierInsurePrice ==0){
        paramsArray[i++] = params.supplierInsurePrice;
        query += " ,supplier_insure_price = ?";
    }
    if (params.hookId){
        paramsArray[i++] = params.hookId;
        query += " ,hook_id = ?";
    }
    if (params.routeStart){
        paramsArray[i++] = params.routeStart;
        query += " ,route_start = ?";
    }
    if (params.routeEnd){
        paramsArray[i++] = params.routeEnd;
        query += " ,route_end = ?";
    }
    if (params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query += " ,route_start_id = ?";
    }
    if (params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query += " ,route_end_id = ?";
    }
    if (params.supplierId){
        paramsArray[i++] = params.supplierId;
        query += " ,supplier_id = ?";
    }
    if (params.transType){
        paramsArray[i++] = params.transType;
        query += " ,trans_type = ?";
    }
    if (params.planDateId){
        paramsArray[i++] = params.planDateId;
        query += " ,plan_date_id = ?";
    }
    if (params.remark){
        paramsArray[i++] = params.remark;
        query += " ,remark = ?";
    }
    if (params.status){
        paramsArray[i++] = params.status;
        query += " ,load_task_status = ?";
    }
    paramsArray[i] = params.loadTaskId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateLoadTaskById');
        callback(error,rows);
    })
}
const getLoadTaskWithDetail = (params,callback) => {
    let query = "select dlt.*,dltd.id detail_id,dltd.order_item_id, dltd.vin,dltd.supplier_id,dltd.status,";
    query += "dltd.supplier_trans_price detail_supplier_trans_price,dltd.supplier_insure_price detail_supplier_insure_price,dltd.hook_id detail_hook_id";
    query += " from dp_load_task dlt";
    query += " left join dp_load_task_detail dltd on dlt.id = dltd.dp_load_task_id where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskId){
        paramsArray[i++] = params.loadTaskId;
        query += " and dlt.id = ?";
    }
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " and dlt.order_id = ?";
    }
    if (params.requireId){
        paramsArray[i] = params.requireId;
        query += " and dlt.require_id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLoadTaskWithDetail');
        callback(error,rows);
    })
}
const getLoadTaskOrder = (params,callback) => {
    let query = "select dlt.*,oi.send_address,oi.recv_address ";
    query += " from dp_load_task dlt left join order_info oi on dlt.order_id = oi.id where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskId){
        paramsArray[i] = params.loadTaskId;
        query += " and dlt.id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLoadTaskOrder');
        callback(error,rows);
    })
}
const deleteById = (params,callback) => {
    let query = "delete from dp_load_task where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskId){
        paramsArray[i] = params.loadTaskId;
        query += " and id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('deleteLoadTaskById');
        callback(error,rows);
    })
}
module.exports={
    add,getById,updateById,
    getLoadTaskWithDetail,
    getLoadTaskOrder,
    deleteById
}