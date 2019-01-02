'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RefundApplyDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addRefundApply = (params,callback) => {
    let query = " insert into refund_apply(order_id,payment_id,remark,apply_fee,bank,bank_code,account_name) values(?,?,?,?,?,?,?) ";
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
    let query = " select pi.total_fee, ra.* from refund_apply ra" +
                " left join payment_info pi on pi.id=ra.payment_id " +
                " where ra.id is not null";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ra.user_id = ?"
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and ra.order_id = ?"
    }
    if(params.refundApplyId){
        paramsArray[i++] = params.refundApplyId;
        query = query + " and ra.id = ?"
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and ra.status = ?"
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
const getRefundApplyStat = (params,callback) => {
    let query = " select pt.id as pt_type,p.bank,p.bank_code,p.account_name,sum(p.total_fee) as total_fee from payment_type pt " +
                " inner join payment_info p on pt.id=p.type " +
                " where pt.id is not null ";
    let paramsArray = [],i=0;
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and p.order_id = ?"
    }
    if(params.refundApplyId){
        paramsArray[i++] = params.refundApplyId;
        query = query + " and p.id = ?"
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and p.status = ?"
    }
    query = query + " group by pt.id,p.bank,p.bank_code,p.account_name ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRefundApplyStat');
        callback(error,rows)
    })
}

const updateRefundById = (params,callback) => {
    let paramsArray = [],i=0;
    let query = " update refund_apply set apply_fee = ?";
    if (params.mark){
        query += " ,remark = ?";
    }
    query += " where order_id = ? and payment_id = ? and id = ?";
    paramsArray[i++] = params.applyFee;
    if (params.mark){
        paramsArray[i++] = params.mark;
    }
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.paymentId;
    paramsArray[i] = params.refundId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRefundById');
        callback(error,rows);
    })
}
const deleteById = (params,callback) => {
    let paramsArray = [],i=0;
    let query = " delete from refund_apply where order_id = ? and payment_id = ? and id =?";
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.paymentId;
    paramsArray[i] = params.refundApplyId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRefundById');
        callback(error,rows);
    })
}

module.exports = {
    addRefundApply,
    getRefundApply,
    updateRefuseStatus,
    updateRefundStatus,
    getRefundApplyStat,
    updateRefundById,
    deleteById
}