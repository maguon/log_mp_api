'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Supplier.js');
const supplierDAO = require('../dao/SupplierDAO.js');
const supplierBankDAO = require('../dao/SupplierBankDAO.js');
const supplierContactDAO = require('../dao/SupplierContactDAO.js')

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
    supplierDAO.querySupplier(params,(error,result)=>{
        if(error){
            logger.error('querySupplier' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('querySupplier' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateSupplier = (req,res,next) => {
    let params = req.params;
    supplierDAO.updateSupplier(params,(error,result)=>{
        if(error){
            logger.error('updateSupplier' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateSupplier' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const delSupplier = (req,res,next) => {
    let params = req.params;
    supplierBankDAO.querySupplierBank(params,(error,rows)=>{
        if(error){
            logger.error('delBank' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else if(rows && rows.length > 0){
            supplierDAO.delBank(params,(error,result)=>{
                if(error){
                    logger.error('delBank' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }else{
                    logger.info('delBank' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        }else{
            logger.info('delBank' + '已经清空');
            resUtil.resetQueryRes(res,'已经清空');
            return next();
        }
    })
    supplierContactDAO.querySupplierContact(params,(error,rows)=>{
        if(error){
            logger.error('delContact' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else if(rows && rows.length > 0){
            supplierDAO.delContact(params,(error,result)=>{
                if(error){
                    logger.error('delContact' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }else{
                    logger.info('delContact' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        }else{
            logger.info('delContact' + '已经清空');
            resUtil.resetQueryRes(res,'已经清空');
            return next();
        }
    })
    supplierDAO.delSupplier(params,(error,result)=>{
        if(error){
            logger.error('delSupplier' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('delSupplier' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addSupplier,
    querySupplier,
    updateSupplier,
    delSupplier,
}