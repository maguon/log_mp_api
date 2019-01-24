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
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryAdminUser ');
        return callback(error,rows);
    });
}
const queryAdminInfo = (params,callback) => {
    let query = " select au.*,di.department_name from admin_user au left join department_info di on au.type = di.id where au.id is not null";
    query += " and di.status = 0";
    let paramsArray=[],i=0;
    if(params.adminId){
        query = query + " and au.id = ? ";
        paramsArray[i++]=params.adminId;
    }
    if(params.realName){
        query = query + " and au.real_name = ? ";
        paramsArray[i++]=params.realName;
    }
    if(params.gender){
        query = query + " and au.gender = ? ";
        paramsArray[i++]=params.gender;
    }
    if(params.status){
        query = query + " and au.status = ? ";
        paramsArray[i++]=params.status;
    }
    if(params.department){
        query = query + " and au.type = ? ";
        paramsArray[i++]=params.department;
    }
    query = query + " order by created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
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
const add = (params,callback) => {
    let query = " insert into admin_user (user_name,real_name,phone,password,type,gender) values (?,?,?,?,?,?)";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.realName;
    paramsArray[i++]=params.phone;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.department;
    paramsArray[i]=params.gender;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' addAdminUser ');
        return callback(error,rows);
    });
}
const updateStatus = (params,callback) => {
    let query = " update admin_user set status = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
module.exports = {
    createAdminUser,
    queryAdminUser,
    queryAdminInfo,
    updateInfo,
    updatePassword,add,
    updateStatus
}