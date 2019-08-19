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
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.couponId){
        paramsArray[i++] = params.couponId;
        query = query + " and id = ? ";
    }
    if(params.couponName){
        paramsArray[i++] = params.couponName;
        query = query + " and coupon_name = ?";
    }
    if(params.couponType){
        paramsArray[i++] = params.couponType;
        query = query + " and coupon_type = ?";
    }
    if(params.effectiveDate){
        paramsArray[i++] = params.effectiveDate;
        query = query + " and effective_date = ?";
    }
    if(params.expiringDate){
        paramsArray[i++] = params.expiringDate;
        query = query + " and expiring_date = ? "
    }
    if(params.floorPrice){
        paramsArray[i++] = params.floorPrice;
        query = query + " and floor_price = ? "
    }
    if(params.price){
        paramsArray[i++] = params.price;
        query = query + " and price = ? "
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? "
    }
    if(params.remarks){
        paramsArray[i++] = params.remarks;
        query = query + " and Remarks = ? "
    }
    query = query + " and show_status = 0 "
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
const updateUserCoupon = (params,callback)=>{
    let query = " update user_coupon set coupon_name = ?,coupon_type = ? ,effective_date = ? ,expiring_date = ?,floor_price = ?,price = ?,status = ? ,show_status = ? ,remarks = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.couponName;
    paramsArray[i++]=params.couponType;
    paramsArray[i++]=params.effectiveDate;
    paramsArray[i++]=params.expiringDate;
    paramsArray[i++]=params.floorPrice;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.status;
    paramsArray[i++]=params.showStatus;
    paramsArray[i++] = params.remarks;
    paramsArray[i] = params.userCouponId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateUserCoupon ');
        return callback(error,rows);
    });
}
const updateStatus = (params,callback) => {
    let query = " update user_coupon set status = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.userCouponId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
const addUserCoupon = (params,callback)=>{
    let query = "insert into user_coupon (admin_id,user_id,coupon_id,coupon_name,coupon_type,effective_date,expiring_date,floor_price,price,status,show_status,remarks) values(?,?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.adminId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.couponId;
    paramsArray[i++]=params.couponName;
    paramsArray[i++]=params.couponType;
    paramsArray[i++]=params.effectiveDate;
    paramsArray[i++]=params.expiringDate;
    paramsArray[i++]=params.floorPrice;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.status;
    paramsArray[i++]=params.showStatus;
    paramsArray[i]=params.remarks;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addUserCoupon');
        callback(error,rows);
    });
}
const deleteUserCoupon = (params,callback) => {
    let query = " update user_coupon set show_status = 1  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i] = params.userCouponId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' deleteUserCoupon ');
        return callback(error,rows);
    });
}
module.exports = {
    getUserCoupon,
    updateUserCoupon,
    updateStatus,
    addUserCoupon,
    deleteUserCoupon
}