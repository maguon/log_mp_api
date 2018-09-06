'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addRouteInquiry = (params,callback) => {
    let query = "insert into inquiry_info(route_id,service_type,model_id,car_flag,vacation_money,fee)values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.routeId;
    paramsArray[i++] = params.serviceType;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.carFlag;
    paramsArray[i++] = params.vacationMoney;
    paramsArray[i] = params.fee;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRouteInquiry');
        callback(error,rows);
    })
}
const queryRouteInquiry = (params,callback) => {
    let query = "select ii.*,cri.route_start_id,cri.route_end_id,cri.distance from inquiry_info ii left join city_route_info cri on ii.route_id = cri.route_id where 1=1";
    let paramsArray = [],i=0;
    if(params.routeId){
        paramsArray[i++] = params.routeId;
        query = query + " and cri.route_id = ? "
    }
    if(params.serviceType){
        paramsArray[i++] = params.serviceType;
        query = query + " and ii.service_type = ? "
    }
    if(params.modelId){
        paramsArray[i++] = params.modelId;
        query = query + " and ii.model_id = ? "
    }
    if(params.carFlag){
        paramsArray[i++] = params.carFlag;
        query = query + " and ii.car_flag = ? "
    }
    if(params.vacationMoney){
        paramsArray[i++] = params.vacationMoney;
        query = query + " and ii.vacation_money = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryRouteInquiry');
        callback(error,rows);
    })
}
module.exports = {
    addRouteInquiry,
    queryRouteInquiry
}