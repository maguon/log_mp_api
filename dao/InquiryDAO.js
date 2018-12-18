'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addRouteInquiry = (params,callback) => {
    let query = "insert into inquiry_info(user_id,route_id,service_type,inquiry_name,start_id,end_id,start_city,end_city) values(?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.routeId;
    paramsArray[i++] = params.serviceType;
    paramsArray[i++] = params.inquiryName;
    paramsArray[i++] = params.startId;
    paramsArray[i++] = params.endId;
    paramsArray[i++] = params.startCity;
    paramsArray[i] = params.endCity;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRouteInquiry');
        callback(error,rows);
    })
}
const getInquiryByUserId = (params,callback) => {
    let query = " select ii.*,cri.route_start_id,cri.route_start,cri.route_end_id,cri.route_end,ui.user_name,ui.phone,cri.distance from inquiry_info ii " +
                " left join city_route_info cri on cri.route_id=ii.route_id " +
                " left join user_info ui on ui.id=ii.user_id " +
                " where ii.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ii.user_id = ? "
    }
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and ii.id = ? "
    }
    if(params.serviceType){
        paramsArray[i++] = params.serviceType;
        query = query + " and ii.service_type = ? "
    }
    if(params.modelId){
        paramsArray[i++] = params.modelId;
        query = query + " and ii.model_id = ? ";
    }
    if(params.routStartId){
        paramsArray[i++] = params.routStartId;
        query = query + " and ii.start_id = ? ";
    }
    if(params.routEndId){
        paramsArray[i++] = params.routEndId;
        query = query + " and ii.end_id = ? ";
    }
    if(params.oldCar){
        paramsArray[i++] = params.oldCar;
        query = query + " and ii.old_car = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
    }
    if(params.routeStart){
        paramsArray[i++] = params.routeStart;
        query = query + " and cri.route_start_id = ? ";
    }
    if(params.routeEnd){
        paramsArray[i++] = params.routeEnd;
        query = query + " and cri.route_end_id = ? ";
    }
    if(params.serviceType){
        paramsArray[i++] = params.serviceType;
        query = query + " and ii.service_type = ? ";
    }
    if(params.inquiryTimeStart){
        paramsArray[i++] = params.inquiryTimeStart + " 00:00:00";
        query = query + " and ii.created_on >= ? ";
    }
    if(params.inquiryTimeEnd){
        paramsArray[i++] = params.inquiryTimeEnd + " 23:59:59";
        query = query + " and ii.created_on <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and ii.status = ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryByUserId');
        callback(error,rows)
    })
}
const updateInquiryStatus = (params,callback) => {
    let query = "update inquiry_info set status = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryStatus');
        callback(error,rows);
    })
}
const updateFeePrice = (params,callback) => {
    let query = "update inquiry_info set fee_price = ?,mark=?,inquiry_time=?,status=1 where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.feePrice;
    paramsArray[i++] = params.mark;
    paramsArray[i++] = params.myDate;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateFeePrice');
        callback(error,rows);
    })
}
const updateFee = (params,callback) => {
    let query = "update inquiry_info set fee = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.fee;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateFee');
        callback(error,rows);
    })
}
const updateFeeByCar = (params,callback) => {
    let query = "update inquiry_info set fee = ?,car_num=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.fee;
    paramsArray[i++] = params.carNum;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateFeeByCar');
        callback(error,rows);
    })
}
const cancelInquiry = (params,callback) => {
    let query = "update inquiry_info set status = 3,mark_reason=?,cancel_time=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.markReason;
    paramsArray[i++] = params.myDate;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('cancelInquiry');
        callback(error,rows);
    })
}
module.exports = {
    addRouteInquiry,
    getInquiryByUserId,
    updateInquiryStatus,
    updateFeePrice,
    updateFee,
    updateFeeByCar,
    cancelInquiry
}