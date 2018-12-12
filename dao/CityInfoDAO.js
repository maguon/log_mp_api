'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CityDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addCity = (params,callback) =>{
    let query = "insert into city_info(city_name,cityPinYin,cityPY) values(?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.cityName;
    paramsArray[i++] = params.cityPinYin;
    paramsArray[i] = params.cityPY;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addCity');
        callback(error,rows);
    })
}
const queryCity = (params,callback) =>{
    let query = "select * from city_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and id = ? "
    }
    if(params.cityName){
        paramsArray[i++] = params.cityName;
        query = query + " and city_name = ? "
    }
    query = query + " order by cityPY asc ";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryCity');
        callback(error,rows);
    })
}
const updateCity = (params,callback) =>{
    let query = "update city_info set city_name = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.cityName;
    paramsArray[i] = params.cityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateCity');
        callback(error,rows);
    })
}
module.exports ={
    addCity,
    queryCity,
    updateCity
}
