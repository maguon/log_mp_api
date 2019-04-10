'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CityDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addCity = (params,callback) =>{
    let query = "insert into city_info(city_name,city_pinyin,city_py) values(?,?,?) ";
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
    query = query + " order by city_py asc ";
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
    let query = "update city_info set city_name = ?, city_pinyin = ?,city_py = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.cityName;
    paramsArray[i++] = params.cityPinYin;
    paramsArray[i++] = params.cityPY;
    paramsArray[i] = params.cityId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateCity');
        callback(error,rows);
    })
}
const queryCityAdmin = (params,callback) =>{
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
    query = query + " and city_name <> 'a' and city_name <> 'b' and city_name <> 'c' and city_name <> 'd' and city_name <> 'e' and city_name <> 'f' and city_name <> 'g' and city_name <> 'h' and city_name <> 'i' and city_name <> 'j' and city_name <> 'k' and city_name <> 'l' " +
                    " and city_name <> 'm' and city_name <> 'n' and city_name <> 'o' and city_name <> 'p' and city_name <> 'q' and city_name <> 'r' and city_name <> 's' and city_name <> 't' and city_name <> 'u' and city_name <> 'v' and city_name <> 'w' and city_name <> 'x' and city_name <> 'y' and city_name <> 'z' ";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryCityAdmin');
        callback(error,rows);
    })
}
module.exports ={
    addCity,
    queryCity,
    updateCity,
    queryCityAdmin
}
