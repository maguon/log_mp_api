'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('LoadTaskDAO.js');
const db = require('../db/connection/MysqlDb.js');
const sysConst = require("../util/SystemConst");

const add = (params,callback) => {
    let query = "insert into dp_load_task (admin_id,order_id,route_start,route_end,route_start_detail,route_end_detail,route_start_id,route_end_id,require_id,supplier_id,plan_date_id,trans_type,plan_date";
    if (params.remark){
        query += ",remark";
    }
    query += ") values (?,?,?,?,?,?,?,?,?,?,?,?,?"
    if (params.remark){
        query += ",?"
    }
    query += ")";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.routeStart;
    paramsArray[i++] = params.routeEnd;
    paramsArray[i++] = params.routeStartDetail;
    paramsArray[i++] = params.routeEndDetail;
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
    if (params.loadTaskIdArray){
        paramsArray[i++] = params.loadTaskIdArray;
        query += " and id in (?)";
    }
    if (params.loadTaskId){
        paramsArray[i++] = params.loadTaskId;
        query += " and id = ?";
    }
    if (params.loadTaskStatus){
        paramsArray[i++] = params.loadTaskStatus;
        query += " and load_task_status = ?";
    }
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " and order_id = ?";
    }
    if (params.requireId){
        paramsArray[i++] = params.requireId;
        query += " and require_id = ?";
    }
    if (params.isHookIdNull){
        paramsArray[i++] = params.isHookIdNull;
        query += " and hook_id != 0";
    }
    if (params.hookId || params.hookId == 0){
        paramsArray[i] = params.hookId;
        query += " and hook_id = ?";
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
    if (params.paymentFlag){
        paramsArray[i++] = params.paymentFlag;
        query += " ,payment_flag = ?";
    }
    if (params.paymentOn){
        paramsArray[i++] = params.paymentOn;
        query += " ,payment_on = ?";
    }
    if (params.paymentOnId){
        paramsArray[i++] = params.paymentOnId;
        query += " ,payment_on_id = ?";
    }
    if (params.routeStart){
        paramsArray[i++] = params.routeStart;
        query += " ,route_start = ?";
    }
    if (params.routeEnd){
        paramsArray[i++] = params.routeEnd;
        query += " ,route_end = ?";
    }
    if (params.routeStartDetail){
        paramsArray[i++] = params.routeStartDetail;
        query += " ,route_start_detail = ?";
    }
    if (params.routeEndDetail){
        paramsArray[i++] = params.routeEndDetail;
        query += " ,route_end_detail = ?";
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
    if (params.planDate){
        paramsArray[i++] = params.planDate;
        query += " ,plan_date = ?";
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
    query += "dltd.supplier_trans_price detail_supplier_trans_price,dltd.supplier_insure_price detail_supplier_insure_price,dltd.hook_id detail_hook_id,dltd.id dltd_id";
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
    let query = "select dlt.*,oi.send_address,oi.recv_address,oi.send_address_point,oi.recv_address_point,oi.service_type ";
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
    let query = "select dlt.*, si.supplier_full,si.supplier_short,si.close_flag from dp_load_task dlt ";
    query += " left join supplier_info si on si.id = dlt.supplier_id  where 1=1";
    let paramsArray = [],i=0;
    if (params.loadTaskIdArray){
        paramsArray[i++] = params.loadTaskIdArray;
        query += " and dlt.id in (?)";
    }
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
const getLoadTaskProfitOfCar = (params,callback) => {
    let paramsArray = [],i=0;
    let query = "select carItem.*,(act_trans_price+act_insure_price-supplier_trans_price-supplier_insure_price)profit_price";
    query += " ,oi.route_start,oi.route_end,oi.service_type,oi.created_on order_created_on,au.real_name";
    query += "  from (";
    query += " select oit.id order_item_id,oit.vin,oit.model_type,oit.brand,oit.brand_type,oit.old_car,oit.safe_status,oit.valuation,oit.act_trans_price,oit.act_insure_price,oit.order_id,";
    query += " sum(dltd.supplier_trans_price) supplier_trans_price,sum(dltd.supplier_insure_price) supplier_insure_price";
    query += " from dp_load_task_detail dltd";
    query += " left join  order_item oit on dltd.order_item_id = oit.id where 1=1";
    if (params.vin){
        paramsArray[i++] = params.vin;
        query += " and oit.vin = ?";
    }
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " and oit.order_id = ?";
    }
    if (params.orderItemId){
        paramsArray[i++] = params.orderItemId;
        query += " and oit.id = ?";
    }
    query += " group by oit.id )carItem";
    query += " left join order_info oi on carItem.order_id = oi.id left join admin_user au on oi.admin_id = au.id where 1=1 ";

    if (params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query += " and oi.route_start_id = ?";
    }
    if (params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query += " and oi.route_end_id = ?";
    }
    if (params.serviceType){
        paramsArray[i++] = params.serviceType;
        query += " and oi.service_type = ?";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(oi.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(oi.created_on,'%Y-%m-%d') <= ? ";
    }
    if (params.budgetStatus == sysConst.ORDER.budgetStatus.profit){
        query += " and (act_trans_price+act_insure_price-supplier_trans_price-supplier_insure_price) > 0";
    }else if (params.budgetStatus == sysConst.ORDER.budgetStatus.loss) {
        query += " and (act_trans_price+act_insure_price-supplier_trans_price-supplier_insure_price) < 0";
    }
    query = query + " order by order_item_id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLoadTaskProfitOfCar');
        callback(error,rows);
    })
}
const getRouteLoadTask = (params,callback) => {
    let query = "select dlt.id,dlt.plan_date,dlt.route_start,dlt.route_end,dlt.arrive_date,dlt.load_date,dlt.trans_type,dlt.car_count,dlt.payment_flag,";
    query += " dlt.supplier_trans_price,dlt.supplier_insure_price,dlt.load_task_status,dlt.order_id,dlt.created_on,oi.created_on order_created_on,dlt.payment_on";
    query += " ,oi.car_num order_car_num,oi.total_trans_price,oi.total_insure_price,oi.service_type,dlt.car_count,si.supplier_short,au.real_name,drt.created_on require_created_on ";
    query += ",dlt.arrive_date,dlt.supplier_id,dlt.hook_id,si.close_flag,dlt.require_id,drt.status require_status";
    query += " from dp_load_task dlt"
    query += " left join order_info oi on dlt.order_id = oi.id";
    query += " left join supplier_info si on dlt.supplier_id = si.id ";
    query += " left join dp_require_task drt on dlt.require_id = drt.id"
    query += " left join admin_user au on oi.admin_id = au.id where 1=1"
    let paramsArray = [],i=0;
    if (params.loadTaskId){
        paramsArray[i++] = params.loadTaskId;
        query += " and dlt.id = ?";
    }
    if (params.orderId){
        paramsArray[i++] = params.orderId;
        query += " and dlt.order_id = ?";
    }
    if (params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query += " and dlt.route_end_id = ?";
    }
    if (params.serviceType){
        paramsArray[i++] = params.serviceType;
        query += " and oi.service_type = ?";
    }
    if (params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query += " and dlt.route_start_id = ?";
    }
    if (params.transType){
        paramsArray[i++] = params.transType;
        query += " and dlt.trans_type = ?";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(dlt.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(dlt.created_on,'%Y-%m-%d') <= ? ";
    }
    if(params.orderStatus){
        paramsArray[i++] = params.orderStatus;
        query = query + " and oi.status = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and dlt.load_task_status = ? ";
    }
    if(params.paymentFlag){
        paramsArray[i++] = params.paymentFlag;
        query = query + " and dlt.payment_flag = ? ";
    }
    if(params.supplierId){
        paramsArray[i++] = params.supplierId;
        query = query + " and dlt.supplier_id = ? ";
    }
    if(params.planDateStart){
        paramsArray[i++] = params.planDateStart;
        query = query + " and date_format(dlt.plan_date,'%Y-%m-%d') >= ? ";
    }
    if(params.planDateEnd){
        paramsArray[i++] = params.planDateEnd;
        query = query + " and date_format(dlt.plan_date,'%Y-%m-%d') <= ? ";
    }
    if(params.arriveDateStart){
        paramsArray[i++] = params.arriveDateStart;
        query = query + " and date_format(dlt.arrive_date,'%Y-%m-%d') >= ? ";
    }
    if(params.arriveDateEnd){
        paramsArray[i++] = params.arriveDateEnd;
        query = query + " and date_format(dlt.arrive_date,'%Y-%m-%d') <= ? ";
    }
    if(params.paymentOnStart){
        paramsArray[i++] = params.paymentOnStart;
        query = query + " and date_format(dlt.payment_on,'%Y-%m-%d') >= ? ";
    }
    if(params.paymentOnEnd){
        paramsArray[i++] = params.paymentOnEnd;
        query = query + " and date_format(dlt.payment_on,'%Y-%m-%d') <= ? ";
    }
    query = query + " order by dlt.created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRouteLoadTask');
        callback(error,rows);
    })
}
const getOrderLoadPrice = (params,callback) => {
    let query = "select sum(paid_supplier_price) paid_supplier_price, sum(unpaid_load_count) unpaid_load_count,";
    query += " sum(unpaid_supplier_price) unpaid_supplier_price,sum(real_payment_price)-sum(paid_supplier_price) profit_price";
    query += "  from ( ";
    query += "select oi.id,sum(supplier_insure_price + supplier_trans_price) supplier_price,sum(if(payment_flag = 0,1,0)) unpaid_load_count ";
    query += " ,sum(if(payment_flag=1 and DATE_FORMAT(payment_on_id,'%Y%m')= ?,supplier_insure_price + supplier_trans_price,0)) paid_supplier_price"
    query += " ,sum(if(payment_flag=0 ,supplier_insure_price + supplier_trans_price,0)) unpaid_supplier_price";
    query += " ,sum(if(db.y_month= ?,oi.real_payment_price,0)) real_payment_price ";
    query += " from order_info oi left join date_base db on oi.date_id = db.id "
    query += " left join dp_load_task dlt on dlt.order_id = oi.id group by oi.id ) db_price"
    let paramsArray = [],i=0;
    paramsArray[i++] = parseInt(params.dbMonth);
    paramsArray[i] = parseInt(params.dbMonth);
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderLoadPrice');
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
    getLoadTaskProfitOfCar,
    getRouteLoadTask,
    getOrderLoadPrice
}