'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryCarDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryCarByInquiryId = (params,callback) => {
    let query = " select id,inquiry_id,model_id,old_car,plan,fee,car_num,vin,status,created_on,updated_on,fee/car_num as fee_solo,plan/car_num as plan_solo from inquiry_car where id is not null ";
    let paramsArray = [],i=0;
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and inquiry_id = ? "
    }
    if(params.type){
        paramsArray[i] = params.type;
        query = query + " and type = ? "
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and status = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryCarByInquiryId');
        callback(error,rows)
    })
}
const addCar = (params,callback) => {
    let query = " insert into inquiry_car(inquiry_id,model_id,old_car,plan,fee,car_num) values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
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
    let query = " insert into inquiry_car(inquiry_id,model_id,old_car,plan,fee,type,vin,car_num) values(?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
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
module.exports = {
    getInquiryCarByInquiryId,
    addCar,
    addCarByOrder,
    updateStatus
}