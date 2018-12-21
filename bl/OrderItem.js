'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('OrderItem.js');
const orderItemDAO = require('../dao/OrderItemDAO.js');
const orderDAO = require('../dao/InquiryOrderDAO.js');

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
    new Promise((resolve,reject)=>{
        orderItemDAO.updateActFee(params,(error,result)=>{
            if(error){
                logger.error('updateActFee' + error.message);
                reject(error);
            }else{
                logger.info('updateActFee' + 'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderItemDAO.getOrderCar({orderItemId:params.orderItemId},(error,rows)=>{
                if(error){
                    logger.error('getOrderCar' + error.message);
                    reject(error);
                }else{
                    logger.info('getOrderCar' + 'success');
                    params.orderId = rows[0].order_id;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                orderItemDAO.getOrderCar({orderId:params.orderId},(error,rows)=>{
                    if(error){
                        logger.error('getOrderCar' + error.message);
                        reject(error);
                    }else{
                        logger.info('getOrderCar' + 'success');
                        let actFee = 0;
                        let safePrice = 0;
                        for(let i = 0; i < rows.length; i ++){
                            actFee = actFee + rows[i].act_price;
                            safePrice = safePrice + rows[i].safe_price;
                        }
                        params.feePrice = actFee;
                        params.safePrice = safePrice;
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    orderDAO.putSafePrice(params,(error,result)=>{
                        if(error){
                            logger.error('putSafePrice' + error.message);
                            reject(error);
                        }else{
                            logger.info('putSafePrice' + 'success');
                            resUtil.resetUpdateRes(res,result,null);
                            return next();
                        }
                    })
                })
            })
        })
    })
}
const updateOrderItemInfo = (req,res,next) => {
    let params = req.params;
    orderItemDAO.updateOrderItemInfo(params,(error,result)=>{
        if(error){
            logger.error('updateOrderItemInfo' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateOrderItemInfo' + 'success');
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
    updateActFee,
    updateOrderItemInfo
}