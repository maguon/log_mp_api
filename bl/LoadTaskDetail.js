'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('LoadTask.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const loadTaskDAO = require("../dao/LoadTaskDAO");
const loadTaskDetailDAO = require("../dao/LoadTaskDetailDAO");
const orderItemDAO = require("../dao/OrderItemDAO");
const requireTaskDAO = require("../dao/RequireTaskDAO");

const addLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    let detailId =0;
    let supplierTransPrice =0;
    let supplierInsurePrice =0;
    let carNum =0 ;
    if (!params.supplierTransPrice || !params.supplierInsurePrice) {
        resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_SUPPLIERPRICE_ZERO);
    }else if(params.supplierTransPrice < 0 || params.supplierInsurePrice < 0) {
        resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_SUPPLIERPRICE_INTEGER);
    }else{
        new Promise((resolve,reject)=>{
            loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('getLoadTask' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getLoadTask' + 'success');
                    if (rows.length >0){
                        params.requireId = rows[0].require_id;
                        params.orderId = rows[0].order_id;
                        params.supplierId = rows[0].supplier_id;
                        params.carNum = rows[0].car_count;
                        resolve();
                    } else {
                        resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS);
                    }
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                orderItemDAO.getOrderCar({orderItemId:params.orderItemId},(error,rows)=>{
                    if(error){
                        logger.error('getOrderItem' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('getOrderItem' + 'success');
                        if (rows.length >0){
                            resolve();
                        } else {
                            resUtil.resetFailedRes(res,sysMsg.ORDER_ITEM_NO_EXISTS);
                        }
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    params.dateId = moment().format("YYYYMMDD");
                    loadTaskDetailDAO.add(params,(error,rows)=>{
                        if(error){
                            logger.error('addLoadTaskDetail' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('addLoadTaskDetail' + 'success');
                            detailId = rows;
                            resolve();
                        }
                    })
                }).then(()=>{
                    new Promise((resolve,reject)=>{
                        loadTaskDetailDAO.getTotalPrice({loadTaskId:params.loadTaskId},(error,rows)=>{
                            if(error){
                                logger.error('getTotalPrice' + error.message);
                                resUtil.resInternalError(error,res,next);
                                reject(error);
                            }else{
                                logger.info('getTotalPrice' + 'success');
                                carNum = rows[0].total_car_num;
                                supplierTransPrice = rows[0].total_supplier_trans_price;
                                supplierInsurePrice = rows[0].total_supplier_insure_price;
                                resolve();
                            }
                        })
                    }).then(()=>{
                        new Promise((resolve,reject)=>{
                            let options ={
                                carNum:carNum,
                                loadTaskId: params.loadTaskId,
                                supplierTransPrice:supplierTransPrice,
                                supplierInsurePrice:supplierInsurePrice
                            }
                            loadTaskDAO.updateById(options,(error,rows)=>{
                                if(error){
                                    logger.error('updateLoadTaskCarNum' + error.message);
                                    resUtil.resInternalError(error,res,next);
                                    reject(error);
                                }else{
                                    logger.info('updateLoadTaskCarNum' + 'success');
                                    resolve();
                                }
                            })
                        }).then(()=>{
                            new Promise((resolve,reject)=>{
                                loadTaskDAO.getHasLoadCarCount({requireId:params.requireId},(error,rows)=>{
                                    if(error){
                                        logger.error('getHasLoadCarCount' + error.message);
                                        resUtil.resInternalError(error,res,next);
                                        reject(error);
                                    }else{
                                        logger.info('getHasLoadCarCount' + 'success');
                                        params.loadCarNum = rows[0].total_car_count;
                                        resolve();
                                    }
                                })
                            }).then(()=>{
                                requireTaskDAO.updateById({requireId:params.requireId,loadCarNum:params.loadCarNum},(error,rows)=>{
                                    if(error){
                                        logger.error('updateRequireLoadCarNum' + error.message);
                                        resUtil.resInternalError(error,res,next);
                                    }else{
                                        logger.info('updateRequireLoadCarNum' + 'success');
                                        resUtil.resetCreateRes(res,detailId,null);
                                        return next;
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    }
}
const getArrangeLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    loadTaskDetailDAO.getArrangeLoadTaskDetail(params,(error,rows)=>{
        if(error){
            logger.error('getArrangeLoadTaskDetail' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getArrangeLoadTaskDetail' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
        }
    })
}
const updateLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    if (!params.supplierTransPrice || !params.supplierInsurePrice) {
        resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_SUPPLIERPRICE_ZERO)
    }else if(params.supplierTransPrice < 0 || params.supplierInsurePrice < 0) {
        resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_SUPPLIERPRICE_INTEGER);
    }else {
        loadTaskDetailDAO.updateById(params,(error,rows)=>{
            if(error){
                logger.error('updateLoadTaskDetail' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info('updateLoadTaskDetail' + 'success');
                resUtil.resetUpdateRes(res,rows,null);
                return next;
            }
        })
    }
}
const deleteLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        loadTaskDetailDAO.getById(params,(error,rows)=>{
            if(error){
                logger.error('getLoadTaskDetail' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getLoadTaskDetail' + 'success');
                if (rows.length > 0 ){
                    if (rows[0].hook_id == null){
                        params.requireId = rows[0].require_id;
                        resolve();
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.LOCKDETAIL_DELETE_ALREADY_SYNC)
                    }
                }else {
                    resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_NO_EXISTE);
                }

            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            loadTaskDetailDAO.deleteById(params,(error,rows)=>{
                if(error){
                    logger.error('deleteLoadTaskDetail' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('deleteLoadTaskDetail' + 'success');
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                loadTaskDetailDAO.getTotalPrice({loadTaskId:params.loadTaskId},(error,rows)=>{
                    if(error){
                        logger.error('getTotalPrice' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('getTotalPrice' + 'success');
                        params.carNum = rows[0].total_car_num;
                        params.supplierTransPrice = rows[0].total_supplier_trans_price;
                        params.supplierInsurePrice = rows[0].total_supplier_insure_price;
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    loadTaskDAO.updateById(params,(error,rows)=>{
                        if(error){
                            logger.error('updateLoadTaskCarNum' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('updateLoadTaskCarNum' + 'success');
                            resolve();
                        }
                    })
                }).then(()=>{
                    new Promise((resolve,reject)=>{
                        loadTaskDAO.getHasLoadCarCount({requireId:params.requireId},(error,rows)=>{
                            if(error){
                                logger.error('getHasLoadCarCount' + error.message);
                                resUtil.resInternalError(error,res,next);
                                reject(error);
                            }else{
                                logger.info('getHasLoadCarCount' + 'success');
                                params.loadCarNum = rows[0].total_car_count;
                                resolve();
                            }
                        })
                    }).then(()=>{
                        requireTaskDAO.updateById({requireId:params.requireId,loadCarNum:params.loadCarNum},(error,rows)=>{
                            if(error){
                                logger.error('updateRequireLoadCarNum' + error.message);
                                resUtil.resInternalError(error,res,next);
                            }else{
                                logger.info('updateRequireLoadCarNum' + 'success');
                                resUtil.resetUpdateRes(res,rows,null);
                                return next;
                            }
                        })
                    })
                })
            })
        })
    })
}
const getLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        loadTaskDAO.getById(params,(error,rows)=>{
            if(error){
                logger.error('getLoadTaskById' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getLoadTaskById' + 'success');
                if (rows.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS);
                }
            }
        })
    }).then(()=>{
        params.isHookIdNull = 1;
        loadTaskDetailDAO.getById(params,(error,rows)=>{
            if(error){
                logger.error('getLoadTaskDetail' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info('getLoadTaskDetail' + 'success');
                resUtil.resetQueryRes(res,rows,null);
                return next;
            }
        })
    })
}
module.exports={
    addLoadTaskDetail,
    getArrangeLoadTaskDetail,
    updateLoadTaskDetail,
    deleteLoadTaskDetail,
    getLoadTaskDetail
}