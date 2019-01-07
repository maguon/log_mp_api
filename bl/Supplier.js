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
            resUtil.resInternalError(error,res,next);
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
            resUtil.resInternalError(error,res,next);
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
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateSupplier' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addSupplier,
    querySupplier,
    updateSupplier
}