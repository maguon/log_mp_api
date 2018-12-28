'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RefundApplyDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addRefundApply = (params,callback) => {
    let query = " update user_order set recv_name=?,recv_phone=?,recv_address=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i++] = params.recvAddress;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRefundApply');
        callback(error,rows);
    })
}
const getRefundApply = (params,callback) => {
    let query = " select uo.*,ii.service_type from inquiry_info ii " +
                " left join user_info ui on ui.id=ii.user_id " +
                " left join user_order uo on uo.inquiry_id = ii.id " +
                " where ii.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ii.user_id = ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRefundApply');
        callback(error,rows)
    })
}
module.exports = {
    addRefundApply,
    getRefundApply
}