'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CouponDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');
const encrypt = require('../util/Encrypt.js');

const getCoupon = (params,callback) => {
    let query = "select * from coupon where id is not null ";
    let paramsArray = [],i=0;
    if(params.couponId){
        paramsArray[i++] = params.couponId;
        query = query + " and id = ? ";
    }
    if(params.couponName){
        paramsArray[i++] = params.couponName;
        query = query + " and coupon_name = ?";
    }
    if(params.effectiveDays){
        paramsArray[i++] = params.effectiveDays;
        query = query + " and effective_days = ? "
    }
    if(params.validDateFrom){
        paramsArray[i++] = params.validDateFrom;
        query = query + " and valid_date_from = ?";
    }
    if(params.validDateTo){
        paramsArray[i++] = params.validDateTo;
        query = query + " and valid_date_to = ? "
    }
    if(params.thresholdCost){
        paramsArray[i] = params.thresholdCost;
        query = query + " and threshold_cost = ? "
    }
    if(params.price){
        paramsArray[i] = params.price;
        query = query + " and price = ? "
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and status = ? "
    }
    if(params.delStatus){
        paramsArray[i] = params.delStatus;
        query = query + " and del_status = ? "
    }
    query = query + " and show_status = 0 "
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getCoupon');
        callback(error,rows);
    })
}
const updateCoupon = (params,callback)=>{
    let query = " update coupon set coupon_name = ? , effective_days = ?, valid_date_from = ? ,valid_date_to = ?,threshold_cost = ?,price = ?,status = ?,del_status = ? ,show_status = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.couponName;
    paramsArray[i++]=params.effectiveDays;
    paramsArray[i++]=params.validDateFrom;
    paramsArray[i++]=params.validDateTo;
    paramsArray[i++]=params.thresholdCost;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.status;
    paramsArray[i++]=params.delStatus;
    paramsArray[i++]=params.showStatus;
    paramsArray[i] = params.couponId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateCoupon ');
        return callback(error,rows);
    });
}
const updateStatus = (params,callback) => {
    let query = " update coupon set status = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.couponId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
const addCoupon = (params,callback)=>{
    let query = "insert into coupon (coupon_name,effective_days,valid_date_from,valid_date_to,threshold_cost,price,status,del_status,show_status) values(?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.couponName;
    paramsArray[i++]=params.effectiveDays;
    paramsArray[i++]=params.validDateFrom;
    paramsArray[i++]=params.validDateTo;
    paramsArray[i++]=params.thresholdCost;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.status;
    paramsArray[i++]=params.delStatus;
    paramsArray[i]=params.showStatus;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addCoupon');
        callback(error,rows);
    });
}
const deleteCoupon = (params,callback) => {
    let query = " update coupon set show_status = ?  where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.showStatus;
    paramsArray[i] = params.couponId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' deleteCoupon ');
        return callback(error,rows);
    });
}
module.exports = {
    getCoupon,
    updateCoupon,
    updateStatus,
    addCoupon,
    deleteCoupon
}