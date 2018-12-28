'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RefundApplyDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addRefundApply = (params,callback) => {
    let query = " insert into refund_apply(order_id,payment_id,mark,apply_fee,bank,bank_code,account_name) values(?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.paymentId;
    paramsArray[i++] = params.mark;
    paramsArray[i++] = params.applyFee;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i] = params.accountName;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRefundApply');
        callback(error,rows);
    })
}
const getRefundApply = (params,callback) => {
    let query = " select * from refund_apply where id is not null";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ?"
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and order_id = ?"
    }
    if(params.refundApplyId){
        paramsArray[i++] = params.refundApplyId;
        query = query + " and id = ?"
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and status = ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRefundApply');
        callback(error,rows)
    })
}
const updateRefuseStatus = (params,callback) => {
    let query = " update refund_apply set status = 0,refuse_reason = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.refuseReason;
    paramsArray[i] = params.refundApplyId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRefuseStatus');
        callback(error,rows);
    })
}
const updateRefundStatus = (params,callback) => {
    let query = " update refund_apply set status = 1,refund_fee = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.refundFee;
    paramsArray[i] = params.refundApplyId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRefundStatus');
        callback(error,rows);
    })
}
module.exports = {
    addRefundApply,
    getRefundApply,
    updateRefuseStatus,
    updateRefundStatus
}