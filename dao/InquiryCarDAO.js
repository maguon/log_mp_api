'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryCarDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryCarByInquiryId = (params,callback) => {
    let query = " select ic.id,ic.inquiry_id,ic.model_id,ic.old_car,ic.plan,ic.trans_price,ic.car_num,ic.status,ic.safe_status,ic.insure_price,ic.created_on," +
                " ic.updated_on,ic.trans_price*ic.car_num as trans_total,ic.plan*ic.car_num as plan_total from inquiry_car ic " +
                " where ic.id is not null and ic.status = ?";
    let paramsArray = [],i=0;
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and ic.inquiry_id = ? "
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ic.user_id = ? "
    }
    if(params.inquiryCarId){
        paramsArray[i++] = params.inquiryCarId;
        query = query + " and ic.id = ? "
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and ic.type = ? "
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and ic.status = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryCarByInquiryId');
        callback(error,rows)
    })
}
const addCar = (params,callback) => {
    let query = " insert into inquiry_car(user_id,inquiry_id,model_id,old_car,plan,trans_price,insure_price,car_num,safe_status) values(?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.inquiryId;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.plan;
    paramsArray[i++] = params.transPrice;
    paramsArray[i++] = params.insurePrice;
    paramsArray[i++] = params.carNum;
    paramsArray[i] = params.safeStatus;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addCar');
        callback(error,rows)
    })
}
const addCarByOrder = (params,callback) => {
    let query = " insert into inquiry_car(user_id,inquiry_id,model_id,old_car,plan,fee,type,vin,car_num) values(?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.inquiryId;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.plan;
    paramsArray[i++] = params.fee;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.vin;
    paramsArray[i] = params.carNum;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addCarByOrder');
        callback(error,rows)
    })
}
const updateStatus = (params,callback) => {
    let query = " update inquiry_car set status=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.inquiryCarId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows)
    })
}
const updateInquiryCar = (params,callback) => {
    let query = " update inquiry_car set safe_status=?,insure_price=?,model_id=?,old_car=?,plan=?,trans_price=?,car_num=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.safeStatus;
    paramsArray[i++] = params.safePrice;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.plan;
    paramsArray[i++] = params.fee;
    paramsArray[i++] = params.carNum;
    paramsArray[i] = params.inquiryCarId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryCar');
        callback(error,rows)
    })
}
const getInquiryCar = (params,callback) => {
    let query = " select ic.id,ic.inquiry_id,ic.model_id,ic.old_car,ic.plan,ic.trans_price,ic.car_num,ic.status,ic.safe_status,ic.insure_price,ic.created_on," +
                " ic.updated_on,ic.trans_price*ic.car_num as trans_total,ic.plan*ic.car_num as plan_total from inquiry_car ic " +
                " where ic.id is not null ";
    let paramsArray = [],i=0;
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and ic.inquiry_id = ? "
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ic.user_id = ? "
    }
    if(params.inquiryCarId){
        paramsArray[i++] = params.inquiryCarId;
        query = query + " and ic.id = ? "
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and ic.type = ? "
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and ic.status = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryCar');
        callback(error,rows)
    })
}
const getSumPrice = (params,callback) => {
    let query = " select sum(trans_price * car_num) trans_price ,sum(insure_price*car_num) insure_price,sum(car_num) sum_car_num from inquiry_car where inquiry_id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getSumPrice');
        callback(error,rows)
    })
}
module.exports = {
    getInquiryCarByInquiryId,
    addCar,
    addCarByOrder,
    updateStatus,
    updateInquiryCar,
    getInquiryCar,
    getSumPrice
}