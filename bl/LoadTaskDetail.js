'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const logger = serverLogger.createLogger('LoadTask.js');
const moment = require('moment/moment.js');
const loadTaskDAO = require("../dao/LoadTaskDAO");
const loadTaskDetailDAO = require("../dao/LoadTaskDetailDAO");
const orderItemDAO = require("../dao/OrderItemDAO");
const requireTaskDAO = require("../dao/RequireTaskDAO");
const exRouteRequireDAO = require("../dao/ExRouteRequireDAO");
const supplierInfo = require("../dao/SupplierDAO");

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
                    logger.error('addLoadTaskDetail getById ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('addLoadTaskDetail getById ' + 'success');
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
                        logger.error('addLoadTaskDetail getOrderCar ' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('addLoadTaskDetail getOrderCar ' + 'success');
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
                            logger.error('addLoadTaskDetail add ' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('addLoadTaskDetail add ' + 'success');
                            detailId = rows;
                            resolve();
                        }
                    })
                }).then(()=>{
                    new Promise((resolve,reject)=>{
                        loadTaskDetailDAO.getTotalPrice({loadTaskId:params.loadTaskId},(error,rows)=>{
                            if(error){
                                logger.error('addLoadTaskDetail getTotalPrice ' + error.message);
                                resUtil.resInternalError(error,res,next);
                                reject(error);
                            }else{
                                logger.info('addLoadTaskDetail getTotalPrice ' + 'success');
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
                                    logger.error('addLoadTaskDetail updateById ' + error.message);
                                    resUtil.resInternalError(error,res,next);
                                    reject(error);
                                }else{
                                    logger.info('addLoadTaskDetail updateById ' + 'success');
                                    resolve();
                                }
                            })
                        }).then(()=>{
                            new Promise((resolve,reject)=>{
                                loadTaskDAO.getHasLoadCarCount({requireId:params.requireId},(error,rows)=>{
                                    if(error){
                                        logger.error('addLoadTaskDetail getHasLoadCarCount ' + error.message);
                                        resUtil.resInternalError(error,res,next);
                                        reject(error);
                                    }else{
                                        logger.info('addLoadTaskDetail getHasLoadCarCount ' + 'success');
                                        params.loadCarNum = rows[0].total_car_count;
                                        resolve();
                                    }
                                })
                            }).then(()=>{
                                requireTaskDAO.updateById({requireId:params.requireId,loadCarNum:params.loadCarNum},(error,rows)=>{
                                    if(error){
                                        logger.error('addLoadTaskDetail updateById ' + error.message);
                                        resUtil.resInternalError(error,res,next);
                                    }else{
                                        logger.info('addLoadTaskDetail updateById ' + 'success');
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
            logger.error('getArrangeLoadTaskDetail ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getArrangeLoadTaskDetail ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
        }
    })
}
const updateLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    let updateResult;
    if (!params.supplierTransPrice || !params.supplierInsurePrice) {
        resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_SUPPLIERPRICE_ZERO)
    }else if(params.supplierTransPrice < 0 || params.supplierInsurePrice < 0) {
        resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_SUPPLIERPRICE_INTEGER);
    }else {
        new Promise((resolve,reject)=>{
            loadTaskDetailDAO.updateById(params,(error,rows)=>{
                if(error){
                    logger.error('updateLoadTaskDetail updateById ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('updateLoadTaskDetail updateById ' + 'success');
                    updateResult = rows;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                loadTaskDetailDAO.getTotalPrice({loadTaskId:params.loadTaskId},(error,rows)=>{
                    if(error){
                        logger.error('updateLoadTaskDetail getTotalPrice ' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('updateLoadTaskDetail getTotalPrice ' + 'success');
                        params.carNum = rows[0].total_car_num;
                        params.supplierTransPrice = rows[0].total_supplier_trans_price;
                        params.supplierInsurePrice = rows[0].total_supplier_insure_price;
                        resolve();
                    }
                })
            }).then(()=>{
                loadTaskDAO.updateById(params,(error,rows)=>{
                    if(error){
                        logger.error('updateLoadTaskDetail updateById ' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('updateLoadTaskDetail updateById ' + 'success');
                        resUtil.resetUpdateRes(res,updateResult,null);
                        return next;
                    }
                })
            })

        })

    }
}
const deleteLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        loadTaskDetailDAO.getById(params,(error,rows)=>{
            if(error){
                logger.error('deleteLoadTaskDetail getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('deleteLoadTaskDetail getById ' + 'success');
                if (rows.length > 0 ){
                    if (rows[0].hook_id == 0){
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
                    logger.error('deleteLoadTaskDetail deleteById ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('deleteLoadTaskDetail deleteById ' + 'success');
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                loadTaskDetailDAO.getTotalPrice({loadTaskId:params.loadTaskId},(error,rows)=>{
                    if(error){
                        logger.error('deleteLoadTaskDetail getTotalPrice ' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('deleteLoadTaskDetail getTotalPrice ' + 'success');
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
                            logger.error('deleteLoadTaskDetail updateById ' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('deleteLoadTaskDetail updateById ' + 'success');
                            resolve();
                        }
                    })
                }).then(()=>{
                    new Promise((resolve,reject)=>{
                        loadTaskDAO.getHasLoadCarCount({requireId:params.requireId},(error,rows)=>{
                            if(error){
                                logger.error('deleteLoadTaskDetail getHasLoadCarCount ' + error.message);
                                resUtil.resInternalError(error,res,next);
                                reject(error);
                            }else{
                                logger.info('deleteLoadTaskDetail getHasLoadCarCount ' + 'success');
                                params.loadCarNum = rows[0].total_car_count;
                                resolve();
                            }
                        })
                    }).then(()=>{
                        requireTaskDAO.updateById({requireId:params.requireId,loadCarNum:params.loadCarNum},(error,rows)=>{
                            if(error){
                                logger.error('deleteLoadTaskDetail updateById ' + error.message);
                                resUtil.resInternalError(error,res,next);
                            }else{
                                logger.info('deleteLoadTaskDetail updateById ' + 'success');
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
                logger.error('getLoadTaskDetail getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getLoadTaskDetail getById ' + 'success');
                if (rows.length > 0 ){
                    params.supplierId = rows[0].supplier_id;
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_NO_EXISTE);
                }

            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            supplierInfo.querySupplier({supplierId:params.supplierId},(error,rows)=>{
                if(error){
                    logger.error('getLoadTaskDetail querySupplier ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getLoadTaskDetail querySupplier ' + 'success');
                    if (rows.length > 0){
                        params.appUrl = hostPort(rows[0].app_url);
                        resolve();
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NOT_EXISTS);
                    }
                }
            })
        }).then(()=>{
            let options = {
                dpRouteLoadTaskId : params.syncLoadTaskId,
                appUrl:params.appUrl
            }
            exRouteRequireDAO.getRouteLoadTaskDetail(options,(error,result)=>{
                if(error){
                    logger.error('getLoadTaskDetail getRouteLoadTaskDetail ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('getLoadTaskDetail getRouteLoadTaskDetail ' + 'success');
                    if (result.success){
                        resUtil.resetQueryRes(res,result.result,null);
                        return next;
                    } else {
                        resUtil.resetFailedRes(res,result.msg);
                    }
                }
            })
        })
    })
}
const hostPort=(url)=>{
    let urlObj ={};
    urlObj.scheme = url.substring(0,url.indexOf(":")); //协议头
    let temp=url.substring(url.indexOf("//")+2); //域名+端口号
    urlObj.host = temp.split(":")[0];
    urlObj.port = temp.split(":")[1];
    return urlObj;
}
module.exports={
    addLoadTaskDetail,
    getArrangeLoadTaskDetail,
    updateLoadTaskDetail,
    deleteLoadTaskDetail,
    getLoadTaskDetail
}