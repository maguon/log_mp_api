'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryManageDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryManageId = (params,callback) => {
    let query = "select im.*,cri.route_start,cri.route_end from inquiry_manage im left join city_route_info cri on cri.route_id=im.route_id where im.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.inquiryManageId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryManageId');
        callback(error,rows);
    })
}
const getInquiryManage = (params,callback) => {
    let query = "select im.*,cri.route_start,cri.route_end from city_route_info cri left join inquiry_manage im on im.route_id=cri.route_id where im.id is not null ";
    let paramsArray = [],i=0;
    if(params.customerId){
        paramsArray[i++] = params.customerId;
        query = query + " and im.customerId = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and im.phone = ? ";
    }
    if(params.routeStart){
        paramsArray[i++] = params.routeStart;
        query = query + " and cri.route_start = ? ";
    }
    if(params.routeEnd){
        paramsArray[i++] = params.routeEnd;
        query = query + " and cri.route_end = ? ";
    }
    if(params.serviceModule){
        paramsArray[i++] = params.serviceModule;
        query = query + " and service_module = ? ";
    }
    if(params.inquiryTimeStart){
        paramsArray[i++] = params.inquiryTimeStart;
        query = query + " and created_on >= ? ";
    }
    if(params.inquiryTimeEnd){
        paramsArray[i++] = params.inquiryTimeEnd;
        query = query + " and created_on <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if(params.start&&params.size){
        paramsArray[i++] = params.start;
        paramsArray[i++] = params.size;
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryManage');
        callback(error,rows);
    })
}
const updateInquiryManageStatus = (params,callback) => {
    let query = "update inquiry_manage set status = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.inquiryManageId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryManageStatus');
        callback(error,rows);
    })
}
const getInquiryManageCar = (params,callback) => {
    let query = "select * from inquiry_manage_car where id is not null ";
    let paramsArray = [],i=0;
    if(params.inquiryManageId){
        paramsArray[i++] = params.inquiryManageId;
        query = query + " and inquiry_manage_id = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryManageCar');
        callback(error,rows);
    })
}
const addInquiryManageOrder = (params,callback) => {
    let query = "insert into inquiry_manage_order(inquiry_manage_id,estimated_total_freight,negotiating_total_freight,mark) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.inquiryManageId;
    paramsArray[i++] = params.estimatedTotalFreight;
    paramsArray[i++] = params.negotiatingTotalFreight;
    paramsArray[i] = params.mark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addInquiryManageOrder');
        callback(error,rows);
    })
}
const getInquiryManageOrder = (params,callback) => {
    let query = "select imo.* from inquiry_manage_order imo left join inquiry_manage im on im.id=imo.inquiry_manage_id where imo.id is not null ";
    let paramsArray = [],i=0;
    if(params.inquiryManageId){
        paramsArray[i++] = params.inquiryManageId;
        query = query + " and imo.inquiry_manage_id = ? ";
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