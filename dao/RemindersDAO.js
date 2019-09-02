'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RemindersDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getReminders = (params,callback) => {
    let query = "select re.*,ui.user_name,ui.phone,ci.commodity_name,ci.original_price,ci.actual_price,ci.status from reminders re" +
        " left join user_info ui on ui.id = re.user_id " +
        " left join commodity_info ci on ci.id = re.commodity_id " +
        " where re.id is not null ";
    let paramsArray = [],i=0;
    if(params.reminderId){
        paramsArray[i++] = params.reminderId;
        query = query + " and re.id = ? ";
    }
    if(params.commodityId){
        paramsArray[i++] = params.commodityId;
        query = query + " and re.commodity_id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and ci.status = ? "
    }
    query = query + " order by re.id asc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getReminders');
        callback(error,rows);
    })
}
const addReminders = (params,callback)=>{
    let query = "insert into reminders (user_id,commodity_id,reminders_status,remarks) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.commodityId;
    paramsArray[i++]=params.status;
    paramsArray[i]=params.remarks;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addReminders');
        callback(error,rows);
    });
}
const updateReminders = (params,callback) => {
    let query = " update reminders set remarks = ?,reminders_status = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.remarks;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.reminderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateReminders ');
        return callback(error,rows);
    });
}
module.exports = {
    getReminders,
    addReminders,
    updateReminders
}