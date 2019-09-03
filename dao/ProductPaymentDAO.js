'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductPaymentDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');
const sysConsts = require("../util/SystemConst")

const getPaymentPrice = (params,callback) => {
    let query = " select (uo.total_trans_price + uo.total_insure_price) as total_price,sum(pi.total_fee) as payment_price,(uo.total_trans_price + uo.total_insure_price - sum(pi.total_fee)) as surplus_price from payment_info pi " +
                " left join order_info uo on uo.id=pi.order_id " +
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
    let query = " select admin_user.real_name createOrderUser,payment_info.*,(total_trans_price+total_insure_price - real_payment_price) unpaid_price from product_payment_info"
                +" left join order_info on payment_info.order_id = order_info.id"
                +" left join admin_user on order_info.admin_id = admin_user.id"
                +" where payment_info.id is not null";
    let paramsArray = [],i=0;
    if(params.managerId){
        paramsArray[i++] = params.managerId;
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
        query = query + " and payment_info.payment_type = ? ";
    }

    if(params.type){
        paramsArray[i++] = params.type;
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
    if (params.unWxUnpaid || params.unWxUnpaid ==0 ){
        paramsArray[i++] = params.unWxUnpaid;
        query += " and if(payment_type = 1 and payment_info.status = 0,1,0) = ?";
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
    let query = " insert into product_payment_info (user_id,product_order_id,wx_order_id,date_id,total_fee,nonce_str,status,type) values(?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.productOrderId;
    paramsArray[i++] = params.wxOrderId;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.nonceStr;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.type;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addPayment');
        callback(error,rows)
    })
}

module.exports = {
    getPaymentPrice,
    getPayment,
    addPayment
}