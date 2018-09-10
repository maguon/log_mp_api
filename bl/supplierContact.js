'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('SupplierContact.js');
const supplierContactDAO = require('../dao/SupplierContactDAO.js');

const addSupplierContact = (req,res,next) => {
    let params = req.params;
    supplierContactDAO.addSupplierContact(params,(error,result)=>{
        if(error){
            logger.error('addSupplierContact' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addSupplierContact' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const querySupplierContact = (req,res,next) => {
    let params = req.params;
    supplierContactDAO.querySupplierContact(params,(error,result)=>{
        if(error){
            logger.error('querySupplierContact' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('querySupplierContact' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const delSupplierContact = (req,res,next) => {
    let params = req.params;
    supplierContactDAO.delSupplierContact(params,(error,result)=>{
        if(error){
            logger.error('delSupplierContact' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('delSupplierContact' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addSupplierContact,
    querySupplierContact,
    delSupplierContact
}