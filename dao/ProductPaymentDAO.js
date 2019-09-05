'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductPaymentDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');
const sysConsts = require("../util/SystemConst")

const getPayment = (params,callback) => {
    let query = " select ppi.*,ui.user_name "
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
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and ppi.type = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(payment_info.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(payment_info.created_on,'%Y-%m-%d') <= ? ";
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
const addPayment = (params,callback) => {
    let query = " insert into product_payment_info (user_id,product_order_id,wx_order_id,date_id,total_fee,nonce_str,status,type,remark) values(?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.productOrderId;
    paramsArray[i++] = params.wxOrderId;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.nonceStr;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.type;
    paramsArray[i] = params.remark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addPayment');
        callback(error,rows)
    })
}
const updateWechatPayment = (params,callback) => {
    let query = " update product_payment_info set status=?,transaction_id=?,payment_time=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.transactionId;
    paramsArray[i++] = params.paymentTime;
    paramsArray[i] = params.productPaymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateWechatPayment');
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
module.exports = {
    getPayment,
    getPaymentByOrderId,
    getRealPaymentPrice,
    addPayment,
    updateWechatPayment,
    updateRemark
}