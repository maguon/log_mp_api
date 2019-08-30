'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductOrderDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getProductOrder = (params,callback) => {
    let query = "select * from product_order_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.productOrderId){
        paramsArray[i++] = params.productOrderId;
        query = query + " and id = ? ";
    }
    if(params.commodityId){
        paramsArray[i++] = params.commodityId;
        query = query + " and commodity_id = ? ";
    }
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and city_id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? "
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? "
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and type = ? "
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and payment_status = ? "
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? "
    }
    query = query + " order by id asc";
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
const updateStatus = (params,callback) => {
    let query = " update product_order_info set status = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.productOrderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
module.exports = {
    getProductOrder,
    updateStatus
}