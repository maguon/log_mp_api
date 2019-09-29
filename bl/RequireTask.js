'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
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
                logger.error('addRequireTask updateById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('addRequireTask updateById ' + 'success');
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
                    logger.error('addRequireTask getById ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('addRequireTask getById ' + 'success');
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
                    logger.error('addRequireTask add ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('addRequireTask add ' + 'success');
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
            logger.error('getRequireOrder ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getRequireOrder ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    const getRequireTask =()=>{
        return new Promise((resolve, reject) => {
            requireTask.getById(params,(error,rows)=>{
                if(error){
                    logger.error('updateStatus getRequireTask ' + error.message);
                    reject({err:error})
                }else{
                    logger.info('updateStatus getRequireTask ' + 'success');
                    if (rows.length > 0){
                        resolve(rows[0].order_id);
                    } else {
                        reject({msg:sysMsg.REQUIRE_NO_EXISTE});
                    }
                }
            })
        });
    }
    const getParamsStatus = (orderId) =>{
        return new Promise((resolve, reject) => {
            let options = {
                orderId:orderId
            }
            if (params.status == sysConsts.REQUIRE_TASK.status.arranged) {
                // status = 1,已安排
                options.status = sysConsts.ORDER.status.inExecution;
                options.logStatus = sysConsts.ORDER.logStatus.tpShipped;
                resolve(options);
            }else{
                if (params.status == sysConsts.REQUIRE_TASK.status.complete) {
                    // status = 9,已完成
                    let loadParams = {
                        orderId: orderId
                    }
                    loadTaskDAO.getById(loadParams, (error, allRows) => {
                        if (error) {
                            logger.error('updateStatus getParamsStatus ' + error.message);
                            reject({err: error});
                        } else {
                            let servedRowNum = 0;
                            logger.info('updateStatus getParamsStatus ' + 'success');
                            if (allRows.length > 0) {
                                allRows.forEach((record, i) => {
                                    if (record.load_task_status == sysConsts.LOAD_TASK_STATUS.served) {
                                        servedRowNum++;
                                    }
                                });
                                if (allRows.length == servedRowNum) {
                                    logger.info('updateStatus getParamsStatus true');
                                    options.status = sysConsts.ORDER.status.completed;
                                    resolve(options);
                                } else {
                                    logger.info('updateStatus getParamsStatus ' + sysMsg.LOAD_TASK_INCOMPLETE);
                                    reject({msg:sysMsg.LOAD_TASK_INCOMPLETE});
                                }
                            } else {
                                logger.info('updateStatus getParamsStatus ' + sysMsg.LOAD_TASK_NO_EXISTS);
                                reject({msg:sysMsg.LOAD_TASK_NO_EXISTS});
                            }
                        }
                    });
                }
            }
        });
    }
    const updateOrder =(options)=>{
        return new Promise(((resolve, reject) => {
            orderInfoDAO.updateById(options,(error,rows)=>{
                if(error){
                    logger.error('updateStatus updateOrder ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateStatus updateOrder ' + 'success');
                    resolve();
                }
            })
        }));
    }
    const updateRequire =()=>{
        return new Promise(((resolve, reject) => {
            requireTask.updateById(params,(error,rows)=>{
                if(error){
                    logger.error('updateStatus updateRequire ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('updateStatus updateRequire ' + 'success');
                    resUtil.resetQueryRes(res,rows,null);
                    return next();
                }
            })
        }));
    }
    getRequireTask()
        .then(getParamsStatus)
        .then(updateOrder)
        .then(updateRequire)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res, reject.err);
            }else{
                resUtil.resetFailedRes(res, reject.msg);
            }
        })
}
module.exports={
    addRequireTask,
    getRequireOrder,
    updateStatus
}