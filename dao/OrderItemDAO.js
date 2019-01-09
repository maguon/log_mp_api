'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderItemDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addOrderCar = (params,callback) => {
    let query = " insert into order_item(safe_status,user_id,order_id,vin,model_type,old_car,valuation,ora_trans_price,ora_insure_price) values(?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.insuranceFlag;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.modelType;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.valuation;
    paramsArray[i++] = params.oraTransPrice;
    paramsArray[i] = params.oraInsurePrice;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrderCar');
        callback(error,rows);
    })
}
const getOrderCar = (params,callback) => {
    let query = " select * from order_item where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and order_id = ? ";
    }
    if(params.orderItemId){
        paramsArray[i++] = params.orderItemId;
        query = query + " and id = ? ";
    }
    if(params.type){
        paramsArray[i] = params.type;
        query = query + " and type = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderCar');
        callback(error,rows);
    })
}
const delOrderCar = (params,callback) => {
    let query = " delete from order_item where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.orderItemId;

    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delOrderCar');
        callback(error,rows);
    })
}
const addOrderCarAdmin = (params,callback) => {
    let query = " insert into order_item(safe_status,order_id,vin,model_type,old_car,valuation,ora_trans_price,ora_insure_price,act_trans_price,act_insure_price) values(?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.safeStatus;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.modelType;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.valuation;
    paramsArray[i++] = params.oraTransPrice;
    paramsArray[i++] = params.oraInsurePrice;
    paramsArray[i++] = params.actTransPrice;
    paramsArray[i] = params.actInsurePrice;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrderCarAdmin');
        callback(error,rows);
    })
}
const updateActFee = (params,callback) => {
    let query = " update order_item set act_trans_price=?,act_insure_price=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.actFee;
    paramsArray[i++] = params.safePrice;
    paramsArray[i] = params.orderItemId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateActFee');
        callback(error,rows)
    })
}
const updateOrderItemInfo = (params,callback) => {
    let query = " update order_item set ora_trans_price=?,ora_insure_price=?,vin=?,model_type=?,old_car=?,valuation=?,act_trans_price=?,safe_status=?,act_insure_price=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.oraTransPrice;
    paramsArray[i++] = params.oraInsurePrice;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.modelType;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.valuation;
    paramsArray[i++] = params.actTransPrice;
    paramsArray[i++] = params.safeStatus;
    paramsArray[i++] = params.actInsurePrice;
    paramsArray[i] = params.orderItemId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderItemInfo');
        callback(error,rows)
    })
}
const updateCarType = (params,callback) => {
    let query = " update order_item set model_type= ?,vin =? ,old_car =?, valuation =?,safe_status = ? where id =? and user_id =? and order_id =? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.modelType;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.valuation;
    paramsArray[i++] = params.safeStatus;
    paramsArray[i++] = params.orderItemId;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateCarType');
        callback(error,rows)
    })
}
module.exports = {
    addOrderCar,
    getOrderCar,
    delOrderCar,
    addOrderCarAdmin,
    updateActFee,
    updateOrderItemInfo,
    updateCarType
}