'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryManageDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryManageId = (params,callback) => {
    let query = "select ii.id,ii.created_on,ii.status,ii.phone,ii.inquiry_name,ii.user_id,cri.route_start,cri.route_end from inquiry_info ii left join city_route_info cri on cri.route_id=ii.route_id where ii.user_id = ? and ii.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.inquiryManageId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryManageId');
        callback(error,rows);
    })
}
const getInquiryManage = (params,callback) => {
    let query = "select ii.car_num,ii.service_type,ii.fee,ii.user_id,ii.inquiry_name,ii.phone,ii.created_on,ii.status,cri.route_start,cri.route_end from city_route_info cri left join inquiry_info ii on ii.route_id=cri.route_id where ii.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ii.user_id = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ii.phone = ? ";
    }
    if(params.routeStart){
        paramsArray[i++] = params.routeStart;
        query = query + " and cri.route_start = ? ";
    }
    if(params.routeEnd){
        paramsArray[i++] = params.routeEnd;
        query = query + " and cri.route_end = ? ";
    }
    if(params.serviceType){
        paramsArray[i++] = params.serviceType;
        query = query + " and ii.service_type = ? ";
    }
    if(params.inquiryTimeStart){
        paramsArray[i++] = params.inquiryTimeStart;
        query = query + " and ii.created_on >= ? ";
    }
    if(params.inquiryTimeEnd){
        paramsArray[i++] = params.inquiryTimeEnd;
        query = query + " and ii.created_on <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and ii.status = ? ";
    }
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryManage');
        callback(error,rows);
    })
}
const updateInquiryManageStatus = (params,callback) => {
    let query = "update inquiry_info set status = ? where id = ? and user_id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.inquiryManageId;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryManageStatus');
        callback(error,rows);
    })
}
const getInquiryManageCar = (params,callback) => {
    let query = "select uc.model_id,uc.old_car,uc.plan,uc.fee,uc.car_num,uc.plan*uc.car_num as plan_sum,uc.car_num*uc.fee as fee_sum from inquiry_info ii " +
        "left join user_info ui on ui.id=ii.user_id " +
        "left join inquiry_car uc on uc.inquiry_id = ii.id " +
        "where ii.user_id = ? and ii.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.inquiryManageId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryManageCar');
        callback(error,rows);
    })
}
const addInquiryManageOrder = (params,callback) => {
    let query = "insert into inquiry_order(inquiry_id,fee_price,freight_price,mark) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.inquiryManageId;
    paramsArray[i++] = params.feePrice;
    paramsArray[i++] = params.freightPrice;
    paramsArray[i] = params.mark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addInquiryManageOrder');
        callback(error,rows);
    })
}
const getInquiryManageOrder = (params,callback) => {
    let query = "select io.* from inquiry_order io left join inquiry_info ii on ii.id=io.inquiry_id where io.id is not null ";
    let paramsArray = [],i=0;
    if(params.inquiryManageId){
        paramsArray[i++] = params.inquiryManageId;
        query = query + " and io.inquiry_id = ? ";
    }
    query = query + " order by created_on desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryManageOrder');
        callback(error,rows);
    })
}
module.exports = {
    getInquiryManage,
    getInquiryManageId,
    updateInquiryManageStatus,
    getInquiryManageCar,
    addInquiryManageOrder,
    getInquiryManageOrder
}