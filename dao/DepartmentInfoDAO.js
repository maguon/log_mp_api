'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('DepartmentInfoDAO.js');
const sysConfig = require("../config/SystemConfig");
const db = require('../db/connection/MysqlDb.js');

const insert =(params,callback)=>{
    let query = " insert into department_info (department_name,admin_id) values (?,?)";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.departmentName;
    paramsArray[i]=params.adminId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' addDepartmentInfo ');
        return callback(error,rows);
    });
}
const get =(params,callback)=>{
    let query = " select * from department_info where 1=1";
    let paramsArray=[],i=0;
    if (params.departmentId){
        paramsArray[i++]=params.departmentId;
        query += " and id = ?";
    }
    if (params.status){
        paramsArray[i]=params.status;
        query += " and status = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getDepartmentInfo ');
        return callback(error,rows);
    });
}
const updateById =(params,callback)=>{
    let query = " update department_info set id = ? ";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.departmentId;
    if (params.departmentName){
        paramsArray[i++]=params.departmentName;
        query += ",department_name = ?";
    }
    if (params.status){
        paramsArray[i++]=params.status;
        query += ",status = ?";
    }
    paramsArray[i]=params.departmentId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateById ');
        return callback(error,rows);
    });
}
module.exports ={
    insert,
    get,
    updateById
}