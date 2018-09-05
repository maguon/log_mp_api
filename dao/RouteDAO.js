'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RouteDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addRoute = (params,callback) => {
    let query = "insert into city_route_info (route_id,route_start_id,route_start,route_end_id,route_end,distance) values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    if(params.routeStartId > params.routeEndId){
        paramsArray[i++] = params.routeEndId+''+params.routeStartId;
    }else{
        paramsArray[i++] = params.routeStartId+''+params.routeEndId;
    }
    paramsArray[i++] = params.routeStartId;
    paramsArray[i++] = params.routeStart;
    paramsArray[i++] = params.routeEndId;
    paramsArray[i++] = params.routeEnd;
    paramsArray[i] = params.distance;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRoute')
        callback(error,rows);
    })
}
const getRoute = (params,callback) =>{
    let query = "";
    if(params.routeStartId && params.routeEndId){
        query = "select * from city_route_info where route_start_id = " + params.routeStartId + " and route_end_id = " + params.routeEndId +
                " union select * from city_route_info where route_end_id = " + params.routeStartId + " and route_start_id = " + params.routeEndId;
    }
    if(params.routeStartId && params.routeEndId == null){
        query = "select * from city_route_info where route_start_id = " + params.routeStartId  +
            " union select * from city_route_info where route_end_id = " + params.routeStartId ;
    }
    if(params.routeStartId  == null&& params.routeEndId){
        query = "select * from city_route_info where route_start_id = " + params.routeEndId  +
            " union select * from city_route_info where route_end_id = " + params.routeEndId ;
    }
    let paramsArray = [],i=0;
    if(params.routeId){
        paramsArray[i++] = params.routeId;
        query = query + " and route_id = ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = params.start;
        paramsArray[i++] = params.size;
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRoute');
        callback(error,rows);
    })
}
const updateRoute = (params,callback) => {
    let query = "update city_route_info set route_id=?,route_start_id=?,route_start=?,route_end_id=?,route_end=?,distance=? where route_id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.routeNewId;
    paramsArray[i++] = params.routeStartId;
    paramsArray[i++] = params.routeStart;
    paramsArray[i++] = params.routeEndId;
    paramsArray[i++] = params.routeEnd;
    paramsArray[i++] = params.distance;
    paramsArray[i] = params.routeId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRoute');
        callback(error,rows);
    })
}
module.exports = {
    addRoute,
    getRoute,
    updateRoute
}