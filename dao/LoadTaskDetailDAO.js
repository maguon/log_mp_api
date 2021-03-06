'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('LoadTaskDetailDAO.js');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) => {
    let query = "insert into dp_load_task_detail (dp_load_task_id,require_id,order_id,order_item_id,supplier_id,vin,date_id,supplier_trans_price,supplier_insure_price)";
    query += " values (?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.loadTaskId;
    paramsArray[i++] = params.requireId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.orderItemId;
    paramsArray[i++] = params.supplierId;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.supplierTransPrice;
    paramsArray[i] = params.supplierInsurePrice;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addLoadTaskDetail');
        callback(error,rows);
    })
}
const getArrangeLoadTaskDetail = (params,callback) => {
    let paramsArray = [],i=0;
    let query = "select oi.id order_item_id,dltd.id load_task_detail_id,oi.order_id,oi.vin,oi.model_type,oi.brand";
    query += ",oi.brand_type,oi.old_car,oi.safe_status,dltd.id load_task_detail_id,oi.valuation,";
    query += "case when dltd.supplier_trans_price is null then 0 else dltd.supplier_trans_price end as supplier_trans_price,"
    query += "case when dltd.supplier_insure_price is null then 0 else dltd.supplier_insure_price end as supplier_insure_price";
    query += " ,dltd.dp_load_task_id";
    query += " from order_item oi left join dp_load_task_detail dltd on oi.id = dltd.order_item_id ";
    if (params.loadTaskId){
        paramsArray[i++] = params.loadTaskId;
        query += "and dltd.dp_load_task_id = ?";
    }
    query += " where 1=1"
    if (params.orderId){
        paramsArray[i] = params.orderId;
        query += " and oi.order_id = ?";
    }
    if (params.arrangeFlag == 1){
        query += " and dltd.id is null ";
    }else if (params.arrangeFlag == 2){
        query += " and dltd.id is not null ";
    }
    query += " order by oi.created_on desc";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getArrangeLoadTaskDetail');
        callback(error,rows);
    })
}
const updateById = (params,callback) => {
    let paramsArray = [],i=0;
    let query = "update dp_load_task_detail set id = ? "
    paramsArray[i++] = params.loadTaskDetailId;
    if (params.supplierTransPrice){
        paramsArray[i++] = params.supplierTransPrice;
        query += " ,supplier_trans_price = ?";
    }
    if (params.supplierInsurePrice){
        paramsArray[i++] = params.supplierInsurePrice;
        query += " ,supplier_insure_price = ?";
    }
    if (params.detailHookId){
        paramsArray[i++] = params.detailHookId;
        query += " ,hook_id = ?";
    }
    paramsArray[i] = params.loadTaskDetailId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateById');
        callback(error,rows);
    })
}
const getById = (params,callback) => {
    let query = "select id,dp_load_task_id,require_id,order_id,order_item_id,supplier_id,vin,date_id,supplier_trans_price,supplier_insure_price,hook_id,created_on,updated_on ";
    query += "from dp_load_task_detail where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskDetailId){
        paramsArray[i++] = params.loadTaskDetailId;
        query += " and id = ?";
    }
    if (params.loadTaskId){
        paramsArray[i++] = params.loadTaskId;
        query += " and dp_load_task_id = ?";
    }
    if (params.isHookIdNull){
        paramsArray[i++] = params.isHookIdNull;
        query += " and hook_id != 0";
    }
    if (params.orderItemId){
        paramsArray[i] = params.orderItemId;
        query += " and order_item_id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLoadTaskDetailById');
        callback(error,rows);
    })
}
const deleteById = (params,callback) => {
    let query = "delete from dp_load_task_detail where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskDetailId){
        paramsArray[i++] = params.loadTaskDetailId;
        query += " and id = ?";
    }
    if (params.loadTaskId){
        paramsArray[i] = params.loadTaskId;
        query += " and dp_load_task_id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('deleteLoadTaskDetailById');
        callback(error,rows);
    })
}
const getTotalPrice = (params,callback) => {
    let query = "select count(id) total_car_num,IFNULL(sum(supplier_trans_price),0) total_supplier_trans_price,IFNULL(sum(supplier_insure_price),0) total_supplier_insure_price ";
    query += " from dp_load_task_detail where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskId){
        paramsArray[i] = params.loadTaskId;
        query += " and dp_load_task_id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getTotalPrice');
        callback(error,rows);
    })
}
const getRouteId = (params,callback) => {
    let query = "select  distinct dp_load_task_id";
    query += " from dp_load_task_detail where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskDetailId){
        paramsArray[i++] = params.loadTaskDetailId;
        query += " and id = ?";
    }
    if (params.loadTaskId){
        paramsArray[i++] = params.loadTaskId;
        query += " and dp_load_task_id = ?";
    }
    if (params.isHookIdNull){
        paramsArray[i++] = params.isHookIdNull;
        query += " and hook_id != 0";
    }
    if (params.orderItemId){
        paramsArray[i] = params.orderItemId;
        query += " and order_item_id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLoadTaskDetailById');
        callback(error,rows);
    })
}
module.exports={
    add,
    getArrangeLoadTaskDetail,
    updateById,
    getById,
    deleteById,
    getTotalPrice,
    getRouteId
}