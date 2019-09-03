'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductOrderItemDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getUserProductOrderItem = (params,callback) => {
    let query = "select * from product_order_info" +
        "where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and poi.status = ? "
    }
    query = query + " order by id asc";
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
const addProductOrderItem = (params,callback)=>{
    let query = "insert into product_order_item (" +
        "product_order_id,commodity_id,commodity_name,city_id,city_name,type,original_price,actual_price,earnest_money" +
        ")values(?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.productOrderId;
    paramsArray[i++]=params.commodityId;
    paramsArray[i++]=params.commodityName;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i++]=params.type;
    paramsArray[i++]=params.originalPrice;
    paramsArray[i++]=params.actualPrice;
    paramsArray[i]=params.earnestMoney;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addProductOrderItem');
        callback(error,rows);
    });
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
    getUserProductOrderItem,
    addProductOrderItem,
    updateStatus
}