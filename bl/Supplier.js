'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const logger = serverLogger.createLogger('Supplier.js');
const supplierDAO = require('../dao/SupplierDAO.js');

const addSupplier = (req,res,next) => {
    let params = req.params;
    supplierDAO.addSupplier(params,(error,result)=>{
        if(error){
            logger.error('addSupplier ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addSupplier ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const querySupplier = (req,res,next) => {
    let params = req.params;
    supplierDAO.querySupplier(params,(error,result)=>{
        if(error){
            logger.error('querySupplier ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('querySupplier ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateSupplier = (req,res,next) => {
    let params = req.params;
    supplierDAO.updateSupplier(params,(error,result)=>{
        if(error){
            logger.error('updateSupplier ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateSupplier ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateAdvancedSetting = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        supplierDAO.querySupplier(params,(error,rows)=>{
            if(error){
                logger.error('updateAdvancedSetting querySupplier ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('updateAdvancedSetting querySupplier ' + 'success');
                if (rows.length<1){
                    resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NOT_EXISTS);
                } else {
                    resolve();
                }
            }
        })
    }).then(()=>{
        supplierDAO.updateById(params,(error,result)=>{
            if(error){
                logger.error('updateAdvancedSetting updateById ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info('updateAdvancedSettingupdateById ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const updateCloseFlag = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        supplierDAO.querySupplier(params,(error,rows)=>{
            if(error){
                logger.error('updateCloseFlag querySupplier ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('updateCloseFlag querySupplier ' + 'success');
                if (rows.length<1){
                    resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NOT_EXISTS);
                } else {
                    resolve();
                }
            }
        })
    }).then(()=>{
        supplierDAO.updateCloseFlag(params,(error,result)=>{
            if(error){
                logger.error('updateCloseFlag ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info('updateCloseFlag ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const getSupplierBusiness = (req,res,next) => {
    let params = req.params;
    supplierDAO.getSupplierWithLoadTask(params,(error,result)=>{
        if(error){
            logger.error('getSupplierBusiness ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getSupplierBusiness ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addSupplier,
    querySupplier,
    updateSupplier,
    updateAdvancedSetting,
    updateCloseFlag,
    getSupplierBusiness
}