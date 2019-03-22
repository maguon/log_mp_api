'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('RequireTask.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const requireTask = require("../dao/RequireTaskDAO");
const orderInfoDAO = require("../dao/InquiryOrderDAO");
const loadTaskDAO = require("../dao/LoadTaskDAO");

const addRequireTask = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderInfoDAO.updateById({status:sysConsts.ORDER.status.carsToBeArranged,orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('updateStatus' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('updateStatus' + 'success');
                if (rows.changedRows > 0){
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_ADD_REQUIRE_ORDER_STATUS);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderInfoDAO.getById({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('getOrderInfo' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getOrderInfo' + 'success');
                    params.routeStart = rows[0].route_start;
                    params.routeStartId = rows[0].route_start_id;
                    params.routeEnd = rows[0].route_end;
                    params.routeEndId = rows[0].route_end_id;
                    params.carNum = rows[0].car_num;
                    resolve();
                }
            })
        }).then(()=>{
            params.dateId = moment().format("YYYYMMDD");
            requireTask.add(params,(error,rows)=>{
                if(error){
                    logger.error('addRequireTask' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('addRequireTask' + 'success');
                    resUtil.resetCreateRes(res,rows,null);
                    return next;
                }
            })
        })
    })
}
const getRequireOrder = (req,res,next) => {
    let params = req.params;
    requireTask.getRequireOrder(params,(error,rows)=>{
        if(error){
            logger.error('getRequireOrder' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getRequireOrder' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    let loadTaskCount = 0;
    let serLoadTaskCount =0;
    new Promise((resolve,reject)=>{
        requireTask.updateById(params,(error,rows)=>{
            if(error){
                logger.error('updateRequireStatus' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('updateRequireStatus' + 'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            requireTask.getById(params,(error,rows)=>{
                if(error){
                    logger.error('getRequireTask' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getRequireTask' + 'success');
                    if (rows.length > 0){
                        params.orderId = rows[0].order_id;
                        resolve();
                    } else {
                        resUtil.resetFailedRes(res,sysMsg.REQUIRE_NO_EXISTE);
                    }

                }
            })
        }).then(()=>{
            let options = {
                orderId:params.orderId
            }
            new Promise((resolve,reject)=>{
                if (params.status == sysConsts.REQUIRE_TASK.status.arranged){
                    options.status = sysConsts.ORDER.status.inExecution;
                    options.logStatus = sysConsts.ORDER.logStatus.tpShipped;
                    resolve();
                }else if (params.status == sysConsts.REQUIRE_TASK.status.complete) {
                    let loadParams = {
                        orderId:params.orderId
                    }
                    loadTaskDAO.getById(loadParams,(error,allRows)=>{
                        if(error){
                            logger.error('getLoadTaskByOrderId' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('getLoadTaskByOrderId' + 'success');
                            if (allRows.length > 0){
                                loadTaskCount = allRows.length;
                                loadParams.loadTaskStatus = sysConsts.LOAD_TASK_STATUS.served;
                                loadTaskDAO.getById(loadParams,(error,serRows)=>{
                                    if(error){
                                        logger.error('getServedLoadTask' + error.message);
                                        resUtil.resInternalError(error,res,next);
                                        reject(error);
                                    }else{
                                        logger.info('getServedLoadTask' + 'success');
                                        if (serRows.length > 0){
                                            serLoadTaskCount = serRows.length;
                                        }
                                        if (loadTaskCount = serLoadTaskCount) {
                                            options.status = sysConsts.ORDER.status.completed;
                                        }
                                        resolve();
                                    }
                                })
                            } else {
                                resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS);
                            }
                        }
                    })
                }

            }).then(()=>{
                orderInfoDAO.updateById(options,(error,rows)=>{
                    if(error){
                        logger.error('updateOrderStatus' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('updateOrderStatus' + 'success');
                        resUtil.resetUpdateRes(res,rows,null);
                        return next;
                    }
                })
            })
        })
    })
}
module.exports={
    addRequireTask,
    getRequireOrder,
    updateStatus
}