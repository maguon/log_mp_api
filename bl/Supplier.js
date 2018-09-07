'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Supplier.js');
const supplierDAO = require('../dao/SupplierDAO.js');

const addSupplier = (req,res,next) => {
    let params = req.params;
    supplierDAO.addSupplier(params,(error,result)=>{
        if(error){
            logger.error('addSupplier' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addSupplier' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const querySupplier = (req,res,next) => {
    let params = req.params;
    supplierDAO.querySupplier(params,(error,rows)=>{
        if(error){
            logger.error('querySupplier' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            let supplier = {
                supplierAdd: rows[0].supplier_add,
                supplierName: rows[0].supplier_name,
                mark: rows[0].mark
            }
            logger.info('querySupplier' + 'success');
            resUtil.resetQueryRes(res,supplier,null);
            return next();
        }
    })
}
const addSupplierBank = (req,res,next) => {
    let params = req.params;
    supplierDAO.addSupplierBank(params,(error,result)=>{
        if(error){
            logger.error('addSupplierBank' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addSupplierBank' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const querySupplierBank = (req,res,next) => {
    let params = req.params;
    supplierDAO.querySupplierBank(params,(error,rows)=>{
        if(error){
            logger.error('querySupplierBank' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            let BankInfo = {
                supplierBank: rows[0].bank,
                supplierBankCode: rows[0].bank_code,
                mark: rows[0].name
            }
            logger.info('querySupplierBank' + 'success');
            resUtil.resetQueryRes(res,BankInfo,null);
            return next();
        }
    })
}
const delSupplierBank = (req,res,next) => {
    let params = req.params;
    supplierDAO.delSupplierBank(params,(error,result)=>{
        if(error){
            logger.error('delSupplierBank' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('delSupplierBank' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const addSupplierContact = (req,res,next) => {
    let params = req.params;
    supplierDAO.addSupplierBank(params,(error,result)=>{
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
    supplierDAO.querySupplierBank(params,(error,rows)=>{
        if(error){
            logger.error('querySupplierContact' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            let BankInfo = {
                supplierBank: rows[0].bank,
                supplierBankCode: rows[0].bank_code,
                mark: rows[0].name
            }
            logger.info('querySupplierContact' + 'success');
            resUtil.resetQueryRes(res,BankInfo,null);
            return next();
        }
    })
}
const delSupplierContact = (req,res,next) => {
    let params = req.params;
    supplierDAO.delSupplierBank(params,(error,result)=>{
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
    addSupplier,
    querySupplier,
    addSupplierBank,
    querySupplierBank,
    delSupplierBank,
    addSupplierContact,
    querySupplierContact,
    delSupplierContact
}