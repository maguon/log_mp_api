'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('UserAddress.js');
const userAddressDAO = require('../dao/UserAddressDAO.js');

const getAddress = (req,res,next) => {
    let params = req.params;
    userAddressDAO.getAddress(params,(error,result)=>{
        if(error){
            logger.error('getAddress' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getAddress' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addAddress = (req,res,next) => {
    let params = req.params;
    userAddressDAO.addAddress(params,(error,result)=>{
        if(error){
            logger.error('addAddress' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addAddress' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addAddress,
    getAddress
}