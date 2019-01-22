'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RefundApplyDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addRefundApply = (params,callback) => {
    let query = " insert into refund_apply(order_id,payment_id,date_id,apply_reason,apply_fee) values(?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.paymentId;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.mark;
    paramsArray[i] = params.applyFee;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRefundApply');
        callback(error,rows);
    })
}
const getRefundApply = (params,callback) => {
    let query = " select ra.*,uo.created_type,uo.user_id,pi.payment_type,au.real_name,pi.total_fee,pi.bank,pi.bank_code,pi.account_name,uo.route_start,uo.route_end  from refund_apply ra" +
                " left join order_info uo on ra.order_id = uo.id" +
                " left join payment_info pi on ra.payment_id = pi.id" +
                " left join admin_user au on uo.admin_id = au.id" +
                " where ra.id is not null";
    let paramsArray = [],i=0;
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and ra.order_id = ?"
    }
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and ra.payment_id = ?"
    }
    if(params.refundApplyId){
        paramsArray[i++] = params.refundApplyId;
        query = query + " and ra.id = ?"
    }
    if(params.orderType){
        paramsArray[i++] = params.orderType;
        query = query + " and uo.created_type = ?"
    }
    if(params.refundMethod){
        paramsArray[i++] = params.refundMethod;
        query = query + " and pi.payment_type = ?"
    }
    if(params.createOrderUser){
        paramsArray[i++] = params.createOrderUser;
        query = query + " and au.real_name = ?"
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(ra.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(ra.created_on,'%Y-%m-%d') <= ? ";
    }
    if(params.updateOnStart){
        paramsArray[i++] = params.updateOnStart;
        query = query + " and date_format(ra.updated_on,'%Y-%m-%d') >= ? ";
    }
    if(params.updateOnEnd){
        paramsArray[i++] = params.updateOnEnd;
        query = query + " and date_format(ra.updated_on,'%Y-%m-%d') <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and ra.status = ?"
    }
    query = query + " order by created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRefundApply');
        callback(error,rows)
    })
}
const updateRefuseStatus = (params,callback) => {
    let query = " update refund_apply set status = ? ,refuse_reason = ? where id = ? and order_id = ? and payment_id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.refuseReason;
    paramsArray[i++] = params.refundApplyId;
    paramsArray[i++] = params.orderId;
    paramsArray[i] = params.paymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRefuseStatus');
        callback(error,rows);
    })
}
const updateRefundStatus = (params,callback) => {
    let query = " update refund_apply set status = ?,refund_fee = ?,remark = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.refundFee;
    paramsArray[i++] = params.remark;
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
    query += " ,payment_id = ? ";
    query += " where order_id = ? and id = ?";
    paramsArray[i++] = params.applyFee;
    if (params.mark){
        paramsArray[i++] = params.mark;
    }
    paramsArray[i++] = params.paymentId;
    paramsArray[i++] = params.orderId;
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
const updatePaymentRefundId = (params,callback) => {
    let paramsArray = [],i=0;
    let query = " update refund_apply set payment_refund_id = ? where id = ?";
    paramsArray[i++] = params.paymentRefundId;
    paramsArray[i] = params.refundApplyId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePaymentRefundId');
        callback(error,rows);
    })
}
const updateById = (params,callback) => {
    let paramsArray = [],i=0;
    let query = " update refund_apply set id = ? ";
    paramsArray[i++] = params.refundApplyId;
    if (params.paymentId){
        paramsArray[i++] = params.paymentId;
        query += ",payment_id = ?";
    }
    if (params.remark){
        paramsArray[i++] = params.remark;
        query += ",remark = ?";
    }
    if (params.applyReason){
        paramsArray[i++] = params.applyReason;
        query += ",apply_reason = ?";
    }
    if (params.refuseReason){
        paramsArray[i++] = params.refuseReason;
        query += ",refuse_reason = ?";
    }
    if (params.applyFee){
        paramsArray[i++] = params.applyFee;
        query += ",apply_fee = ?";
    }
    if (params.refundFee){
        paramsArray[i++] = params.refundFee;
        query += ",refund_fee = ?";
    }
    if (params.status){
        paramsArray[i++] = params.status;
        query += ",status = ?";
    }
    paramsArray[i] = params.refundApplyId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateById');
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
    deleteById,
    updatePaymentRefundId,
    updateById
}