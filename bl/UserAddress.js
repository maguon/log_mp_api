'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('UserAddress.js');
const userAddressDAO = require('../dao/UserAddressDAO.js');
const sysConsts = require("../util/SystemConst");

const getAddress = (req,res,next) => {
    let params = req.params;
    userAddressDAO.getAddress(params,(error,result)=>{
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
    userAddressDAO.addAddress(params,(error,result)=>{
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
    new Promise((resolve,reject)=>{
        params.status = sysConsts.USER_ADDRESS.status.disabled;
        userAddressDAO.updateStatusByUserId(params,(error,result)=>{
            if(error){
                logger.error('updateStatus updateStatusByUserId ' + error.message);
                reject(error);
            }else{
                logger.info('updateStatus updateStatusByUserId ' + 'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.status = sysConsts.USER_ADDRESS.status.enable;
            userAddressDAO.updateStatus(params,(error,result)=>{
                if(error){
                    logger.error('updateStatus ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateStatus ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateAddress = (req,res,next) => {
    let params = req.params;
    userAddressDAO.updateAddress(params,(error,result)=>{
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
const delAddress = (req,res,next) => {
    let params = req.params;
    userAddressDAO.delAddress(params,(error,result)=>{
        if(error){
            logger.error('delAddress ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('delAddress ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addAddress,
    getAddress,
    updateStatus,
    updateAddress,
    delAddress
}