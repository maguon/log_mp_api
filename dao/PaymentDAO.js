'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PaymentDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getPaymentPrice = (params,callback) => {
    let query = " select (uo.total_trans_price + uo.total_insure_price) as total_price,sum(pi.total_fee) as payment_price,(uo.total_trans_price + uo.total_insure_price - sum(pi.total_fee)) as surplus_price from payment_info pi " +
                " left join user_order uo on uo.id=pi.order_id " +
                " where pi.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and pi.user_id = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and pi.order_id = ? ";
    }
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and pi.id = ? ";
    }
    query = query + ' group by pi.order_id';
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPaymentPrice');
        callback(error,rows)
    })
}
const getPayment = (params,callback) => {
    let query = " select admin_user.real_name createOrderUser,payment_info.* from payment_info"
                +" left join user_order on payment_info.order_id = user_order.id"
                +" left join admin_user on user_order.admin_id = admin_user.id"
                +" where payment_info.id is not null";
    let paramsArray = [],i=0;
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and payment_info.admin_id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and payment_info.user_id = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and payment_info.order_id = ? ";
    }
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and payment_info.id = ? ";
    }
    if(params.paymentType){
        paramsArray[i++] = params.paymentType;
        query = query + " and payment_info.type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and payment_info.status = ? ";
    }
    if(params.createOrderUser){
        paramsArray[i++] = params.createOrderUser;
        query = query + " and admin_user.real_name = ? ";
    }
    if(params.bank){
        paramsArray[i++] = params.bank;
        query = query + " and payment_info.bank = ? ";
    }
    if(params.accountUser){
        paramsArray[i++] = params.accountUser;
        query = query + " and payment_info.account_name = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(payment_info.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(payment_info.created_on,'%Y-%m-%d') <= ? ";
    }

    query = query + " order by created_on desc";
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
const addPayment = (params,callback) => {
    let query = " insert into payment (user_id,order_id,total_fee,remark,status,payment_type,type) values(?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.paymentType;
    paramsArray[i] = params.type;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addPayment');
        callback(error,rows)
    })
}
const addRefund = (params,callback) => {
    let query = " insert into payment (user_id,order_id,total_fee,remark,status,payment_type,type,p_id) values(?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.paymentType;
    paramsArray[i++] = params.type;
    paramsArray[i] = params.pId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRefund');
        callback(error,rows)
    })
}
const updateWechatPayment = (params,callback) => {
    let query = " update payment_info set total_fee=?,status=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.paymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateWechatPayment');
        callback(error,rows);
    })
}
const getPaymentByOrderId = (params,callback) => {
    let query = " select ui.user_name,ui.phone,pi.* from payment_info pi " +
                " left join user_info ui on ui.id=pi.user_id " +
                " where pi.id is not null  ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and pi.user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and pi.order_id =? ";
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
    if(params.paymentType){
        paramsArray[i++] = params.paymentType;
        query = query + " and pi.payment_type =? ";
    }
    if(params.pId){
        paramsArray[i++] = params.pId;
        query = query + " and pi.p_id =? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart+" 00:00:00";
        query = query + " and pi.created_on >=? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd+" 23:59:59";
        query = query + " and pi.created_on <=? ";
    }
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and pi.id =? ";
    }
    query = query + " order by pi.created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPayment');
        callback(error,rows);
    })
}
const getRefundByPaymentId = (params,callback) => {
    let query = " select * from payment_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.paymentId){
        paramsArray[i] = params.paymentId;
        query = query + " and p_id = ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRefundByPaymentId');
        callback(error,rows);
    })
}
const getPaymentByRefundId = (params,callback) => {
    let query = " select * from payment_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.pId){
        paramsArray[i++] = params.pId;
        query = query + " and id = ?"
    }
    if(params.pId){
        paramsArray[i++] = params.pId;
        paramsArray[i] = params.pId;
        query = query + " or p_id = ? and p_id <> ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPaymentByRefundId');
        callback(error,rows);
    })
}
const delRefundFail = (params,callback) => {
    let query = " delete from payment_info where status=0 and type = 0 and p_id is not null ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.transactionId;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.refundId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delRefundFail');
        callback(error,rows);
    })
}
const addWechatRefund = (params,callback) => {
    let query = " insert into payment_info(date_id,user_id,order_id,type,p_id,payment_type,total_fee) values(?,?,?,?,?,1,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = 0;
    paramsArray[i++] = params.paymentId;
    paramsArray[i] = -params.refundFee;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addWechatRefund');
        callback(error,rows);
    })
}
const updateRefund = (params,callback) => {
    let query = " update payment_info set total_fee=?,status=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.settlement_refund_fee;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.refundId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRefund');
        callback(error,rows);
    })
}
const updateRemark = (params,callback) => {
    let query = " update payment_info set remark=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.remark;
    paramsArray[i] = params.paymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRemark');
        callback(error,rows);
    })
}
const addBankPayment = (params,callback) => {
    let query = " insert into payment_info(user_id,order_id,total_fee,remark,date_id,payment_type,type,bank,bank_code,account_name) values(?,?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.paymentType;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i] = params.accountName;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addBankPayment');
        callback(error,rows);
    })
}
const addBankPaymentByadmin = (params,callback) => {
    let query = " insert into payment_info(admin_id,order_id,total_fee,remark,date_id,payment_type,type,bank,bank_code,account_name) values(?,?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.paymentType;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i] = params.accountName;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addBankPaymentByadmin');
        callback(error,rows);
    })
}
const updateBankStatus = (params,callback) => {
    let query = " update payment_info set status = ? where id=? and payment_type=2";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.paymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateBankStatus');
        callback(error,rows);
    })
}
const addBankRefund = (params,callback) => {
    let query = " insert into payment_info(user_id,order_id,total_fee,remark,date_id,payment_type,type,bank,bank_code,account_name,p_id) values(?,?,?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = -params.totalFee;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.paymentType;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i++] = params.accountName;
    paramsArray[i] = params.pId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addBankRefund');
        callback(error,rows);
    })
}
const updateRefundRemark = (params,callback) => {
    let query = " update payment_info set refund_mark = ?,refund_status=0 where id=? and type=1";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.refundRemark;
    paramsArray[i] = params.paymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRefundRemark');
        callback(error,rows);
    })
}
const getAllRefund = (params,callback) => {
    let query = " select sum(total_fee) as refund_fee from payment_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and order_id =? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone =? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name =? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and type =? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status =? ";
    }
    if(params.paymentType){
        paramsArray[i++] = params.paymentType;
        query = query + " and payment_type =? ";
    }
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and p_id =? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart+" 00:00:00";
        query = query + " and created_on >=? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd+" 23:59:59";
        query = query + " and created_on <=? ";
    }
    query = query + " order by created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAllRefund');
        callback(error,rows)
    })
}
module.exports = {
    getPayment,
    addPayment,
    addRefund,
    updateWechatPayment,
    getPaymentByOrderId,
    getRefundByPaymentId,
    getPaymentByRefundId,
    delRefundFail,
    addWechatRefund,
    updateRefund,
    updateRemark,
    addBankPayment,
    updateBankStatus,
    addBankRefund,
    updateRefundRemark,
    getPaymentPrice,
    addBankPaymentByadmin,
    getAllRefund
}