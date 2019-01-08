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
const getInvoiceList = (params,callback) => {
    let query = " select oia.*,oi.real_payment_price,au.real_name from order_invoice_apply oia left join order_info oi on oia.order_id =oi.id  ";
    query = query + " left join admin_user au on oi.admin_id = au.id where oia.id is not null";
    let paramsArray = [],i=0;
    if(params.invoiceApplyId){
        paramsArray[i++] = params.invoiceApplyId;
        query = query + " and oia.id = ? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and oia.order_id = ? ";
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
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(oia.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(oia.created_on,'%Y-%m-%d') <= ? ";
    }
    if(params.updatedOnStart){
        paramsArray[i++] = params.updatedOnStart;
        query = query + " and date_format(oia.created_on,'%Y-%m-%d') >= ? ";
    }
    if(params.updatedOnEnd){
        paramsArray[i++] = params.updatedOnEnd;
        query = query + " and date_format(oia.created_on,'%Y-%m-%d') <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and oia.status = ? ";
    }
    query = query + " order by oia.created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInvoiceList');
        callback(error,rows)
    })
}
const updateStatus = (params,callback) => {
    let query = " update order_invoice_apply set status = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.invoiceApplyId;
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
module.exports = {
    addOrderInvoiceApply,
    getInvoiceList,
    updateStatus,
    updateOrderId
}