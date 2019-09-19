'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PosterDAO.js');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) => {
    let query = " insert into poster_info (commodity_id,recommend_id,title,view_count,remark) values (?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.commodityId;
    paramsArray[i++] = params.recommendId;
    paramsArray[i++] = params.title;
    paramsArray[i++] = params.viewCount;
    paramsArray[i] = params.remark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addPoster');
        callback(error,rows);
    })
}
const select = (params,callback) => {
    let query = " select pi.*,ri.name from poster_info pi "+
        " left join recommend_info ri on ri.id = pi.recommend_id " +
        " where pi.id is not null ";
    let paramsArray = [],i=0;
    if (params.posterId){
        paramsArray[i++] = params.posterId;
        query += " and pi.id = ?";
    }
    if (params.commodityId){
        paramsArray[i++] = params.commodityId;
        query += " and pi.commodity_id = ?";
    }
    if (params.recommendId){
        paramsArray[i++] = params.recommendId;
        query += " and pi.recommend_id = ?";
    }
    if (params.recommendName){
        paramsArray[i++] = params.recommendName;
        query += " and ri.name = ?";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('selectPoster');
        callback(error,rows);
    })
}
const selectPosterInfo = (params,callback) => {
    let query = " select * from poster_info "+
        " where id is not null ";
    let paramsArray = [],i=0;
    if (params.posterId){
        paramsArray[i++] = params.posterId;
        query += " and id = ?";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('selectPosterInfo');
        callback(error,rows);
    })
}
const update = (params,callback) => {
    let query = " update poster_info set id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.posterId;
    if (params.recommendId){
        paramsArray[i++] = params.recommendId;
        query += " , recommend_id = ?";
    }
    if (params.title){
        paramsArray[i++] = params.title;
        query += " , title = ?";
    }
    if (params.remark){
        paramsArray[i++] = params.remark;
        query += " , remark = ?";
    }
    paramsArray[i] = params.posterId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePoster');
        callback(error,rows);
    })
}
const updateCount = (params,callback) => {
    let query = " update poster_info set view_count = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.viewCount;
    paramsArray[i] = params.posterId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateCount');
        callback(error,rows);
    })
}
module.exports={
    add,
    select,
    selectPosterInfo,
    update,
    updateCount
}