'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('AddressContact.js');
const addressContactDAO = require('../dao/AddressContactDAO.js');

const getAddressContact = (req,res,next) => {
    let params = req.params;
    addressContactDAO.getAddressContact(params,(error,result)=>{
        if(error){
            logger.error('getAddressContact: ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getAddressContact: ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addAddressContact = (req,res,next) => {
    let params = req.params;
    addressContactDAO.addAddressContact(params,(error,result)=>{
        if(error){
            logger.error('addAddressContact: ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addAddressContact: ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const delAddressContact = (req,res,next) => {
    let params = req.params;
    addressContactDAO.delAddressContact(params,(error,result)=>{
        if(error){
            logger.error('delAddressContact: ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('delAddressContact: ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getAddressContact,
    addAddressContact,
    delAddressContact
}