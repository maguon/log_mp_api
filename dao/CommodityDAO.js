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
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and city_id = ? ";
    }
    if(params.commodityName){
        paramsArray[i++] = params.commodityName;
        query = query + " and commodity_name = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? "
    }
    if(params.showStatus){
        paramsArray[i++] = params.showStatus;
        query = query + " and show_status = ? "
    }
    query = query + " order by id desc";
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
    let query = "insert into commodity_info (city_id,city_name,commodity_name,image,info,production_date,original_price,actual_price,type,earnest_money,quantity,saled_quantity,status,show_status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i++]=params.commodityName;
    paramsArray[i++]=params.image;
    paramsArray[i++]=params.info;
    paramsArray[i++]=params.productionDate;
    paramsArray[i++]=params.originalPrice;
    paramsArray[i++]=params.actualPrice;
    paramsArray[i++]=params.type;
    paramsArray[i++]=params.earnestMoney;
    paramsArray[i++]=params.quantity;
    paramsArray[i++]=params.saledQuantity;
    paramsArray[i++]=params.status;
    paramsArray[i]=params.showStatus;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addCommodity');
        callback(error,rows);
    });
}
const updateImage = (params,callback) => {
    let query = " update commodity_info set image = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.image;
    paramsArray[i] = params.commodityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateImage ');
        return callback(error,rows);
    });
}
const updateProdImages = (params,callback) => {
    let query = " update commodity_info set pord_images = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.prodImages;
    paramsArray[i] = params.commodityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateProdImages ');
        return callback(error,rows);
    });
}
const updateInfo = (params,callback) => {
    let query = " update commodity_info set info = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.info;
    paramsArray[i] = params.commodityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateInfo ');
        return callback(error,rows);
    });
}
const updateCommodity = (params,callback)=>{
    let query = " update commodity_info set city_id=?, city_name=?,commodity_name=? ,production_date=?, original_price=?, actual_price=?, type=?, earnest_money=?, quantity=? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i++]=params.commodityName;
    paramsArray[i++]=params.productionDate;
    paramsArray[i++]=params.originalPrice;
    paramsArray[i++]=params.actualPrice;
    paramsArray[i++]=params.type;
    paramsArray[i++]=params.earnestMoney;
    paramsArray[i++]=params.quantity;
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
const updateShowStatus = (params,callback) => {
    let query = " update commodity_info set show_status = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.showStatus;
    paramsArray[i] = params.commodityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateShowStatus ');
        return callback(error,rows);
    });
}
const updateSaledQuantityOrStatus = (params,callback) => {
    let query = " update commodity_info set saled_quantity = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.saledQuantity;
    if(params.status){
        query += ", status = ?";
        paramsArray[i++] = params.status;
    }
    query += " where id = ?";
    paramsArray[i] = params.commodityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateSaledQuantityOrStatus ');
        return callback(error,rows);
    });
}
module.exports = {
    getCommodity,
    addCommodity,
    updateImage,
    updateProdImages,
    updateInfo,
    updateCommodity,
    updateStatus,
    updateShowStatus,
    updateSaledQuantityOrStatus
}