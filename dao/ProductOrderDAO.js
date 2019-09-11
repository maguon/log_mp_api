'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductOrderDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getOrderPaymentStatus = (params,callback) => {
    let query = " select ci.type "
        +" from product_order_item poi"
        +" left join  product_order_info poin on poin.id = poi.product_order_id"
        +" left join commodity_info ci on ci.id = poi.commodity_id "
        +" where poi.id is not null";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and poin.user_id = ? ";
    }
    if(params.productOrderId){
        paramsArray[i++] = params.productOrderId;
        query = query + " and poi.product_order_id = ? ";
    }
    query = query + " order by poi.id desc";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPaymentStatus');
        callback(error,rows)
    })
}
const getUserProductOrder = (params,callback) => {
    let query = "select * from product_order_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? "
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and payment_status = ? "
    }
    query = query + " order by id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserProductOrder');
        callback(error,rows);
    })
}
const getUserProductOrderAndItem = (params,callback) => {
    let query = "select poi.*,poit.commodity_id,poit.commodity_name,poit.city_id,poit.city_name,poit.type " +
        "from product_order_info poi " +
        " left join product_order_item poit on poit.product_order_id = poi.id " +
        "where poi.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and poi.user_id = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and poi.id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and poi.status = ? "
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and poi.payment_status = ? "
    }
    query = query + " order by poi.id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserProductOrderAndItem');
        callback(error,rows);
    })
}
const getProductOrder = (params,callback) => {
    let query = "select poi.*,poit.commodity_id,poit.commodity_name,poit.city_id,poit.city_name,poit.type,ui.user_name,ui.phone " +
        "from product_order_info poi " +
        " left join product_order_item poit on poit.product_order_id = poi.id " +
        " left join user_info ui on ui.id = poi.user_id " +
        "where poi.id is not null ";
    let paramsArray = [],i=0;
    if(params.productOrderId){
        paramsArray[i++] = params.productOrderId;
        query = query + " and poi.id = ? ";
    }
    if(params.commodityId){
        paramsArray[i++] = params.commodityId;
        query = query + " and poit.commodity_id = ? ";
    }
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and poit.city_id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and poi.user_id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and poi.status = ? "
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and poi.payment_status = ? "
    }
    query = query + " order by poi.id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getProductOrder');
        callback(error,rows);
    })
}
const addProductOrder = (params,callback)=>{
    let query = "insert into product_order_info (" +
        "user_id,date_id,ora_trans_price,act_trans_price,earnest_money,real_payment_price,payment_status,status,send_name,send_phone,send_address,remark,payment_remark" +
        ")values(?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.oraTransPrice;
    paramsArray[i++]=params.actTransPrice;
    paramsArray[i++]=params.earnestMoney;
    paramsArray[i++]=params.realPaymentPrice;
    paramsArray[i++]=params.paymentStatus;
    paramsArray[i++]=params.status;
    paramsArray[i++]=params.sendName;
    paramsArray[i++]=params.sendPhone;
    paramsArray[i++]=params.sendAddress;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.paymentRemark;
    // paramsArray[i++]=params.departureTime;
    // paramsArray[i++]=params.arriveTime;
    // paramsArray[i++]=params.cancelTime;
    // paramsArray[i]=params.cancelReason;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addProductOrder');
        callback(error,rows);
    });
}
const updateProductOrder = (params,callback) => {
    let query = " update product_order_info set user_id = ?";
    let paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
    }
    if(params.dateId){
        query += " ,date_id = ?";
        paramsArray[i++] = params.dateId;
    }
    if(params.oraTransPrice){
        query += " ,ora_trans_price = ?";
        paramsArray[i++] = params.oraTransPrice;
    }
    if(params.actTransPrice){
        query += " ,act_trans_price = ?";
        paramsArray[i++] = params.actTransPrice;
    }
    if(params.earnestMoney){
        query += " ,earnest_money = ?";
        paramsArray[i++] = params.earnestMoney;
    }
    if(params.paymentStatus){
        query += " ,payment_status = ?";
        paramsArray[i++] = params.paymentStatus;
    }
    query += " where id = ?";
    paramsArray[i] = params.productOrderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateProductOrder ');
        return callback(error,rows);
    });
}
const updateRemark = (params,callback) => {
    let query = " update product_order_info set remark = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.remark;
    paramsArray[i] = params.productOrderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateRemark ');
        return callback(error,rows);
    });
}
const updateSendInfo = (params,callback) => {
    let query = " update product_order_info set send_name = ? ";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.sendName;
    if(params.sendPhone){
        query += " ,send_phone = ?";
        paramsArray[i++] = params.sendPhone;
    }
    if(params.sendAddress){
        query += " ,send_address = ?";
        paramsArray[i++] = params.sendAddress;
    }
    paramsArray[i] = params.productOrderId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateSendInfo ');
        return callback(error,rows);
    });
}
const updateStatus = (params,callback) => {
    let query = " update product_order_info set status = ? ";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    if(params.departureTime){
        query += " ,departure_time = ?";
        paramsArray[i++] = params.departureTime;
    }
    if(params.arriveTime){
        query += " ,arrive_time = ?";
        paramsArray[i++] = params.arriveTime;
    }
    if(params.cancelTime){
        query += " ,cancel_time = ?";
        paramsArray[i++] = params.cancelTime;
    }
    paramsArray[i] = params.productOrderId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
const updateStatusOrPrice = (params,callback) => {
    let query = " update product_order_info set ";
    let paramsArray=[],i=0
    if(params.paymentStatus){
        query += " payment_status = ?";
        paramsArray[i++] = params.paymentStatus;
    }
    if(params.realPaymentPrice){
        query += ", real_payment_price = ?";
        paramsArray[i++] = params.realPaymentPrice;
    }
    paramsArray[i] = params.productOrderId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatusOrPrice ');
        return callback(error,rows);
    });
}
const updateRealPaymentPrice =(params,callback) => {
    let query = " update product_order_info set real_payment_price = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.realPaymentPrice;
    paramsArray[i] = params.productOrderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRealPaymentPrice');
        callback(error,rows);
    })
}
module.exports = {
    getOrderPaymentStatus,
    getUserProductOrder,
    getUserProductOrderAndItem,
    getProductOrder,
    addProductOrder,
    updateProductOrder,
    updateSendInfo,
    updateRemark,
    updateStatus,
    updateStatusOrPrice,
    updateRealPaymentPrice
}