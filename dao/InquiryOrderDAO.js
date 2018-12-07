'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryOrderDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryOrder = (params,callback) => {
    let query = " select uo.*,ii.service_type from inquiry_info ii " +
                " left join user_info ui on ui.id=ii.user_id " +
                " left join inquiry_order uo on uo.inquiry_id = ii.id " +
                " where ii.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ii.user_id = ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryOrder');
        callback(error,rows)
    })
}
const addInquiryOrder = (params,callback) => {
    let query = " insert into inquiry_order(service_type,user_id,inquiry_id,fee_price,count) values(?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.serviceType;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.inquiryId;
    paramsArray[i++] = params.feePrice;
    paramsArray[i] = params.count;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addInquiryOrder');
        callback(error,rows);
    })
}
const putInquiryOrder = (params,callback) => {
    let query = " update inquiry_order set fee_price=?,count=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.feePrice;
    paramsArray[i++] = params.count;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putInquiryOrder');
        callback(error,rows);
    })
}
const putReceiveInfo = (params,callback) => {
    let query = " update inquiry_order set recv_name=?,recv_phone=?,recv_address=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i++] = params.recvAddress;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putReceiveInfo');
        callback(error,rows);
    })
}
const putFreightPrice = (params,callback) => {
    let query = " update inquiry_order set fee_price=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.feePrice;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putFreightPrice');
        callback(error,rows);
    })
}
const putStatus = (params,callback) => {
    let query = " update inquiry_order set status=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putStatus');
        callback(error,rows);
    })
}
const getOrder = (params,callback) => {
    let query = " select * from inquiry_order where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and id = ? ";
    }
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and inquiry_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and payment_status = ? ";
    }
    if(params.logStatus){
        paramsArray[i++] = params.logStatus;
        query = query + " and log_status = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart + " 00:00:00";
        query = query + " and created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd + " 23:59:59";
        query = query + " and created_on <= ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrder');
        callback(error,rows);
    })
}
const addOrderCar = (params,callback) => {
    let query = " insert into inquiry_car(user_id,inquiry_id,vin,model_id,old_car,plan,type) values(?,?,?,?,?,?,1) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.inquiryId;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.oldCar;
    paramsArray[i] = params.plan;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrderCar');
        callback(error,rows);
    })
}
const putMark = (params,callback) => {
    let query = " update inquiry_order set mark=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.mark;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putMark');
        callback(error,rows);
    })
}
const updateOrderPaymengStatusByOrderId = (params,callback) => {
    let query = "update inquiry_order set payment_status = ? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.paymentStatus;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderPaymengStatusByOrderId');
        callback(error,rows);
    })
}
const cancelOrder = (params,callback) => {
    let query = "update inquiry_order set status = 0,cancel_time=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.myDate;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('cancelOrder');
        callback(error,rows);
    })
}
module.exports = {
    getInquiryOrder,
    addInquiryOrder,
    putInquiryOrder,
    putReceiveInfo,
    putFreightPrice,
    putStatus,
    getOrder,
    addOrderCar,
    putMark,
    updateOrderPaymengStatusByOrderId,
    cancelOrder
}