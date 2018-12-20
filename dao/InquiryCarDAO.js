'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryCarDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryCarByInquiryId = (params,callback) => {
    let query = " select ic.id,ic.inquiry_id,ic.model_id,ic.old_car,ic.plan,ic.fee,ic.car_num,ic.status,ic.safe_status,ic.safe_price,ic.created_on," +
                " ic.updated_on,ic.fee/ic.car_num as fee_solo,ic.plan/ic.car_num as plan_solo from inquiry_car ic " +
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
        logger.debug('getInquiryCarByInquiryId');
        callback(error,rows)
    })
}
const addCar = (params,callback) => {
    let query = " insert into inquiry_car(safe_price,safe_status,user_id,inquiry_id,model_id,old_car,plan,fee,car_num) values(?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.safePrice;
    paramsArray[i++] = params.safeStatus;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.inquiryId;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.plan;
    paramsArray[i++] = params.fee;
    paramsArray[i] = params.carNum;
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
    let query = " update inquiry_car set model_id=?,old_car=?,plan=?,fee=?,car_num=? where id = ?";
    let paramsArray = [],i=0;
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
module.exports = {
    getInquiryCarByInquiryId,
    addCar,
    addCarByOrder,
    updateStatus,
    updateInquiryCar
}