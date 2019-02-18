'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SupplierDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addSupplier = (params,callback) => {
    let query = "insert into supplier_info(supplier_short,supplier_full,trans_type,remark) values(?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierShort;
    paramsArray[i++] = params.supplierFull;
    paramsArray[i++] = params.transType;
    paramsArray[i] = params.mark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addSupplier');
        callback(error,rows);
    })
}
const querySupplier = (params,callback) => {
    let query = "select * from supplier_info where id is not null";
    let paramsArray = [],i=0;
    if(params.supplierId){
        paramsArray[i++] = params.supplierId;
        query = query + " and id = ? ";
    }
    if(params.supplierShort){
        paramsArray[i++] = params.supplierShort;
        query = query + " and supplier_short = ? ";
    }
    if(params.supplierFull){
        paramsArray[i++] = params.supplierFull;
        query = query + " and supplier_full = ? ";
    }
    if(params.transType){
        paramsArray[i++] = params.transType;
        query = query + " and trans_type = ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('querySupplier');
        callback(error,rows);
    })
}
const updateSupplier = (params,callback) => {
    let query = "update supplier_info set supplier_short=?,supplier_full=?,trans_type=?,remark=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierShort;
    paramsArray[i++] = params.supplierFull;
    paramsArray[i++] = params.transType;
    paramsArray[i++] = params.mark;
    paramsArray[i] = params.supplierId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateSupplier');
        callback(error,rows);
    })
}
const delBank = (params,callback) => {
    let query = "delete from supplier_bank where supplier_id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.supplierId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delBank');
        callback(error,rows);
    })
}
const delContact = (params,callback) => {
    let query = "delete from supplier_contact where supplier_id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.supplierId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delContact');
        callback(error,rows);
    })
}
const delSupplier = (params,callback) => {
    let query = "delete from supplier_info where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.supplierId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delSupplier');
        callback(error,rows);
    })
}
const updateById = (params,callback) => {
    let query = "update supplier_info set id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierId;
    if (params.appId){
        paramsArray[i++] = params.appId;
        query += " ,app_id = ?";
    }
    if (params.appUrl){
        paramsArray[i++] = params.appUrl;
        query += " ,app_url = ?";
    }
    if (params.appSecret){
        paramsArray[i++] = params.appSecret;
        query += " ,app_secret = ?";
    }
    if (params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query += " ,base_addr_id = ?";
    }
    if (params.receiveId){
        paramsArray[i++] = params.receiveId;
        query += " ,receive_id = ?";
    }
    if (params.carModuleId){
        paramsArray[i++] = params.carModuleId;
        query += " ,car_module_id = ?";
    }
    paramsArray[i] = params.supplierId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateById');
        callback(error,rows);
    })
}
const updateCloseFlag = (params,callback) => {
    let query = "update supplier_info set close_flag=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.closeFlag;
    paramsArray[i] = params.supplierId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateCloseFlag');
        callback(error,rows);
    })
}
const getSupplierWithLoadTask = (params,callback) => {
    let query = "select si.id,si.supplier_short,si.supplier_full ,count(dlt.id) load_task_count,IFNULL(sum(dlt.car_count),0) total_car_num,";
    query += "IFNULL(sum(dlt.supplier_trans_price),0) total_supplier_trans_price,IFNULL(sum(dlt.supplier_insure_price),0) total_supplier_insure_price";
    query += " ,sum(case when dlt.payment_flag =1 then (supplier_trans_price + supplier_insure_price) else 0 end ) payment_price";
    query += " from supplier_info si left join dp_load_task dlt on si.id = dlt.supplier_id where 1=1";
    let paramsArray = [],i=0;
    if(params.supplierId){
        paramsArray[i++] = params.supplierId;
        query = query + " and si.id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(dlt.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(dlt.created_on,'%Y-%m-%d') <= ? ";
    }
    query += " group by si.id order by si.id desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getSupplierWithLoadTask');
        callback(error,rows);
    })
}
module.exports = {
    addSupplier,
    querySupplier,
    updateSupplier,
    delBank,
    delContact,
    delSupplier,
    updateById,
    updateCloseFlag,
    getSupplierWithLoadTask
}