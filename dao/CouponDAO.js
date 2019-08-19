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
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and admin_id = ? ";
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
    if(params.effectiveDays){
        paramsArray[i++] = params.effectiveDays;
        query = query + " and effective_days = ? "
    }
    if(params.startDate){
        paramsArray[i++] = params.startDate;
        query = query + " and start_date = ?";
    }
    if(params.endDate){
        paramsArray[i++] = params.endDate;
        query = query + " and end_date = ? "
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
    if(params.delStatus){
        paramsArray[i++] = params.delStatus;
        query = query + " and del_status = ? "
    }
    if(params.remarks){
        paramsArray[i++] = params.remarks;
        query = query + " and Remarks = ? "
    }
    query = query + " and show_status = 0 "
    query = query + " order by id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getCoupon');
        callback(error,rows);
    })
}
const updateCoupon = (params,callback)=>{
    let query = " update coupon set coupon_name = ?,coupon_type = ? ,effective_days = ?, start_date = ? ,end_date = ?,floor_price = ?,price = ?,status = ?,del_status = ? ,show_status = ? ,remarks = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.couponName;
    paramsArray[i++]=params.couponType;
    paramsArray[i++]=params.effectiveDays;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.floorPrice;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.status;
    paramsArray[i++]=params.delStatus;
    paramsArray[i++]=params.showStatus;
    paramsArray[i++] = params.remarks;
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
    let query = "insert into coupon (admin_id,coupon_name,coupon_type,effective_days,start_date,end_date,floor_price,price,status,del_status,show_status,remarks) values(?,?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.adminId;
    paramsArray[i++]=params.couponName;
    paramsArray[i++]=params.couponType;
    paramsArray[i++]=params.effectiveDays;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.floorPrice;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.status;
    paramsArray[i++]=params.delStatus;
    paramsArray[i++]=params.showStatus;
    paramsArray[i]=params.remarks;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addCoupon');
        callback(error,rows);
    });
}
const deleteCoupon = (params,callback) => {
    let query = " update coupon set show_status = 1  where id = ?";
    let paramsArray=[],i=0;
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