'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserCouponDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getUserCoupon = (params,callback) => {
    let query = "select * from user_coupon where id is not null ";
    let paramsArray = [],i=0;
    if(params.founderId){
        paramsArray[i++] = params.founderId;
        query = query + " and admin_id = ? ";
    }
    if(params.founderName){
        paramsArray[i++] = params.founderName;
        query = query + " and admin_name = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }
    if(params.couponId){
        paramsArray[i++] = params.couponId;
        query = query + " and coupon_id = ? ";
    }
    if(params.userCouponId){
        paramsArray[i++] = params.userCouponId;
        query = query + " and id = ? ";
    }
    if(params.ReceiveDateStart){
        paramsArray[i++] = params.ReceiveDateStart;
        query = query + " and created_on >= ? "
    }
    if(params.ReceiveDateEnd){
        paramsArray[i++] = params.ReceiveDateEnd;
        query = query + " and created_on <= ? "
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? "
    }
    query = query + " order by id asc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserCoupon');
        callback(error,rows);
    })
}
const addUserCoupon = (params,callback)=>{
    let query = "insert into user_coupon (admin_id,admin_name,user_id,user_name,phone,coupon_id,coupon_name,coupon_type,effective_days,start_date,end_date,floor_price,price,status,remarks) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.adminId;
    paramsArray[i++]=params.adminName;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.phone;
    paramsArray[i++]=params.couponId;
    paramsArray[i++]=params.couponName;
    paramsArray[i++]=params.couponType;
    paramsArray[i++]=params.effectiveDays;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.floorPrice;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.status;
    paramsArray[i]=params.remarks;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addUserCoupon');
        callback(error,rows);
    });
}

module.exports = {
    getUserCoupon,
    addUserCoupon,
}