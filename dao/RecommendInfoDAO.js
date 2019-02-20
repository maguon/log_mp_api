'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RecommendInfoDAO.js');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) => {
    let query = " insert into recommend_info (admin_id,name,introduction) values (?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.name;
    paramsArray[i] = params.introduction;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('add');
        callback(error,rows);
    })
}
const select = (params,callback) => {
    let query = " select id,admin_id,name,introduction,content,status,mp_url,created_on,updated_on from recommend_info";
    query += " where 1=1";
    let paramsArray = [],i=0;
    if (params.adminId){
        paramsArray[i++] = params.adminId;
        query += " and admin_id = ?";
    }
    if (params.recommendId){
        paramsArray[i++] = params.recommendId;
        query += " and id = ?";
    }
    if (params.name){
        paramsArray[i] = params.name;
        query += " and name = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('selectRecommend');
        callback(error,rows);
    })
}
const update = (params,callback) => {
    let query = " update recommend_info set id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.recommendId;
    if (params.adminId){
        paramsArray[i++] = params.adminId;
        query += " , admin_id = ?";
    }
    if (params.recommendId){
        paramsArray[i++] = params.recommendId;
        query += " , id = ?";
    }
    if (params.name){
        paramsArray[i++] = params.name;
        query += " , name = ?";
    }
    if (params.introduction){
        paramsArray[i++] = params.introduction;
        query += " , introduction = ?";
    }
    if (params.content){
        paramsArray[i++] = params.content;
        query += " , content = ?";
    }
    if (params.mpUrl){
        paramsArray[i++] = params.mpUrl;
        query += " , mp_url = ?";
    }
    paramsArray[i] = params.recommendId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRecommend');
        callback(error,rows);
    })
}
module.exports={
    add,
    select,
    update
}