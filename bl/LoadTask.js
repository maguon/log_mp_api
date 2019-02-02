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
const supplierInfo = require("../dao/SupplierDAO");

const addLoadTask = (req,res,next) => {
    let params = req.params;
    let insert ;
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
                params.planDate = moment(params.planDate).format("YYYYMMDD");
                params.planDateTime = moment(params.planDate).format("YYYY-MM-DD");
                loadTaskDAO.add(params,(error,rows)=>{
                    if(error){
                        logger.error('addLoadTask' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('addLoadTask' + 'success');
                        if (rows.insertId){
                            insert = rows;
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
                        resUtil.resetCreateRes(res,insert,null);
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
                    params.supplierId = rows[0].supplier_id;
                    params.options = {
                        routeStart:rows[0].route_start,
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
            supplierInfo.querySupplier({supplierId:params.supplierId},(error,rows)=>{
                if(error){
                    logger.error(' getSupplierById ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else {
                    logger.info('getSupplierById' + 'success');
                    if (rows.length >0){
                        if (rows[0].close_flag == sysConsts.SUPPLIER.closeFlag.close){
                            resUtil.resetFailedRes(res,sysMsg.SUPPLIER_CLOSE_NOTALLOW_SYNC);
                        } else if (rows[0].close_flag == sysConsts.SUPPLIER.closeFlag.open){
                            params.appId = rows[0].app_id;
                            params.baseAddrId = rows[0].base_addr_id;
                            params.makeId = rows[0].car_module_id;
                            params.options.baseAddrId = params.baseAddrId;
                            params.options.receiveId = rows[0].receive_id;
                            resolve();
                        }
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NOT_EXISTS);
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
                                        makeId:params.makeId,
                                        routeStart: rows[i].route_start,
                                        baseAddrId: params.baseAddrId,
                                        entrustId:params.appId,
                                        orderDate:moment(rows[i].date_id.toString()).format("YYYY-MM-DD")
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
    })
}
const getLoadTaskWithDetail = (req,res,next) => {
    let params = req.params;
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
            loadTaskDAO.getLoadTaskWithDetail(params,(error,rows)=>{
                if(error){
                    logger.error('getLoadTaskWithDetail' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('getLoadTaskWithDetail' + 'success');
                    resUtil.resetQueryRes(res,rows,null);
                    return next;
                }
            })
        })
    })
}
const delLoadTask = (req,res,next) => {
    let params = req.params;
    let loadTaskHookId = 0;
    let supplierId =0;
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
                loadTaskDAO.getById({loadTaskId:params.loadTaskId,orderId:params.orderId,requireId:params.requireId},(error,rows)=>{
                    if(error){
                        logger.error('getLoadTaskById' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('getLoadTaskById' + 'success');
                        if (rows.length > 0){
                            loadTaskHookId = rows[0].hook_id;
                            supplierId = rows[0].supplier_id;
                            resolve();
                        }else {
                            resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS)
                        }
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    supplierInfo.querySupplier({supplierId:supplierId},(error,rows)=>{
                        if(error){
                            logger.error('getSupplierById' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('getSupplierById' + 'success');
                            if (rows.length > 0){
                                if (loadTaskHookId != null){
                                    let options ={
                                        entrustId:rows[0].app_id,
                                        dpDemandId:loadTaskHookId,
                                        demandStatus:0
                                    }
                                    oAuthUtil.putLoadTaskStatusToSupplier(options,(error,result)=>{
                                        if(error){
                                            logger.error(' putLoadTaskStatusToSupplier ' + error.message);
                                            resUtil.resInternalError(error,res,next);
                                            reject(error);
                                        }else{
                                            logger.info('putLoadTaskStatusToSupplier' + 'success');
                                            if (result.success){
                                                resolve();
                                            } else {
                                                resUtil.resetFailedRes(res,result.msg);
                                            }
                                        }
                                    })
                                }else {
                                    resolve();
                                }
                            }else {
                                resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NOT_EXISTS)
                            }
                        }
                    })
                }).then(()=>{
                    new Promise((resolve,reject)=>{
                        loadTaskDAO.deleteById({loadTaskId:params.loadTaskId},(error,rows)=>{
                            if(error){
                                logger.error('deleteLoadTaskById' + error.message);
                                resUtil.resInternalError(error,res,next);
                                reject(error);
                            }else{
                                logger.info('deleteLoadTaskById' + 'success');
                                if (rows.affectedRows > 0){
                                    resolve();
                                } else {
                                    resUtil.resetFailedRes(res,sysMsg.LOADTASK_DELETE_FAIL);
                                }
                            }
                        })
                    }).then(()=>{
                        new Promise((resolve,reject)=>{
                            loadTaskDetailDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
                                if(error){
                                    logger.error('getLoadTaskDetailByLoadTaskId' + error.message);
                                    resUtil.resInternalError(error,res,next);
                                    reject(error);
                                }else{
                                    logger.info('getLoadTaskDetailByLoadTaskId' + 'success');
                                    if (rows.length > 0){
                                        resolve();
                                    } else {
                                        resUtil.resetQueryRes(res,params.loadTaskId,null);
                                    }
                                }
                            })
                        }).then(()=>{
                            loadTaskDetailDAO.deleteById({loadTaskId:params.loadTaskId},(error,rows)=>{
                                if(error){
                                    logger.error('deleteLoadTaskDetailByLoadTaskId' + error.message);
                                    resUtil.resInternalError(error,res,next);
                                }else{
                                    logger.info('deleteLoadTaskDetailByLoadTaskId' + 'success');
                                    resUtil.resetUpdateRes(res,rows,null);
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
const updateLoadTask = (req,res,next) => {
    let params = req.params;
    let loadTaskHookId = 0;
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
                loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
                    if(error){
                        logger.error('getLoadTaskById' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('getLoadTaskById' + 'success');
                        if (rows.length > 0){
                            loadTaskHookId = rows[0].hook_id;
                            resolve();
                        }else {
                            resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS)
                        }
                    }
                })
            }).then(()=>{
                if (loadTaskHookId == null){
                    params.planDateId = moment(params.planDateId.toString()).format("YYYYMMDD");
                    loadTaskDAO.updateById(params,(error,rows)=>{
                            if(error){
                                logger.error('updateLoadTaskById' + error.message);
                                resUtil.resInternalError(error,res,next);
                            }else{
                                logger.info('updateLoadTaskById' + 'success');
                                if (rows.changedRows > 0){
                                    resUtil.resetUpdateRes(res,rows,null);
                                    return next;
                                } else {
                                    resUtil.resetFailedRes(res,sysMsg.LOADTASK_DELETE_FAIL);
                                }
                            }
                        })
                } else {
                    resUtil.resetFailedRes(res,sysMsg.LOCKTASK_UPDATE_ALREADY_SYNC);
                }
            })
        })
    })
}
const updateLoadTaskStatus = (req,res,next) => {
    let params = req.params;
    loadTaskDAO.updateById(params,(error,rows)=>{
        if(error){
            logger.error('updateLoadTaskStatus' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateLoadTaskStatus' + 'success');
            if (rows.changedRows > 0){
                resUtil.resetUpdateRes(res,rows,null);
                return next;
            } else {
                resUtil.resetFailedRes(res,sysMsg.LOADTASK_DELETE_FAIL);
            }
        }
    })
}
const getSyncLoadTask = (req,res,next) => {
    let params = req.params;
    let syncList = new Array();
    loadTaskDAO.getById({requireId:params.requireId},(error,rows)=>{
        if(error){
            logger.error('getLoadTaskByRequireId' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getLoadTaskByRequireId' + 'success');
            if (rows.length > 0){
                new Promise((resolve,reject)=>{
                    for (let i=0;i<rows.length;i++){
                        let options ={
                            demandStatus:1,
                            dpDemandId:rows[i].hook_id,
                        }
                        supplierInfo.querySupplier({supplierId:rows[i].supplier_id},(error,suRows)=>{
                            if(error){
                                logger.error('getSupplierById' + error.message);
                                resUtil.resInternalError(error,res,next);
                                reject(error);
                            }else{
                                logger.info('getSupplierById' + 'success');
                                if (suRows.length > 0){
                                    options.entrustId = suRows[0].app_id;
                                    oAuthUtil.getSyncLoadTaskToSupplier(options,(error,result)=>{
                                        if(error){
                                            logger.error(' getSyncLoadTaskToSupplier ' + error.message);
                                            resUtil.resInternalError(error,res,next);
                                            reject(error);
                                        }else{
                                            logger.info('getSyncLoadTaskToSupplier' + 'success');
                                            if (result.success){
                                                syncList.push(result.result[0]);
                                                if (i+1 == rows.length){
                                                    resolve();
                                                }
                                            } else {
                                                resUtil.resetFailedRes(res,result.msg);
                                            }
                                        }
                                    })
                                }else {
                                    resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NOT_EXISTS);
                                }
                            }
                        })
                    }
                }).then(()=>{
                    resUtil.resetQueryRes(res,syncList,null);
                    return next;
                })
            }else {
                resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS)
            }
        }
    })
}
module.exports={
    addLoadTask,
    submitToSupplier,
    getLoadTaskWithDetail,
    delLoadTask,
    updateLoadTask,
    updateLoadTaskStatus,
    getSyncLoadTask
}