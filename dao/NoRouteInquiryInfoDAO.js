'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('NoRouteInquiryInfoDAO.js');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) => {
    let query = " insert into inquiry_route_none_info (user_id,date_id,route_id,start_city,end_city,start_id,end_id,service_type,oldCar_flag,car_num,valuation,car_model_type,car_insure_flag)";
    query += "  values(?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.routeId;
    paramsArray[i++] = params.startCity;
    paramsArray[i++] = params.endCity;
    paramsArray[i++] = params.startId;
    paramsArray[i++] = params.endId;
    paramsArray[i++] = params.serviceType;
    paramsArray[i++] = params.oldCarFlag;
    paramsArray[i++] = params.carNum;
    paramsArray[i++] = params.valuation;
    paramsArray[i++] = params.carModelType;
    paramsArray[i] = params.carInsureFlag;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addNoRouteInquiryInfo');
        callback(error,rows);
    })
}

module.exports = {
    add
}