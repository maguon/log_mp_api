'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductOrderDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getProductOrder = (params,callback) => {
    let query = "select poi.*,poit.city_id,poit.city_name,ui.id,ui.user_name,ui.phone from product_order_info poi" +
        " left join user_info ui on ui.id=poi.user_id " +
        " left join product_order_item poit on poit.product_order_id=poi.id " +
        "where poi.id is not null ";
    let paramsArray = [],i=0;
    if(params.productOrderId){
        paramsArray[i++] = params.productOrderId;
        query = query + " and poi.id = ? ";
    }
    if(params.commodityId){
        paramsArray[i++] = params.commodityId;
        query = query + " and poi.commodity_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and poi.payment_status = ? "
    }
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and poit.city_id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and poi.status = ? "
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ui.id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? "
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? "
    }
    query = query + " order by poi.id asc";
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