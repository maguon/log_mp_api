'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('CustomerServicePhone.js');
const customerPhoneDAO = require('../dao/CustomerPhoneDAO.js');

const addCustomerPhone = (req,res,next) => {
    let params = req.params;
    customerPhoneDAO.addPhone(params,(error,rows)=>{
        if(error){
            logger.error(' addCustomerPhone ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' addCustomerPhone ' + 'success');
            resUtil.resetCreateRes(res,rows,null);
            return next();
        }
    })
}
const updateCustomerPhone = (req,res,next) => {
    let params = req.params;
    customerPhoneDAO.updatePhone(params,(error,rows)=>{
        if(error){
            logger.error(' updateCustomerPhone ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateCustomerPhone ' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next();
        }
    })
}
const getCustomerPhone = (req,res,next) => {
    let params = req.params;
    customerPhoneDAO.selectPhone(params,(error,rows)=>{
        if(error){
            logger.error(' getCustomerPhone ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getCustomerPhone ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}

const deleteCustomerPhone = (req,res,next) => {
    let params = req.params;
    customerPhoneDAO.deletePhone(params,(error,rows)=>{
        if(error){
            logger.error(' deleteCustomerPhone ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' deleteCustomerPhone ' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next();
        }
    })
}
module.exports ={
    addCustomerPhone,
    updateCustomerPhone,
    getCustomerPhone,
    deleteCustomerPhone
}