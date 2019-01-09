'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderInvoiceApplyDAO.js');
const db = require('../db/connection/MysqlDb.js');

const addOrderInvoiceApply = (params,callback) => {
    let query = " insert into  order_invoice_apply (user_id,admin_id,order_id,title,tax_number,bank,bank_code,company_phone,company_address,remark) values (?,?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.title;
    paramsArray[i++] = params.taxNumber;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i++] = params.companyPhone;
    paramsArray[i++] = params.companyAddress;
    paramsArray[i] = params.remark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrderInvoiceApply');
        callback(error,rows)
    })
}
const updateStatus = (params,callback) => {
    let query = " update order_invoice_apply set status = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    if (params.refuseReason) {
        paramsArray[i++] = params.refuseReason;
        query += " ,refuse_reason = ?"
    }
    paramsArray[i] = params.invoiceApplyId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows)
    })
}
const updateOrderId = (params,callback) => {
    let query = " update order_invoice_apply set order_id = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    paramsArray[i] = params.invoiceApplyId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderId');
        callback(error,rows)
    })
}
const updateById = (params,callback) => {
    let query = " update order_invoice_apply set title = ? , tax_number = ? ,bank = ? ,bank_code = ? ,company_phone = ? ,company_address = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.title;
    paramsArray[i++] = params.taxNumber;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i++] = params.companyPhone;
    paramsArray[i++] = params.companyAddress;
    if (params.remark && params.remark != ''){
        paramsArray[i++] = params.remark;
        query = query+ " ,remark = ? ";
    }
    paramsArray[i] = params.invoiceApplyId;
    query = query + " where id = ?";

    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateById');
        callback(error,rows)
    })
}
const getOrderInvoice = (params,callback) => {
    let query = " select oi.id,oi.route_start,oi.route_end,oi.total_trans_price,oi.total_insure_price,oi.real_payment_price,oi.created_on,";
    query += " oi.payment_status,oi.created_type,au.real_name,oia.id invoice_apply_id,oia.tax_number,oia.title,oia.created_on apply_time,";
    query += " oia.bank ,oia.bank_code,oia.company_phone,oia.company_address,oia.remark,oi.car_num,oi.route_start,oi.route_end,oi.service_type,oia.refuse_reason,"
    query +=  " oia.updated_on invoiced_time,oia.status invoiced_status from order_info oi";
    query += " left join order_invoice_apply oia on oi.id = oia.order_id ";
    query +=  " left join admin_user au on oi.admin_id = au.id ";
    query +=  " where oi.id is not null ";
    let paramsArray = [],i=0;
    if(params.isApply){
        query = query + " and oia.id is not null ";
    }else {
        query = query + " and oia.id is null ";
        paramsArray[i++] = params.orderStatus;
        query = query + " and oi.status = ? ";
    }
    if(params.invoiceApplyId){
        paramsArray[i++] = params.invoiceApplyId;
        query = query + " and oia.id = ? ";
    }
    if(params.taxNumber){
        paramsArray[i++] = params.taxNumber;
        query = query + " and oia.tax_number = ? ";
    }
    if(params.title){
        paramsArray[i++] = params.title;
        query = query + " and oia.title = ? ";
    }
    if(params.createOrderUser){
        paramsArray[i++] = params.createOrderUser;
        query = query + " and au.real_name = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and oi.id= ? ";
    }
    if(params.invoiceApplyTimeStart){
        paramsArray[i++] = params.invoiceApplyTimeStart;
        query = query + " and date_format(oia.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.invoiceApplyTimeEnd){
        paramsArray[i++] = params.invoiceApplyTimeEnd;
        query = query + " and date_format(oia.created_on,'%Y-%m-%d') <= ? ";
    }
    if(params.invoicedTimeStart){
        paramsArray[i++] = params.invoicedTimeStart;
        query = query + " and date_format(oia.updated_on,'%Y-%m-%d') >= ? ";
    }
    if(params.invoicedTimeEnd){
        paramsArray[i++] = params.invoicedTimeEnd;
        query = query + " and date_format(oia.updated_on,'%Y-%m-%d') <= ? ";
    }
    if(params.invoiceStatus){
        paramsArray[i++] = params.invoiceStatus;
        query = query + " and oia.status= ? ";
    }
    if (params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and oi.route_start_id= ? ";
    }
    if (params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and oi.route_end_id= ? ";
    }
    if (params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and oi.payment_status= ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(oi.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(oi.created_on,'%Y-%m-%d') <= ? ";
    }
    if (params.isApply){
        query = query + " order by oia.created_on desc";
    } else {
        query = query + " order by oi.created_on desc";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderInvoice');
        callback(error,rows)
    })
}
const deleteRevokeInvoice = (params,callback) => {
    let query = " delete from order_invoice_apply where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.invoiceApplyId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('deleteRevokeInvoice');
        callback(error,rows)
    })
}
const getById = (params,callback) => {
    let query = " select * from order_invoice_apply where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.invoiceApplyId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getById');
        callback(error,rows)
    })
}
const getByOrderId = (params,callback) => {
    let query = " select * from order_invoice_apply where order_id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getByOrderId');
        callback(error,rows)
    })
}
module.exports = {
    addOrderInvoiceApply,
    updateStatus,
    updateOrderId,
    updateById,
    getOrderInvoice,
    deleteRevokeInvoice,
    getById,
    getByOrderId
}