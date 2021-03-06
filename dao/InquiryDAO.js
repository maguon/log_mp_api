'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryDAO.js');
const db = require('../db/connection/MysqlDb.js');

const addRouteInquiry = (params,callback) => {
    let query = "insert into inquiry_info(distance,user_id,route_id,date_id,service_type,inquiry_name,start_id,end_id,start_city,end_city) values(?,?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.distance;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.routeId;
    paramsArray[i++] = params.dateId;
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
    let query = " select au.real_name as admin_user,ii.*,ui.user_name,ui.phone,cri.distance from inquiry_info ii " +
                " left join city_route_info cri on cri.route_id=ii.route_id " +
                " left join user_info ui on ui.id=ii.user_id " +
                " left join admin_user au on au.id=ii.admin_id " +
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
    if(params.startCityId){
        paramsArray[i++] = params.startCityId;
        query = query + " and ii.start_id = ? ";
    }
    if(params.endCityId){
        paramsArray[i++] = params.endCityId;
        query = query + " and ii.end_id = ? ";
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
    if(params.statusList){
        paramsArray[i++] = params.statusList;
        query = query + " and ii.status in (?) ";
    }
    query += " order by ii.id desc";
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
    let query = "update inquiry_info set total_trans_price = ?,total_insure_price = ?,remark=?,inquiry_time=?,status=?,admin_id =? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.totalTransPrice;
    paramsArray[i++] = params.totalInsurePrice;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.myDate;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.adminId;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateFeePrice');
        callback(error,rows);
    })
}
const updateFee = (params,callback) => {
    let query = "update inquiry_info set id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.inquiryId;
    if (params.carNum){
        paramsArray[i++] = params.carNum;
        query += " ,car_num = ?";
    }
    if (params.safePrice || params.safePrice == 0){
        paramsArray[i++] = params.safePrice;
        query += " ,ora_insure_price = ?";
    }
    if (params.fee || params.fee == 0){
        paramsArray[i++] = params.fee;
        query += " ,ora_trans_price = ?";
    }
    paramsArray[i] = params.inquiryId;
    query += "  where id = ? ";

    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateFee');
        callback(error,rows);
    })
}
const updateFeeByCar = (params,callback) => {
    let query = "update inquiry_info set ora_insure_price = ?,ora_trans_price = ?,car_num=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.safePrice;
    paramsArray[i++] = params.fee;
    paramsArray[i++] = params.carNum;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateFeeByCar');
        callback(error,rows);
    })
}
const cancelInquiry = (params,callback) => {
    let query = "update inquiry_info set status = 3,cancel_reason=?,cancel_time=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.markReason;
    paramsArray[i++] = params.myDate;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('cancelInquiry');
        callback(error,rows);
    })
}
const updateCarNum = (params,callback) => {
    let query = "update inquiry_info set car_num = ?,ora_trans_price = ?,ora_insure_price = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.carNum;
    paramsArray[i++] = params.oraTransPrice;
    paramsArray[i++] = params.oraInsurePrice;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateCarNum');
        callback(error,rows);
    })
}
const getById = (params,callback) => {
    let query = "select * from inquiry_info where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.inquiryId;
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and status = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getById');
        callback(error,rows);
    })
}
const statisticsByMonths =(params,callback) => {
    let paramsArray = [],i=0;
    let query = " select db.y_month,count(ii.id) inquiry_counts from date_base db ";
    query += " left join inquiry_info ii on db.id = ii.date_id";
    query += " where 1=1";
    if (params.startMonth && params.endMonth) {
        paramsArray[i++] = params.startMonth;
        paramsArray[i] = params.endMonth;
        query += " and db.y_month between ? and ? ";
    }
    query += " group by db.y_month  order by db.y_month desc";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('statisticsByMonths');
        callback(error,rows);
    })
}
const statisticsByDays =(params,callback) => {
    let paramsArray = [],i=0;
    let query = " select db.id,count(ii.id) inquiry_counts from date_base db ";
    query += " left join inquiry_info ii on db.id = ii.date_id";
    query += " where 1=1";
    if (params.startDay && params.endDay) {
        paramsArray[i++] = params.startDay;
        paramsArray[i] = params.endDay;
        query += " and db.id between ? and ? ";
    }
    query += " group by db.id  order by db.id desc";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('statisticsByDays');
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
    cancelInquiry,
    updateCarNum,
    getById,
    statisticsByMonths,
    statisticsByDays
}