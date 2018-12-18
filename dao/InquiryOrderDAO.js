'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryOrderDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryOrder = (params,callback) => {
    let query = " select uo.*,ii.service_type from inquiry_info ii " +
                " left join user_info ui on ui.id=ii.user_id " +
                " left join user_order uo on uo.inquiry_id = ii.id " +
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
    let query = " insert into user_order(created_type,service_type,user_id,inquiry_id,fee_price,count) values(?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.createdType;
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
    let query = " update user_order set fee_price=?,count=? where id = ? ";
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
    let query = " update user_order set recv_name=?,recv_phone=?,recv_address=? where id = ? ";
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
    let query = " update user_order set fee_price=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.feePrice;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putFreightPrice');
        callback(error,rows);
    })
}
const putStatus = (params,callback) => {
    let query = " update user_order set status=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putStatus');
        callback(error,rows);
    })
}
const getOrder = (params,callback) => {
    let query = " select ii.start_id,ii.end_id,ui.phone,ui.user_name,ii.start_city,ii.end_city,uo.* from user_order uo " +
                " left join user_info ui on ui.id=uo.user_id " +
                " left join inquiry_info ii on ii.id=uo.inquiry_id " +
                " where uo.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uo.user_id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
    }
    if(params.startCityId){
        paramsArray[i++] = params.startCityId;
        query = query + " and rci.route_start_id = ? ";
    }
    if(params.endCityId){
        paramsArray[i++] = params.endCityId;
        query = query + " and rci.route_end_id = ? ";
    }
    if(params.serviceType){
        paramsArray[i++] = params.serviceType;
        query = query + " and uo.service_type = ? ";
    }
    if(params.createdType){
        paramsArray[i++] = params.createdType;
        query = query + " and uo.created_type = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and uo.id = ? ";
    }
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and uo.inquiry_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and uo.payment_status = ? ";
    }
    if(params.logStatus){
        paramsArray[i++] = params.logStatus;
        query = query + " and uo.log_status = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and uo.status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart + " 00:00:00";
        query = query + " and uo.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd + " 23:59:59";
        query = query + " and uo.created_on <= ? ";
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
const putMark = (params,callback) => {
    let query = " update user_order set mark=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.mark;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putMark');
        callback(error,rows);
    })
}
const putAdminMark = (params,callback) => {
    let query = " update user_order set admin_mark=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminMark;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putAdminMark');
        callback(error,rows);
    })
}
const updateOrderPaymengStatusByOrderId = (params,callback) => {
    let query = "update user_order set payment_status = ? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.paymentStatus;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderPaymengStatusByOrderId');
        callback(error,rows);
    })
}
const cancelOrder = (params,callback) => {
    let query = "update user_order set status = 0,cancel_reason=?,cancel_time=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.cancelMark;
    paramsArray[i++] = params.myDate;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('cancelOrder');
        callback(error,rows);
    })
}
const putSendInfo = (params,callback) => {
    let query = "update user_order set send_name = ?,send_phone=?,send_address=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.sendName;
    paramsArray[i++] = params.sendPhone;
    paramsArray[i++] = params.sendAddress;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putSendInfo');
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
    putMark,
    updateOrderPaymengStatusByOrderId,
    cancelOrder,
    putSendInfo,
    putAdminMark
}