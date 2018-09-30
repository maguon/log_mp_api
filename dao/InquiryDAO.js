'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addRouteInquiry = (params,callback) => {
    let query = "insert into inquiry_info(user_id,route_id,service_type,model_id,old_car,phone,inquiry_name,plan,fee) values(?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.routeId;
    paramsArray[i++] = params.serviceType;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.inquiryName;
    paramsArray[i++] = params.plan;
    paramsArray[i] = params.fee;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRouteInquiry');
        callback(error,rows);
    })
}
const getInquiryByUserId = (params,callback) => {
    let query = " select ii.*,cri.route_start,cri.route_end from inquiry_info ii " +
                " left join city_route_info cri on cri.route_id=ii.route_id " +
                " left join user_info ui on ui.id=ii.user_id " +
                " where 1=1 ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ii.user_id = ? "
    }
    if(params.inquiryId){
        paramsArray[i] = params.inquiryId;
        query = query + " and ii.id = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryByUserId');
        callback(error,rows)
    })
}
module.exports = {
    addRouteInquiry,
    getInquiryByUserId
}