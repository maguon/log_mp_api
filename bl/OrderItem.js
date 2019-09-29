'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('OrderItem.js');
const orderItemDAO = require('../dao/OrderItemDAO.js');
const orderDAO = require('../dao/InquiryOrderDAO.js');
const commonUtil = require("../util/CommonUtil");

const addOrderCar = (req,res,next) => {
    let params = req.params;
    let orderItemId = 0;
    let price = commonUtil.calculatedAmount(params.serviceType,params.oldCar,params.modelType,params.distance,params.safeStatus, params.valuation);
    params.oraTransPrice = price.trans;
    params.oraInsurePrice = price.insure;
    new Promise((resolve,reject)=>{
        orderItemDAO.addOrderCar(params,(error,result)=>{
            if(error){
                logger.error('addOrderCar ' + error.message);
                reject(error);
            }else if(result && result.insertId < 1){
                logger.warn('addOrderCar '+'Failed to add order details!');
                resUtil.resetFailedRes(res,'添加订单详情失败',null);
            }else{
                logger.info('addOrderCar ' + 'success');
                orderItemId = result.insertId;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderItemDAO.getPriceSum({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('addOrderCar getPriceSum ' + error.message);
                    reject(error);
                }else{
                    logger.info('addOrderCar getPriceSum ' + 'success');
                    params.oraTransPrice = rows[0].sum_ora_trans_price;
                    params.oraInsurePrice = rows[0].sum_ora_insure_price;
                    params.totalTransPrice = rows[0].sum_act_trans_price;
                    params.totalInsurePrice = rows[0].sum_act_insure_price;
                    params.carNum = rows[0].sum_car_num;
                    resolve();
                }
            })
        }).then(()=>{
            orderDAO.updatePrice(params,(error,result)=>{
                if(error) {
                    logger.error('addOrderCar updatePrice ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('addOrderCar updatePrice ' + 'success');
                    let result_id = [{
                        orderItemId
                    }]
                    resUtil.resetQueryRes(res,result_id,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const getOrderCar = (req,res,next) => {
    let params = req.params;
    orderItemDAO.getOrderCar(params,(error,result)=>{
        if(error){
            logger.error('getOrderCar ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrderCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const delOrderCar = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        //查询订单下的车辆信息
        orderItemDAO.getOrderCar({orderItemId:params.orderItemId},(error,rows)=>{
            if(error){
                logger.error('delOrderCar getOrderCar ' + error.message);
                reject(error);
            }else{
                logger.info('delOrderCar getOrderCar ' + 'success');
                params.orderId = rows[0].order_id;
                resolve();
            }
        })

    }).then(()=> {
        //删除成功后更新订单字段数据
        new Promise((resolve,reject)=>{
            orderItemDAO.delOrderCar(params,(error,result)=>{
                if(error){
                    logger.error('delOrderCar ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('delOrderCar ' + 'success');
                    resolve();
                    resUtil.resetUpdateRes(res,result,null);
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                orderItemDAO.getPriceSum({orderId:params.orderId},(error,rows)=>{
                    if(error){
                        logger.error('delOrderCar getPriceSum ' + error.message);
                        reject(error);
                    }else{
                        logger.info('delOrderCar getPriceSum ' + 'success');
                        if(rows[0].sum_ora_trans_price == null){
                            params.oraTransPrice = 0;
                        }else{
                            params.oraTransPrice = rows[0].sum_ora_trans_price;
                        }
                        if(rows[0].sum_ora_insure_price == null){
                            params.oraInsurePrice = 0;
                        }else{
                            params.oraInsurePrice = rows[0].sum_ora_insure_price;
                        }
                        if(rows[0].sum_act_trans_price == null){
                            params.totalTransPrice = 0;
                        }else{
                            params.totalTransPrice = rows[0].sum_act_trans_price;
                        }
                        if(rows[0].sum_act_insure_price = null){
                            params.totalInsurePrice = 0;
                        }else{
                            params.totalInsurePrice = rows[0].sum_act_insure_price;
                        }
                        params.carNum = rows[0].sum_car_num;
                        resolve();
                    }
                })
            }).then(()=>{
                orderDAO.updatePrice(params,(error,result)=>{
                    if(error) {
                        logger.error('delOrderCar updatePrice ' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('delOrderCar updatePrice ' + 'success');
                        let result_id = [{
                            orderItemId
                        }]
                        resUtil.resetQueryRes(res,result_id,null);
                        return next();
                    }
                })
            })
        })

    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const addOrderCarAdmin = (req,res,next) => {
    let params = req.params;
    let orderItemId = 0;
    let price = commonUtil.calculatedAmount(params.serviceType,params.oldCar,params.modelType,params.distance,params.safeStatus, params.valuation);
    params.oraTransPrice = price.trans;
    params.oraInsurePrice = price.insure;
    new Promise((resolve,reject)=>{
        orderItemDAO.addOrderCarAdmin(params,(error,result)=>{
            if(error){
                logger.error('addOrderCarAdmin ' + error.message);
                reject(error);
            }else if(result && result.insertId < 1){
                logger.warn('addOrderCarAdmin '+'Insert order details failed!');
                resUtil.resetFailedRes(res,'插入订单详情失败',null);
            }else{
                logger.info('addOrderCarAdmin ' + 'success');
                orderItemId = result.insertId;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderItemDAO.getPriceSum({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('addOrderCarAdmin getPriceSum ' + error.message);
                    reject(error);
                }else{
                    logger.info('addOrderCarAdmin getPriceSum ' + 'success');
                    params.oraTransPrice = rows[0].sum_ora_trans_price;
                    params.oraInsurePrice = rows[0].sum_ora_insure_price;
                    params.totalTransPrice = rows[0].sum_act_trans_price;
                    params.totalInsurePrice = rows[0].sum_act_insure_price;
                    params.carNum = rows[0].sum_car_num;
                    resolve();
                }
            })
        }).then(()=>{
            orderDAO.updatePrice(params,(error,result)=>{
                if(error) {
                    logger.error('addOrderCarAdmin updatePrice ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('addOrderCarAdmin updatePrice ' + 'success');
                    let result_id = [{
                        orderItemId
                    }]
                    resUtil.resetQueryRes(res,result_id,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateActFee = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderItemDAO.updateActFee(params,(error,result)=>{
            if(error){
                logger.error('updateActFee ' + error.message);
                reject(error);
            }else{
                logger.info('updateActFee ' + 'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderItemDAO.getOrderCar({orderItemId:params.orderItemId},(error,rows)=>{
                if(error){
                    logger.error('updateActFee getOrderCar ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateActFee getOrderCar ' + 'success');
                    params.orderId = rows[0].order_id;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                orderItemDAO.getOrderCar({orderId:params.orderId},(error,rows)=>{
                    if(error){
                        logger.error('updateActFee getOrderCar ' + error.message);
                        reject(error);
                    }else{
                        logger.info('updateActFee getOrderCar ' + 'success');
                        let actFee = 0;
                        let safePrice = 0;
                        for(let i = 0; i < rows.length; i ++){
                            actFee = actFee + rows[i].act_trans_price;
                            safePrice = safePrice + rows[i].act_insure_price;
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
                            logger.error('updateActFee putSafePrice ' + error.message);
                            reject(error);
                        }else{
                            logger.info('updateActFee putSafePrice ' + 'success');
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
    let price = commonUtil.calculatedAmount(params.serviceType,params.oldCar,params.modelType,params.distance,params.safeStatus, params.valuation);
    params.oraTransPrice = price.trans;
    params.oraInsurePrice = price.insure;
    new Promise((resolve,reject)=>{
        orderItemDAO.updateOrderItemInfo(params,(error,result)=>{
            if(error){
                logger.error('updateOrderItemInfo ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('updateOrderItemInfo ' + 'success');
                resolve();
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderItemDAO.getOrderCar({orderItemId:params.orderItemId},(error,rows)=>{
                if(error){
                    logger.error('updateOrderItemInfo getOrderCar ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateOrderItemInfo getOrderCar ' + 'success');
                    params.orderId = rows[0].order_id;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                orderItemDAO.getPriceSum({orderId:params.orderId},(error,rows)=>{
                    if(error){
                        logger.error('updateOrderItemInfo getPriceSum ' + error.message);
                        reject(error);
                    }else{
                        logger.info('updateOrderItemInfo getPriceSum ' + 'success');
                        params.oraTransPrice = rows[0].sum_ora_trans_price;
                        params.oraInsurePrice = rows[0].sum_ora_insure_price;
                        params.totalTransPrice = rows[0].sum_act_trans_price;
                        params.totalInsurePrice = rows[0].sum_act_insure_price;
                        params.carNum = rows[0].sum_car_num;
                        resolve();
                    }
                })
            }).then(()=>{
                orderDAO.updatePrice(params,(error,result)=>{
                    if(error) {
                        logger.error('updateOrderItemInfo updatePrice ' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('updateOrderItemInfo updatePrice ' + 'success');
                        let result_id = [{
                            orderItemId
                        }]
                        resUtil.resetQueryRes(res,result_id,null);
                        return next();
                    }
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateCarType = (req,res,next) => {
    let params = req.params;
    orderItemDAO.updateCarType(params,(error,result)=>{
        if(error){
            logger.error('updateCarType ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateCarType ' + 'success');
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
    updateOrderItemInfo,
    updateCarType
}