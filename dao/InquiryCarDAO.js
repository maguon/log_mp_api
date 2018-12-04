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
        paramsArray[i] = params.inquiryId;
        query = query + " and inquiry_id = ? "
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
module.exports = {
    getInquiryCarByInquiryId,
    addCar
}