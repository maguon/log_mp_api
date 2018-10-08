'use strict';

const db=require('../db/connection/MysqlDb.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AdminUserDAO.js');

const createAdminUser = (params,callback) => {
    let query = " insert into admin_user (user_name,real_name,password,phone,status) values ( ? , ? , ? , ? , ? )";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.realName;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.phone;
    paramsArray[i]=params.status;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' createAdminUser ');
        return callback(error,rows);
    });
}
const queryAdminUser = (params,callback) => {
    let query = " select * from admin_user where id is not null ";
    let paramsArray=[],i=0;
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryAdminUser ');
        return callback(error,rows);
    });
}
const queryAdminInfo = (params,callback) => {
    let query = " select * from admin_user where id is not null";
    let paramsArray=[],i=0;
    if(params.adminId){
        query = query + " and id = ? ";
        paramsArray[i++]=params.adminId;
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryUser ');
        return callback(error,rows);
    });
}
const updateInfo = (params,callback) => {
    let query = " update admin_user set real_name = ? ,phone = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.realName;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateInfo ');
        return callback(error,rows);
    });
}
const updatePassword = (params,callback) => {
    let query = " update admin_user set password = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updatePassword ');
        return callback(error,rows);
    });

}

module.exports = {
    createAdminUser,
    queryAdminUser,
    queryAdminInfo,
    updateInfo,
    updatePassword
}