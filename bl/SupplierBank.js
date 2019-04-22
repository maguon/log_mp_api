'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('SupplierBank.js');
const supplierBankDAO = require('../dao/SupplierBankDAO.js');

const addSupplierBank = (req,res,next) => {
    let params = req.params;
    supplierBankDAO.addSupplierBank(params,(error,result)=>{
        if(error){
            logger.error('addSupplierBank ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addSupplierBank ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const querySupplierBank = (req,res,next) => {
    let params = req.params;
    supplierBankDAO.querySupplierBank(params,(error,result)=>{
        if(error){
            logger.error('querySupplierBank ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('querySupplierBank ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const delSupplierBank = (req,res,next) => {
    let params = req.params;
    supplierBankDAO.delSupplierBank(params,(error,result)=>{
        if(error){
            logger.error('delSupplierBank ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('delSupplierBank ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addSupplierBank,
    querySupplierBank,
    delSupplierBank
}