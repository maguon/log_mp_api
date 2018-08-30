'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const createMail = (user,callback)=>{
    let query = "insert into email (user) values(?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = user;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('createMail');
        callback(error,rows);
    });
};
module.exports = {
    createMail
};