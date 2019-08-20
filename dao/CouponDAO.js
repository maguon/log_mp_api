'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CouponDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getCoupon = (params,callback) => {
    let query = "select * from coupon where id is not null ";
    let paramsArray = [],i=0;
    if(params.couponId){
        paramsArray[i++] = params.couponId;
        query = query + " and id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? "
    }
    query = query + " and show_status = 0 "
    query = query + " order by id asc";
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