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
    let query = " select au.id,au.user_name,au.real_name,au.gender,au.phone,au.status,au.type";
    query += ",au.created_on,au.updated_on";
    query += " ,di.department_name from admin_user au left join department_info di on au.type = di.id where au.id is not null";
    let paramsArray=[],i=0;
    if (params.isSuperUserFlag == 1){
        query += " and di.id is NULL";
    }else if(params.isSuperUserFlag == 0){
        query += " and di.id is not NULL";
    }

    if(params.departmentStatus){
        query += " and di.status = ?";
        paramsArray[i++]=params.departmentStatus;
    }
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
    let query = " update admin_user set id = ? ";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.id;
    if (params.realName){
        query += " and real_name = ?";
        paramsArray[i++] = params.realName;
    }
    if (params.gender){
        query += " and gender = ?";
        paramsArray[i++] = params.gender;
    }
    if (params.department){
        query += " and type = ?";
        paramsArray[i++] = params.department;
    }
    query += " where id = ?";
    paramsArray[i] = params.id;
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