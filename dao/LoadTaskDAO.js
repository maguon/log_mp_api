'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('LoadTaskDAO.js');
const db = require('../db/connection/MysqlDb.js');
const sysConst = require("../util/SystemConst");

const add = (params,callback) => {
    let query = "insert into dp_load_task (admin_id,order_id,route_start,route_end,route_start_id,route_end_id,require_id,supplier_id,plan_date_id,trans_type,plan_date";
    if (params.remark){
        query += ",remark";
    }
    query += ") values (?,?,?,?,?,?,?,?,?,?,?"
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
    paramsArray[i++] = params.planDate;
    paramsArray[i++] = params.transType;
    paramsArray[i++] = params.planDateTime;
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
        paramsArray[i++] = params.loadTaskId;
        query += " and id = ?";
    }
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " and order_id = ?";
    }
    if (params.requireId){
        paramsArray[i] = params.requireId;
        query += " and require_id = ?";
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
    if (params.planDate){
        paramsArray[i++] = params.planDate;
        query += " ,plan_date_id = ?";
    }
    if (params.loadDateId){
        paramsArray[i++] = params.loadDateId;
        query += " ,load_date_id = ?";
    }
    if (params.arriveDateId){
        paramsArray[i++] = params.arriveDateId;
        query += " ,arrive_date_id = ?";
    }
    if (params.loadDate){
        paramsArray[i++] = params.loadDate;
        query += " ,load_date = ?";
    }
    if (params.arriveDate){
        paramsArray[i++] = params.arriveDate;
        query += " ,arrive_date = ?";
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
    let query = "select dlt.*,dltd.id detail_id,dltd.order_item_id, dltd.vin,dltd.status,si.supplier_full,si.supplier_short,";
    query += "dltd.supplier_trans_price detail_supplier_trans_price,dltd.supplier_insure_price detail_supplier_insure_price,dltd.hook_id detail_hook_id";
    query += " from dp_load_task dlt";
    query += " left join dp_load_task_detail dltd on dlt.id = dltd.dp_load_task_id ";
    query += " left join supplier_info si on si.id = dlt.supplier_id where 1=1";
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
const getHasLoadCarCount = (params,callback) => {
    let query = "select sum(car_count) total_car_count from dp_load_task where 1=1";
    let paramsArray = [],i=0;
    if (params.requireId){
        paramsArray[i] = params.requireId;
        query += " and require_id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getHasLoadCarCount');
        callback(error,rows);
    })
}
const getLoadTask = (params,callback) => {
    let query = "select dlt.*, si.supplier_full,si.supplier_short from dp_load_task dlt ";
    query += " left join supplier_info si on si.id = dlt.supplier_id  where 1=1";
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
        logger.debug('getLoadTask');
        callback(error,rows);
    })
}
const getLoadTaskProfit = (params,callback) => {
    let query = "select dltd.id,dltd.order_id,dltd.vin,dltd.supplier_trans_price,dltd.supplier_insure_price,dlt.id load_task_id,";
    query += " dlt.route_start,dlt.route_end,oi.total_trans_price,oi.total_insure_price,oi.created_on order_created_on,au.real_name,oi.service_type";
    query += " ,(oi.total_trans_price+oi.total_insure_price-dltd.supplier_trans_price-dltd.supplier_insure_price) profit_price";
    query += " from dp_load_task_detail dltd";
    query += " left join dp_load_task dlt on dltd.dp_load_task_id = dlt.id";
    query += " left join order_info oi on dlt.order_id = oi.id";
    query += " left join admin_user au on oi.admin_id = au.id where 1=1 ";
    let paramsArray = [],i=0;
    if (params.vin){
        paramsArray[i++] = params.vin;
        query += " and dltd.vin = ?";
    }
    if (params.routeStart){
        paramsArray[i++] = params.routeStart;
        query += " and dlt.route_start = ?";
    }
    if (params.routeEnd){
        paramsArray[i++] = params.routeEnd;
        query += " and dlt.route_end = ?";
    }
    if (params.serviceType){
        paramsArray[i++] = params.serviceType;
        query += " and oi.service_type = ?";
    }
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " and dltd.order_id = ?";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(dltd.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(dltd.created_on,'%Y-%m-%d') <= ? ";
    }
    if (params.budgetStatus == sysConst.ORDER.budgetStatus.profit){
        query += " and oi.total_trans_price+oi.total_insure_price-dltd.supplier_trans_price-dltd.supplier_insure_price > 0";
    }else if (params.budgetStatus == sysConst.ORDER.budgetStatus.loss) {
        query += " and oi.total_trans_price+oi.total_insure_price-dltd.supplier_trans_price-dltd.supplier_insure_price < 0";
    }
    query = query + " order by dltd.created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLoadTaskProfit');
        callback(error,rows);
    })
}
module.exports={
    add,getById,updateById,
    getLoadTaskWithDetail,
    getLoadTaskOrder,
    deleteById,
    getHasLoadCarCount,
    getLoadTask,
    getLoadTaskProfit
}