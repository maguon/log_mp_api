'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Address.js');
const addressDAO = require('../dao/AddressDAO.js');

const getAddress = (req,res,next) => {
    let params = req.params;
    addressDAO.getAddress(params,(error,result)=>{
        if(error){
            logger.error('getAddress ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getAddress ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addAddress = (req,res,next) => {
    let params = req.params;
    addressDAO.addAddress(params,(error,result)=>{
        if(error){
            logger.error('addAddress ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addAddress ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    addressDAO.updateStatus(params,(error,result)=>{
        if(error){
            logger.error('updateStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateAddress = (req,res,next) => {
    let params = req.params;
    addressDAO.updateAddress(params,(error,result)=>{
        if(error){
            logger.error('updateAddress ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateAddress ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateAddressByAdmin = (req,res,next) => {
    let params = req.params;
    addressDAO.updateAddressByAdmin(params,(error,result)=>{
        if(error){
            logger.error('updateAddressByAdmin ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateAddressByAdmin ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getAddress,
    addAddress,
    updateStatus,
    updateAddress,
    updateAddressByAdmin
}