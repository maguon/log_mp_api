'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryUserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getAdminUser = (params,callback) => {
    let query = "select * from user_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and is = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? ";
    }
    if(params.wechatStatus){
        paramsArray[i++] = params.wechatStatus;
        query = query + " and wechat_status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and created_on <= ? ";
    }
    if(params.authTimeStart){
        paramsArray[i++] = params.authTimeStart;
        query = query + " and auth_time >= ? ";
    }
    if(params.authTimeEnd){
        paramsArray[i++] = params.authTimeEnd;
        query = query + " and auth_time <= ? ";
    }
    if(params.authStatus){
        paramsArray[i++] = params.authStatus;
        query = query + " and auth_status = ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query = query + " limit  ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAdminUser');
        callback(error,rows)
    })
}
const getUserById = (params,callback) => {
    let query = "select user_name,id,wechat_status,auth_status,phone,auth_time,created_on,last_login_on from user_info where id is not null and id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserById');
        callback(error,rows)
    })
}
const getUserByIdInquiry = (params,callback) => {
    let query = " select ii.*,cri.route_start,cri.route_end from inquiry_info ii " +
                " left join city_route_info cri on cri.route_id=ii.route_id " +
                " left join user_info ui on ui.id=ii.user_id " +
                " where ii.user_id = ? ";
    let paramsArray = [],i=0;
        paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserByIdInquiry');
        callback(error,rows)
    })
}
const getUserInquiryById = (params,callback) => {
    let query = " select ii.service_type,ii.created_on,ii.status,cri.route_start,cri.route_end from inquiry_info ii " +
                " left join city_route_info cri on cri.route_id=ii.route_id " +
                " left join user_info ui on ui.id=ii.user_id " +
                " where ii.user_id = ? and ii.id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserInquiryById');
        callback(error,rows)
    })
}
const getUserByIdInquiryIdRoute = (params,callback) => {
    let query = "select uc.model_id,uc.old_car,uc.plan,uc.fee,uc.car_num,uc.plan*uc.car_num as plan_sum,uc.car_num*uc.fee as fee_sum from inquiry_info ii " +
                "left join user_info ui on ui.id=ii.user_id " +
                "left join inquiry_car uc on uc.inquiry_id = ii.id " +
                "where ii.user_id = ? and ii.id = ? ";
    let paramsArray = [],i=0;
        paramsArray[i++] = params.userId;
        paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAdminUserIdRouteId');
        callback(error,rows)
    })
}
const getUserIdRouteIdOrder = (params,callback) => {
    let query = "select uo.* from inquiry_info ii " +
                "left join user_info ui on ui.id=ii.user_id " +
                "left join inquiry_order uo on uo.inquiry_id = ii.id " +
                "where ii.user_id = ? and ii.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserIdRouteIdOrder');
        callback(error,rows)
    })
}
const getUserContact = (params,callback) => {
    let query = "select c.name,c.phone,c.city,c.address from inquiry_contact c " +
                "left join user_info ui on c.user_id=ui.id " +
                "where ui.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserContact');
        callback(error,rows)
    })
}
const getUserBank = (params,callback) => {
    let query = "select ub.bank,ub.bank_code,ub.account_name from inquiry_bank ub " +
                "left join user_info ui on ub.user_id=ui.id " +
                "where ui.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserBank');
        callback(error,rows)
    })
}
const getUserInvoice = (params,callback) => {
    let query = "select uii.company_name,uii.tax_number,uii.company_address,uii.bank,uii.bank_code,uii.company_phone from inquiry_invoice uii " +
                "left join user_info ui on uii.user_id=ui.id " +
                "where ui.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserInvoice');
        callback(error,rows)
    })
}
module.exports = {
    getAdminUser,
    getUserById,
    getUserByIdInquiry,
    getUserByIdInquiryIdRoute,
    getUserInquiryById,
    getUserIdRouteIdOrder,
    getUserContact,
    getUserBank,
    getUserInvoice
}