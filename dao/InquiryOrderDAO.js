'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryOrderDAO.js');
const sysConst = require("../util/SystemConst");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryOrder = (params,callback) => {
    let query = " select uo.*,ii.service_type from inquiry_info ii " +
                " left join user_info ui on ui.id=ii.user_id " +
                " left join order_info uo on uo.inquiry_id = ii.id " +
                " where ii.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ii.user_id = ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryOrder');
        callback(error,rows)
    })
}
const addInquiryOrder = (params,callback) => {
    let query = " insert into order_info(user_id,ora_insure_price,route_id,date_id,distance,route_start,route_end,route_start_id,route_end_id,admin_id,created_type,service_type,inquiry_id,ora_trans_price,car_num) ";
    query += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.oraInsurePrice;
    paramsArray[i++] = params.routeId;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.distance;
    paramsArray[i++] = params.routeStart;
    paramsArray[i++] = params.routeEnd;
    paramsArray[i++] = params.routeStartId;
    paramsArray[i++] = params.routeEndId;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.createdType;
    paramsArray[i++] = params.serviceType;
    paramsArray[i++] = params.inquiryId;
    paramsArray[i++] = params.oraTransPrice;
    paramsArray[i] = params.carNum;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addInquiryOrder');
        callback(error,rows);
    })
}
const putInquiryOrder = (params,callback) => {
    let query = " update order_info set ora_trans_price=?,ora_insure_price=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.oraTransPrice;
    paramsArray[i++] = params.oraInsurePrice;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putInquiryOrder');
        callback(error,rows);
    })
}
const putFreightPrice = (params,callback) => {
    let query = " update order_info set total_trans_price=?,total_insure_price=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.feePrice;
    paramsArray[i++] = params.totalInsurePrice;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putFreightPrice');
        callback(error,rows);
    })
}
const updatePrice = (params,callback) => {
    let query = " update order_info set ora_trans_price = ? ,ora_insure_price = ?,total_trans_price=?,total_insure_price=?,car_num=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.oraTransPrice;
    paramsArray[i++] = params.oraInsurePrice;
    paramsArray[i++] = params.totalTransPrice;
    paramsArray[i++] = params.totalInsurePrice;
    paramsArray[i++] = params.carNum;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePrice');
        callback(error,rows);
    })
}
const putSafePrice = (params,callback) => {
    let query = " update order_info set total_trans_price=?,total_insure_price=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.feePrice;
    paramsArray[i++] = params.safePrice;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putSafePrice');
        callback(error,rows);
    })
}
const getOrder = (params,callback) => {
    let query = " select uo.route_start_id as start_id,uo.route_end_id as end_id,uo.route_start as start_city,uo.route_end as end_city,au.id as admin_id,au.real_name as admin_name,ui.phone,ui.user_name,uo.* from order_info uo " +
                " left join user_info ui on ui.id=uo.user_id " +
                " left join inquiry_info ii on ii.id=uo.inquiry_id  " +
                " left join admin_user au on au.id=uo.admin_id " +
                " where uo.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uo.user_id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
    }
    if(params.realName){
        paramsArray[i++] = params.realName;
        query = query + " and au.real_name = ? ";
    }
    if(params.startCityId){
        paramsArray[i++] = params.startCityId;
        query = query + " and uo.route_start_id = ? ";
    }
    if(params.endCityId){
        paramsArray[i++] = params.endCityId;
        query = query + " and uo.route_end_id = ? ";
    }
    if(params.serviceType){
        paramsArray[i++] = params.serviceType;
        query = query + " and uo.service_type = ? ";
    }
    if(params.createdType){
        paramsArray[i++] = params.createdType;
        query = query + " and uo.created_type = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and uo.id = ? ";
    }
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and uo.inquiry_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and uo.payment_status = ? ";
    }
    if(params.logStatus){
        paramsArray[i++] = params.logStatus;
        query = query + " and uo.log_status = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and uo.status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart + " 00:00:00";
        query = query + " and uo.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd + " 23:59:59";
        query = query + " and uo.created_on <= ? ";
    }
    query += " order by uo.id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrder');
        callback(error,rows);
    })
}
const getOrderNew = (params,callback) => {
    let query = " select au.id as admin_id,au.real_name as admin_name,ui.phone,ui.user_name,uo.* from order_info uo " +
                " left join user_info ui on ui.id=uo.user_id " +
                " left join admin_user au on au.id=uo.admin_id " +
                " where uo.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uo.user_id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
    }
    if(params.realName){
        paramsArray[i++] = params.realName;
        query = query + " and au.real_name = ? ";
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
        query = query + " and uo.service_type = ? ";
    }
    if(params.createdType){
        paramsArray[i++] = params.createdType;
        query = query + " and uo.created_type = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and uo.id = ? ";
    }
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and uo.inquiry_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and uo.payment_status = ? ";
    }
    if(params.logStatus){
        paramsArray[i++] = params.logStatus;
        query = query + " and uo.log_status = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and uo.status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart + " 00:00:00";
        query = query + " and uo.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd + " 23:59:59";
        query = query + " and uo.created_on <= ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderNew');
        callback(error,rows);
    })
}
const getOrderByUser = (params,callback) => {
    let query = " select ii.total_trans_price as trans_price,ii.total_insure_price as insure_price,au.id as admin_id,au.real_name as admin_name,uo.car_num,ii.start_id,ii.end_id,ui.phone,ui.user_name,ii.start_city,ii.end_city,uo.* from order_info uo " +
                " left join user_info ui on ui.id=uo.user_id " +
                " left join inquiry_info ii on ii.id=uo.inquiry_id " +
                " left join admin_user au on au.id=uo.admin_id " +
                " where uo.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uo.user_id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
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
        query = query + " and uo.service_type = ? ";
    }
    if(params.createdType){
        paramsArray[i++] = params.createdType;
        query = query + " and uo.created_type = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and uo.id = ? ";
    }
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and uo.inquiry_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and uo.payment_status = ? ";
    }
    if(params.paymentStatusList){
        paramsArray[i++] = params.paymentStatusList;
        query = query + " and uo.payment_status in (?) ";
    }
    if(params.logStatus){
        paramsArray[i++] = params.logStatus;
        query = query + " and uo.log_status = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and uo.status = ? ";
    }
    if(params.statusList){
        paramsArray[i++] = params.statusList;
        query = query + " and uo.status in (?) ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart + " 00:00:00";
        query = query + " and uo.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd + " 23:59:59";
        query = query + " and uo.created_on <= ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderByUser');
        callback(error,rows);
    })
}
const putAdminMark = (params,callback) => {
    let query = " update order_info set admin_mark=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminMark;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('putAdminMark');
        callback(error,rows);
    })
}
const updateOrderPaymengStatusByOrderId = (params,callback) => {
    let query = "update order_info set payment_status = ? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.paymentStatus;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderPaymengStatusByOrderId');
        callback(error,rows);
    })
}
const cancelOrder = (params,callback) => {
    let query = "update order_info set status = 8,cancel_reason=?,cancel_time=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.cancelMark;
    paramsArray[i++] = params.myDate;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('cancelOrder');
        callback(error,rows);
    })
}
const addOrder = (params,callback) => {
    let query = " insert into order_info(route_id,date_id,distance,route_start,route_end,created_type,admin_id,route_start_id,route_end_id,service_type,departure_time) values(?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.routeId;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.distance;
    paramsArray[i++] = params.routeStart;
    paramsArray[i++] = params.routeEnd;
    paramsArray[i++] = params.createdType;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.routeStartId;
    paramsArray[i++] = params.routeEndId;
    paramsArray[i++] = params.serviceType;
    paramsArray[i] = params.departureTime;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrder');
        callback(error,rows);
    })
}
const updatePaymentRemark = (params,callback) => {
    let query = "update order_info set payment_remark = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.remark;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePaymentRemark');
        callback(error,rows);
    })
}
const getById =(params,callback) => {
    let query = " select * from order_info where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderById');
        callback(error,rows);
    })
}
const updateRealPaymentPrice =(params,callback) => {
    let query = " update order_info set real_payment_price = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.realPaymentPrice;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRealPaymentPrice');
        callback(error,rows);
    })
}
const updateById =(params,callback) => {
    let query = " update order_info set id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    if (params.routeId) {
        paramsArray[i++] = params.routeId;
        query += " ,route_id = ?"
    }
    if (params.routeStartId) {
        paramsArray[i++] = params.routeStartId;
        query += " ,route_start_id = ?"
    }
    if (params.routeEndId) {
        paramsArray[i++] = params.routeEndId;
        query += " ,route_end_id = ?"
    }
    if (params.distance) {
        paramsArray[i++] = params.distance;
        query += " ,distance = ?"
    }
    if (params.serviceType) {
        paramsArray[i++] = params.serviceType;
        query += " ,service_type = ?"
    }
    if (params.createdType) {
        paramsArray[i++] = params.createdType;
        query += " ,created_type = ?"
    }
    if (params.oraTransPrice) {
        paramsArray[i++] = params.oraTransPrice;
        query += " ,ora_trans_price = ?"
    }
    if (params.oraInsurePrice) {
        paramsArray[i++] = params.oraInsurePrice;
        query += " ,ora_insure_price = ?"
    }
    if (params.totalTransPrice) {
        paramsArray[i++] = params.totalTransPrice;
        query += " ,total_trans_price = ?"
    }
    if (params.totalInsurePrice) {
        paramsArray[i++] = params.totalInsurePrice;
        query += " ,total_insure_price = ?"
    }
    if (params.realPaymentPrice) {
        paramsArray[i++] = params.realPaymentPrice;
        query += " ,real_payment_price = ?"
    }
    if (params.carNum) {
        paramsArray[i++] = params.carNum;
        query += " ,car_num = ?"
    }
    if (params.recvName) {
        paramsArray[i++] = params.recvName;
        query += " ,recv_name = ?"
    }
    if (params.recvPhone) {
        paramsArray[i++] = params.recvPhone;
        query += " ,recv_phone = ?"
    }
    if (params.recvAddress) {
        paramsArray[i++] = params.recvAddress;
        query += " ,recv_address = ?"
    }
    if (params.sendName) {
        paramsArray[i++] = params.sendName;
        query += " ,send_name = ?"
    }
    if (params.sendPhone) {
        paramsArray[i++] = params.sendPhone;
        query += " ,send_phone = ?"
    }
    if (params.sendAddress) {
        paramsArray[i++] = params.sendAddress;
        query += " ,send_address = ?"
    }
    if (params.paymentStatus) {
        paramsArray[i++] = params.paymentStatus;
        query += " ,payment_status = ?"
    }
    if (params.status) {
        paramsArray[i++] = params.status;
        query += " ,status = ?"
    }
    if (params.logStatus) {
        paramsArray[i++] = params.logStatus;
        query += " ,log_status = ?"
    }
    if (params.remark) {
        paramsArray[i++] = params.remark;
        query += " ,remark = ?"
    }
    if (params.adminRemark) {
        paramsArray[i++] = params.adminRemark;
        query += " ,admin_mark = ?"
    }
    if (params.paymentRemark) {
        paramsArray[i++] = params.paymentRemark;
        query += " ,payment_remark = ?"
    }
    if (params.cancelReason) {
        paramsArray[i++] = params.cancelReason;
        query += " ,cancel_reason = ?"
    }
    if (params.sendAddressPointId) {
        paramsArray[i++] = params.sendAddressPointId;
        query += " ,send_address_point_id = ?"
    }
    if (params.recvAddressPointId) {
        paramsArray[i++] = params.recvAddressPointId;
        query += " ,recv_address_point_id = ?"
    }
    if (params.recvAddressPoint) {
        paramsArray[i++] = params.recvAddressPoint;
        query += " ,recv_address_point = ?"
    }
    if (params.sendAddressPoint) {
        paramsArray[i++] = params.sendAddressPoint;
        query += " ,send_address_point = ?"
    }
    paramsArray[i] = params.orderId;
    query += " where id = ? ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateById');
        callback(error,rows);
    })
}
const statisticsMonths =(params,callback) => {
    let paramsArray = [],i=0;
    let query = " select db.y_month ,count(oi.id) as order_counts, IFNULL(sum(oi.total_trans_price + oi.total_insure_price),0) as order_price";
    query += " from date_base db left join order_info oi on db.id=oi.date_id  ";
    if (params.createdType){
        paramsArray[i++] = params.createdType;
        query += " and oi.created_type = ?";
    }
    query += " where 1=1";
    if (params.startMonth && params.endMonth) {
        paramsArray[i++] = params.startMonth;
        paramsArray[i] = params.endMonth;
        query += " and db.y_month between ? and ? ";
    }
    query += " group by db.y_month  order by db.y_month desc";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('statisticsCountsByMounths');
        callback(error,rows);
    })
}
const statisticsByDays =(params,callback) => {
    let paramsArray = [],i=0;
    let query = " select db.id ,count(oi.id) as order_counts , IFNULL(sum(oi.total_trans_price + oi.total_insure_price),0) as order_price";
    query += " from date_base db left join order_info oi on db.id = oi.date_id";
    if (params.createdType){
        paramsArray[i++] = params.createdType;
        query += " and oi.created_type = ?";
    }
    query += " where 1=1";
    if (params.startDay && params.endDay) {
        paramsArray[i++] = params.startDay;
        paramsArray[i] = params.endDay;
        query += " and db.id between ? and ? ";
    }
    query += " group by db.id order by db.id desc";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('statisticsByDays');
        callback(error,rows);
    })
}
const getOrderProfit = (params,callback) => {
    let query = " select oi.id,oi.route_start,oi.route_end,oi.car_num,oi.service_type,oi.admin_id,oi.created_on,oi.total_trans_price,oi.total_insure_price";
    query += ",oi.real_payment_price,au.real_name,dlt.supplier_trans_price,dlt.supplier_insure_price,";
    query += "IFNULL((oi.real_payment_price - dlt.supplier_trans_price - dlt.supplier_insure_price),0) order_real_profit";
    query += " from order_info oi ";
    query += " left join (";
    query += "select order_id,sum(supplier_trans_price) supplier_trans_price,sum(supplier_insure_price) supplier_insure_price from dp_load_task group by order_id";
    query += " )dlt on oi.id = dlt.order_id";
    query += " left join admin_user au on oi.admin_id = au.id";
    query += " where dlt.order_id is not null";
    let paramsArray = [],i=0;
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and oi.id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and oi.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and oi.route_end_id = ? ";
    }
    if(params.serviceType){
        paramsArray[i++] = params.serviceType;
        query = query + " and oi.service_type = ? ";
    }
    if(params.createOrderUser){
        paramsArray[i++] = params.createOrderUser;
        query = query + " and oi.admin_id = ? ";
    }
    if(params.budgetStatus == sysConst.ORDER.budgetStatus.loss){
        query = query + " and (oi.real_payment_price - dlt.supplier_trans_price - dlt.supplier_insure_price) < 0 ";
    }else if (params.budgetStatus == sysConst.ORDER.budgetStatus.profit){
        query = query + " and (oi.real_payment_price - dlt.supplier_trans_price - dlt.supplier_insure_price) >= 0 ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart + " 00:00:00";
        query = query + " and oi.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd + " 23:59:59";
        query = query + " and oi.created_on <= ? ";
    }
    query += " order by oi.created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderProfit');
        callback(error,rows);
    })
}
module.exports = {
    getInquiryOrder,
    addInquiryOrder,
    putInquiryOrder,
    putFreightPrice,
    getOrder,
    updateOrderPaymengStatusByOrderId,
    cancelOrder,
    putAdminMark,
    getOrderByUser,
    putSafePrice,
    addOrder,
    getOrderNew,
    updatePrice,
    updatePaymentRemark,
    updateRealPaymentPrice,
    getById,
    updateById,
    statisticsMonths,
    statisticsByDays,
    getOrderProfit
}