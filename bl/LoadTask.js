'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const sysConfig = require("../config/SystemConfig");
const logger = serverLogger.createLogger('LoadTask.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const oAuthUtil = require("../util/OAuthUtil");
const orderInfoDAO = require("../dao/InquiryOrderDAO");
const requireTaskDAO = require("../dao/RequireTaskDAO");
const loadTaskDAO = require("../dao/LoadTaskDAO");
const loadTaskDetailDAO = require("../dao/LoadTaskDetailDAO");

const addLoadTask = (req,res,next) => {
    let params = req.params;
    let insertId = 0;
    new Promise((resolve,reject)=>{
        orderInfoDAO.getById({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('getOrder' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getOrder' + 'success');
                if (rows.length > 0){
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.ORDER_NO_EXISTE);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            requireTaskDAO.getById({requireId:params.requireId},(error,rows)=>{
                if(error){
                    logger.error('getRequireTaskById' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getRequireTaskById' + 'success');
                    if (rows.length > 0){
                        resolve();
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.REQUIRE_NO_EXISTE);
                    }
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                params.planDateId = moment(params.planDateId).format("YYYYMMDD");
                loadTaskDAO.add(params,(error,rows)=>{
                    if(error){
                        logger.error('addLoadTask' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('addLoadTask' + 'success');
                        if (rows.insertId){
                            insertId = rows.insertId;
                            resolve();
                        }else {
                            resUtil.resetFailedRes(res,sysMsg.LOADTASK_ADD_NULL)
                        }
                    }
                })
            }).then(()=>{
                requireTaskDAO.updateById({requireId: params.requireId,status:sysConsts.REQUIRE_TASK.status.inArrange},(error,rows)=>{
                    if(error){
                        logger.error('updateRequireStatus' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('updateRequireStatus' + 'success');
                        resUtil.resetCreateRes(res,insertId,null);
                        return next;
                    }
                })
            })

        })
    })
}
const submitToSupplier = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        loadTaskDAO.getLoadTaskOrder({loadTaskId:params.loadTaskId},(error,rows)=>{
            if(error){
                logger.error('getLoadTaskOrder' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getLoadTaskOrder' + 'success');
                if (rows.length > 0){
                    params.options = {
                        routeStart:rows[0].route_start,
                        baseAddrId:rows[0].route_start_id,
                        routeEnd:rows[0].route_end,
                        receiveId:rows[0].route_end_id,
                        preCount:rows[0].car_count,
                        dateId:rows[0].plan_date_id,
                        remark:"发货地址:"+rows[0].send_address + ";收货地址:"+rows[0].recv_address
                    }
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.ORDER_NO_EXISTE);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.req = req;
            oAuthUtil.saveLoadTaskToSupplier(params,(error,result)=>{
                if(error){
                    logger.error(' saveLoadTaskToSupplier ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('saveLoadTaskToSupplier' + 'success');
                    if (result.success){
                        params.hookId = result.id;
                        resolve();
                    } else {
                        resUtil.resetFailedRes(res,result.msg);
                    }
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                loadTaskDAO.updateById({loadTaskId:params.loadTaskId,hookId:params.hookId},(error,rows)=>{
                    if(error){
                        logger.error(' updateLoadTaskHookId ' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('updateLoadTaskHookId' + 'success');
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    loadTaskDAO.getLoadTaskWithDetail({loadTaskId:params.loadTaskId},(error,rows)=>{
                        if(error){
                            logger.error(' getLoadTaskWithDetail ' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('getLoadTaskWithDetail' + 'success');
                            for (let i in rows){
                                params.req = req;
                                params.options={
                                    vin:rows[i].vin,
                                    makeId:sysConfig.supplierConfig.makeId,
                                    routeStart: rows[i].route_start,
                                    baseAddrId: sysConfig.supplierConfig.baseAddrId,
                                    entrustId:sysConfig.supplierConfig.appId,
                                    orderDate:moment(rows[i].date_id).format("YYYY-MM-DD")
                                }
                                oAuthUtil.saveLoadTaskDetailToSupplier(params,(error,result)=>{
                                    if(error){
                                        logger.error(' saveLoadTaskDetailToSupplier ' + error.message);
                                        resUtil.resInternalError(error,res,next);
                                        reject(error);
                                    }else{
                                        logger.info('saveLoadTaskDetailToSupplier' + 'success');
                                        if (result.success){
                                            params.detailHookId = result.id;
                                            loadTaskDetailDAO.updateById({detailHookId:result.id,loadTaskDetailId:rows[i].id},(error,result)=>{
                                                if(error){
                                                    logger.error(' updateLoadTaskDetailHookId ' + error.message);
                                                    resUtil.resInternalError(error,res,next);
                                                    reject(error);
                                                }else{
                                                    logger.info(' updateLoadTaskDetailHookId ' + 'success');
                                                }
                                            })
                                        } else {
                                            resUtil.resetFailedRes(res,result.msg);
                                        }
                                    }
                                })
                            }
                            resUtil.resetQueryRes(res,params.hookId,null);
                        }
                    })
                });
            })
        })
    })
}
module.exports={
    addLoadTask,
    submitToSupplier
}