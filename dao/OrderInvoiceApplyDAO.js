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

module.exports = {
    addOrderInvoiceApply
}