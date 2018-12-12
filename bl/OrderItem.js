'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('OrderItem.js');
const orderItemDAO = require('../dao/OrderItemDAO.js');

const addOrderCar = (req,res,next) => {
    let params = req.params;
    orderItemDAO.addOrderCar(params,(error,result)=>{
        if(error){
            logger.error('addOrderCar' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addOrderCar' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const getOrderCar = (req,res,next) => {
    let params = req.params;
    orderItemDAO.getOrderCar(params,(error,result)=>{
        if(error){
            logger.error('getOrderCar' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrderCar' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const delOrderCar = (req,res,next) => {
    let params = req.params;
    orderItemDAO.delOrderCar(params,(error,result)=>{
        if(error){
            logger.error('delOrderCar' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('delOrderCar' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const addOrderCarAdmin = (req,res,next) => {
    let params = req.params;
    orderItemDAO.addOrderCarAdmin(params,(error,result)=>{
        if(error){
            logger.error('addOrderCarAdmin' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addOrderCarAdmin' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

const updateActFee = (req,res,next) => {
    let params = req.params;
    orderItemDAO.updateActFee(params,(error,result)=>{
        if(error){
            logger.error('updateActFee' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateActFee' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addOrderCar,
    getOrderCar,
    delOrderCar,
    addOrderCarAdmin,
    updateActFee
}