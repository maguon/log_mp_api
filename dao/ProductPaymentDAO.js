'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductPaymentDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');
const sysConsts = require("../util/SystemConst")

const getPayment = (params,callback) => {
    let query = " select ppi.*,ui.user_name,ui.phone "
                +" from product_payment_info ppi"
                +" left join product_order_info poi on ppi.product_order_id = poi.id"
                +" left join user_info ui on ui.id = ppi.user_id "
                +" where ppi.id is not null";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ppi.user_id = ? ";
    }
    if(params.productOrderId){
        paramsArray[i++] = params.productOrderId;
        query = query + " and ppi.product_order_id = ? ";
    }
    if(params.productPaymentId){
        paramsArray[i++] = params.productPaymentId;
        query = query + " and ppi.id = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and ppi.type = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart + " 00:00:00 ";
        query = query + " and ppi.created_on >= ? "
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd + " 23:59:59 ";
        query = query + " and ppi.created_on <= ? "
    }
    if(params.statusArr){
        query = query + " and ppi.status in ("+ params.statusArr+")";
    }
    query = query + " order by ppi.id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPayment');
        callback(error,rows)
    })
}
const getPaymentByOrderId = (params,callback) => {
    let query = " select ui.user_name,ui.phone,pi.* " +
        "from product_payment_info pi " +
        " left join user_info ui on ui.id = pi.user_id " +
        " where pi.id is not null  ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and pi.user_id =? ";
    }
    if(params.productOrderId){
        paramsArray[i++] = params.productOrderId;
        query = query + " and pi.product_order_id =? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone =? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name =? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and pi.type =? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and pi.status =? ";
    }
    if(params.pId){
        paramsArray[i++] = params.pId;
        query = query + " and pi.p_id =? ";
    }
    if(params.productPaymentId){
        paramsArray[i++] = params.productPaymentId;
        query = query + " and pi.id =? ";
    }
    query = query + " order by pi.created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPaymentByOrderId');
        callback(error,rows);
    })
}
const getRealPaymentPrice =(params,callback) => {
    let query = " select sum(if(type=2 ,total_fee,0)) refund_price,sum(if(type=1 ,total_fee,0)) pay_price " +
        "from product_payment_info " +
        "where product_order_id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.productOrderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRealPaymentPrice');
        callback(error,rows)
    })
}
const getOrderRealPayment =(params,callback) => {
    let query = " select sum(total_fee) real_payment from product_payment_info where product_order_id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.productOrderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderRealPayment');
        callback(error,rows)
    })
}
const addPayment = (params,callback) => {
    let query = " insert into product_payment_info (user_id,product_order_id,wx_order_id,date_id,total_fee,nonce_str,status,type) values(?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.productOrderId;
    paramsArray[i++] = params.wxOrderId;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.nonceStr;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.type;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addPayment');
        callback(error,rows)
    })
}
const addRefund = (params,callback) => {
    let query = " insert into product_payment_info(admin_id,user_id,date_id,product_order_id,wx_order_id,type,p_id,total_fee) values(?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.productOrderId;
    paramsArray[i++] = params.wxOrderId;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.productPaymentId;
    paramsArray[i] = -params.refundFee;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRefund');
        callback(error,rows);
    })
}
const updateWechatPayment = (params,callback) => {
    let query = " update product_payment_info set status=?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    if(params.transactionId){
        paramsArray[i++] = params.transactionId;
        query += ",transaction_id=?";
    }
    if(params.paymentTime){
        paramsArray[i++] = params.paymentTime;
        query += ",payment_time= ?";
    }
    query += " where id = ? ";
    paramsArray[i] = params.productPaymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateWechatPayment');
        callback(error,rows);
    })
}
const updateWechatRefundPayment = (params,callback) => {
    let query = " update product_payment_info set status=?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    if(params.paymentRefundTime){
        paramsArray[i++] = params.paymentRefundTime;
        query += ",payment_refund_time=?";
    }
    query += " where id = ? ";
    paramsArray[i] = params.productPaymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateWechatRefundPayment');
        callback(error,rows);
    })
}
const updateRemark = (params,callback) => {
    let query = " update product_payment_info set remark=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.remark;
    paramsArray[i] = params.productPaymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRemark');
        callback(error,rows);
    })
}
const delRefundFail = (params,callback) => {
    let query = " delete from product_payment_info where status=? and type = ? and id=? and p_id is not null ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.type;
    paramsArray[i] = params.refundId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delRefundFail');
        callback(error,rows);
    })
}
module.exports = {
    getPayment,
    getPaymentByOrderId,
    getRealPaymentPrice,
    getOrderRealPayment,
    addPayment,
    addRefund,
    updateWechatPayment,
    updateWechatRefundPayment,
    updateRemark,
    delRefundFail
}