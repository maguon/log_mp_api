'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CommodityDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getCommodity = (params,callback) => {
    let query = "select * from commodity_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.commodityId){
        paramsArray[i++] = params.commodityId;
        query = query + " and id = ? ";
    }
    if(params.commodityName){
        paramsArray[i++] = params.commodityName;
        query = query + " and commodity_name = ? ";
    }
    if(params.actualPrice){
        paramsArray[i++] = params.actualPrice;
        query = query + " and actual_price = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? "
    }
    query = query + " and show_status = 0 "
    query = query + " order by id asc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getCommodity');
        callback(error,rows);
    })
}
const addCommodity = (params,callback)=>{
    let query = "insert into commodity_info (commodity_name,image,desc,original_actual_price,actual_price,type,earnest_money,quantity,saled_quantity,status) values(?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.commodityName;
    paramsArray[i++]=params.image;
    paramsArray[i++]=params.desc;
    paramsArray[i++]=params.originalPrice;
    paramsArray[i++]=params.actualPrice;
    paramsArray[i++]=params.type;
    paramsArray[i++]=params.earnestMoney;
    paramsArray[i++]=params.quantity;
    paramsArray[i++]=params.saledQuantity;
    paramsArray[i++]=params.status;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addCommodity');
        callback(error,rows);
    });
}
const updateCommodity = (params,callback)=>{
    let query = " update commodity_info set commodity_name=?, image=? ,desc=?, original_actual_price=?, actual_price=?, type=?, earnest_money=?, quantity=?, saled_quantity=? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.commodityName;
    paramsArray[i++]=params.image;
    paramsArray[i++]=params.desc;
    paramsArray[i++]=params.originalPrice;
    paramsArray[i++]=params.actualPrice;
    paramsArray[i++]=params.type;
    paramsArray[i++]=params.earnestMoney;
    paramsArray[i++]=params.quantity;
    paramsArray[i++]=params.saledQuantity;
    paramsArray[i] = params.commodityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateCommodity ');
        return callback(error,rows);
    });
}
const updateStatus = (params,callback) => {
    let query = " update commodity_info set status = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.commodityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
const deleteCommodity = (params,callback) => {
    let query = " update commodity_info set show_status = 1  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i] = params.commodityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' deleteCommodity ');
        return callback(error,rows);
    });
}
module.exports = {
    getCommodity,
    addCommodity,
    updateCommodity,
    updateStatus,
    deleteCommodity
}