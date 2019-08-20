'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AppkyCouponDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getApplyCoupon = (params,callback) => {
    let query = "select * from apply_coupon where id is not null ";
    let paramsArray = [],i=0;
    if(params.userCouponId){
        paramsArray[i++] = params.userCouponId;
        query = query + " and user_coupon_id = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getApplyCoupon');
        callback(error,rows);
    })
}

module.exports = {
    getApplyCoupon
}