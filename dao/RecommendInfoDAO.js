'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RecommendInfoDAO.js');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) => {
    let query = " insert into recommend_info (admin_id,name,introduction,page_url) values (?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.name;
    paramsArray[i++] = params.introduction;
    paramsArray[i] = params.pageUrl;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('add');
        callback(error,rows);
    })
}
const select = (params,callback) => {
    let query = " select * from recommend_info";
    query += " where 1=1";
    let paramsArray = [],i=0;
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
    if (params.pageUrl){
        paramsArray[i++] = params.pageUrl;
        query += " , page_url = ?";
    }
    paramsArray[i] = params.recommendId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRecommend');
        callback(error,rows);
    })
}
const selectAchievement = (params,callback) => {
    let paramsArray = [],i=0;
    let query = " select ri.id,ri.name,ri.mp_url,count(ui.id) user_count,sum(case when auth_status = 1 then 1 else 0 end) auth_count ";
    query += " from recommend_info ri left join user_info ui on ri.id = ui.recommend_id ";
    if(params.recommendOnStart){
        paramsArray[i++] = params.recommendOnStart;
        query = query + " and date_format(ui.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.recommendOnEnd){
        paramsArray[i++] = params.recommendOnEnd;
        query = query + " and date_format(ui.created_on,'%Y-%m-%d') <= ? ";
    }
    query += " where 1=1";
    if (params.recommendId){
        paramsArray[i++] = params.recommendId;
        query += " and ri.id = ?";
    }
    if (params.recommendName){
        paramsArray[i++] = params.recommendName;
        query += " and ri.name = ?";
    }
    query = query + " group by ri.id order by ri.id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('selectAchievement');
        callback(error,rows);
    })
}
module.exports={
    add,
    select,
    update,
    selectAchievement
}