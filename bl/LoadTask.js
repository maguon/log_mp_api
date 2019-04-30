'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const sysConfig = require("../config/SystemConfig");
const logger = serverLogger.createLogger('LoadTask.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
// const oAuthUtil = require("../util/OAuthUtil");
const exRouteRequireDAO = require("../dao/ExRouteRequireDAO");
const orderInfoDAO = require("../dao/InquiryOrderDAO");
const requireTaskDAO = require("../dao/RequireTaskDAO");
const loadTaskDAO = require("../dao/LoadTaskDAO");
const loadTaskDetailDAO = require("../dao/LoadTaskDetailDAO");
const supplierInfo = require("../dao/SupplierDAO");

const addLoadTask = (req,res,next) => {
    let params = req.params;
    const getOrderInfo = ()=>{
        return new Promise((resolve,reject)=>{
            orderInfoDAO.getById({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('addLoadTask getOrderInfo ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addLoadTask getOrderInfo ' + 'success');
                    if (rows.length > 0){
                        resolve(params);
                    }else {
                        reject({msg:sysMsg.ORDER_NO_EXISTE});
                    }
                }
            })
        });
    }
    const getRequireTask = (requireInfo)=>{
        return new Promise((resolve,reject)=>{
            requireTaskDAO.getById({requireId:requireInfo.requireId},(error,rows)=>{
                if(error){
                    logger.error('addLoadTask getRequireTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addLoadTask getRequireTask ' + 'success');
                    if (rows.length > 0){
                        resolve(requireInfo);
                    }else {
                        reject({msg:sysMsg.REQUIRE_NO_EXISTE});
                    }
                }
            })
        });
    }
    const addLoadTask = (taskInfo)=>{
        return new Promise((resolve,reject)=>{
            taskInfo.planDate = moment(taskInfo.planDate).format("YYYYMMDD");
            taskInfo.planDateTime = moment(taskInfo.planDate).format("YYYY-MM-DD");
            loadTaskDAO.add(taskInfo,(error,rows)=>{
                if(error){
                    logger.error('addLoadTask addLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addLoadTask addLoadTask ' + 'success');
                    if (rows.insertId){
                        resUtil.resetCreateRes(res,rows,null);
                        return next;
                    }else {
                        reject({msg:sysMsg.LOADTASK_ADD_NULL});
                    }
                }
            })
        });
    }
    getOrderInfo()
        .then(getRequireTask)
        .then(addLoadTask)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const submitToSupplier = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        loadTaskDetailDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
            if(error){
                logger.error('submitToSupplier getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('submitToSupplier getById ' + 'success');
                if (rows.length > 0){
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_SYNC_NULL);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            loadTaskDAO.getLoadTaskOrder({loadTaskId:params.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('submitToSupplier getLoadTaskOrder' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('submitToSupplier getLoadTaskOrder' + 'success');
                    if (rows.length > 0){
                        params.supplierId = rows[0].supplier_id;
                        params.options = {
                            routeStart:rows[0].route_start,
                            routeEnd:rows[0].route_end,
                            preCount:rows[0].car_count,
                            dateId:rows[0].plan_date_id
                        }
                        // if (rows[0].service_type == sysConsts.ORDER.serviceType.selfMention){
                        params.options.remark = "发货地址:"+rows[0].route_start_detail + ";收货地址:"+rows[0].route_end_detail;
                        // }else if (rows[0].service_type == sysConsts.ORDER.serviceType.doorToDoor){
                        //     params.options.remark = "发货地址:"+rows[0].send_address + ";收货地址:"+rows[0].recv_address;
                        // }
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
                        logger.error('submitToSupplier querySupplier ' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else {
                        logger.info('submitToSupplier querySupplier ' + 'success');
                        if (rows.length >0){
                            if (rows[0].close_flag == sysConsts.SUPPLIER.closeFlag.close){
                                resUtil.resetFailedRes(res,sysMsg.SUPPLIER_CLOSE_NOTALLOW_SYNC);
                            } else if (rows[0].close_flag == sysConsts.SUPPLIER.closeFlag.open){
                                params.appId = rows[0].app_id;
                                params.baseAddrId = rows[0].base_addr_id;
                                params.makeId = rows[0].car_module_id;
                                params.appUrl = hostPort(rows[0].app_url);
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
                    exRouteRequireDAO.saveLoadTaskToSupplier(params,(error,result)=>{
                        if(error){
                            logger.error('submitToSupplier saveLoadTaskToSupplier ' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('submitToSupplier saveLoadTaskToSupplier ' + 'success');
                            if (result.success){
                                params.hookId = result.id;
                                resolve();
                            } else {
                                resUtil.resetFailedRes(res,"对方服务器:"+result.msg);
                            }
                        }
                    })
                }).then(()=>{
                    new Promise((resolve,reject)=>{
                        loadTaskDAO.updateById({loadTaskId:params.loadTaskId,hookId:params.hookId},(error,rows)=>{
                            if(error){
                                logger.error('submitToSupplier updateById ' + error.message);
                                resUtil.resInternalError(error,res,next);
                                reject(error);
                            }else{
                                logger.info('submitToSupplier updateById ' + 'success');
                                resolve();
                            }
                        })
                    }).then(()=>{
                        new Promise((resolve,reject)=>{
                            loadTaskDAO.getLoadTaskWithDetail({loadTaskId:params.loadTaskId},(error,rows)=>{
                                if(error){
                                    logger.error('submitToSupplier getLoadTaskWithDetail ' + error.message);
                                    resUtil.resInternalError(error,res,next);
                                    reject(error);
                                }else{
                                    logger.info('submitToSupplier getLoadTaskWithDetail ' + 'success');
                                    for (let i in rows){
                                        params.req = req;
                                        params.options={
                                            vin:rows[i].vin,
                                            makeId:params.makeId,
                                            routeStart: rows[i].route_start,
                                            baseAddrId: params.baseAddrId,
                                            entrustId:params.appId
                                            // orderDate:moment(rows[i].plan_date_id.toString()).format("YYYY-MM-DD")
                                        }
                                        exRouteRequireDAO.saveLoadTaskDetailToSupplier(params,(error,result)=>{
                                            if(error){
                                                logger.error('submitToSupplier saveLoadTaskDetailToSupplier ' + error.message);
                                                resUtil.resInternalError(error,res,next);
                                                reject(error);
                                            }else{
                                                logger.info('submitToSupplier saveLoadTaskDetailToSupplier ' + 'success');
                                                if (result.success){
                                                    params.detailHookId = result.id;
                                                    loadTaskDetailDAO.updateById({detailHookId:result.id,loadTaskDetailId:rows[i].id},(error,result)=>{
                                                        if(error){
                                                            logger.error('submitToSupplier updateLoadTaskDetailHookId ' + error.message);
                                                            resUtil.resInternalError(error,res,next);
                                                            reject(error);
                                                        }else{
                                                            logger.info('submitToSupplier updateLoadTaskDetailHookId ' + 'success');
                                                        }
                                                    })
                                                } else {
                                                    resUtil.resetFailedRes(res,"对方服务器:"+result.msg);
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
    })
}
const getLoadTaskWithDetail = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderInfoDAO.getById({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('getLoadTaskWithDetail getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getLoadTaskWithDetail getById ' + 'success');
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
                    logger.error('getLoadTaskWithDetail getById2 ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getLoadTaskWithDetail getById2 ' + 'success');
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
                    logger.error('getLoadTaskWithDetail ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('getLoadTaskWithDetail ' + 'success');
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
        loadTaskDAO.getById({loadTaskId:params.loadTaskId,orderId:params.orderId,requireId:params.requireId},(error,rows)=>{
            if(error){
                logger.error('delLoadTask getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('delLoadTask getById ' + 'success');
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
                    logger.error('delLoadTask querySupplier ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('delLoadTask querySupplier ' + 'success');
                    if (rows.length > 0){
                        if (loadTaskHookId != 0){
                            if (!(rows[0].app_id || rows[0].app_url)) {
                                resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NO_APP_MSG);
                            }else {
                                let options ={
                                    entrustId:rows[0].app_id,
                                    dpDemandId:loadTaskHookId,
                                    demandStatus:0,//删除
                                    appUrl:hostPort(rows[0].app_url)
                                }
                                exRouteRequireDAO.putLoadTaskStatusToSupplier(options,(error,result)=>{
                                    if(error){
                                        logger.error('delLoadTask putLoadTaskStatusToSupplier ' + error.message);
                                        resUtil.resInternalError(error,res,next);
                                        reject(error);
                                    }else{
                                        logger.info('delLoadTask putLoadTaskStatusToSupplier ' + 'success');
                                        if (result.success){
                                            resolve();
                                        } else {
                                            resUtil.resetFailedRes(res,result.msg);
                                        }
                                    }
                                })
                            }
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
                        logger.error('delLoadTask deleteById ' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('delLoadTask deleteById ' + 'success');
                        if (rows.affectedRows > 0){
                            resolve();
                        } else {
                            resUtil.resetFailedRes(res,sysMsg.LOADTASK_DO_FAIL);
                        }
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    loadTaskDetailDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
                        if(error){
                            logger.error('delLoadTask getById ' + error.message);
                            resUtil.resInternalError(error,res,next);
                            reject(error);
                        }else{
                            logger.info('delLoadTask getById ' + 'success');
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
                            logger.error('delLoadTask deleteById ' + error.message);
                            resUtil.resInternalError(error,res,next);
                        }else{
                            logger.info('delLoadTask deleteById ' + 'success');
                            resUtil.resetUpdateRes(res,rows,null);
                            return next;
                        }
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
        requireTaskDAO.getById({requireId:params.requireId},(error,rows)=>{
            if(error){
                logger.error('updateLoadTask getById  ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('updateLoadTask getById ' + 'success');
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
                    logger.error('updateLoadTask getById2 ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('updateLoadTask getById2 ' + 'success');
                    if (rows.length > 0){
                        loadTaskHookId = rows[0].hook_id;
                        resolve();
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS)
                    }
                }
            })
        }).then(()=>{
            if (loadTaskHookId == 0){
                params.planDateId = moment(params.planDate.toString()).format("YYYYMMDD");
                loadTaskDAO.updateById(params,(error,rows)=>{
                    if(error){
                        logger.error('updateLoadTask updateById ' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('updateLoadTask updateById ' + 'success');
                        resUtil.resetUpdateRes(res,rows,null);
                        return next;
                    }
                })
            } else {
                resUtil.resetFailedRes(res,sysMsg.LOCKTASK_UPDATE_ALREADY_SYNC);
            }
        })
    })
}
const updateLoadTaskStatus = (req,res,next) => {
    let params = req.params;
    if (params.status == sysConsts.LOAD_TASK_STATUS.loading){
        params.loadDateId = moment().format("YYYYMMDD");
        params.loadDate = moment().format("YYYY-MM-DD");
    } else if (params.status == sysConsts.LOAD_TASK_STATUS.served){
        params.arriveDateId = moment().format("YYYYMMDD");
        params.arriveDate = moment().format("YYYY-MM-DD");
    }
    loadTaskDAO.updateById(params,(error,rows)=>{
        if(error){
            logger.error('updateLoadTaskStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateLoadTaskStatus ' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next;
        }
    })
}
const getOrderLoadTask = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderInfoDAO.getById({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('getOrderLoadTask getByIdOrder ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getOrderLoadTask getByIdOrder ' + 'success');
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
                    logger.error('getOrderLoadTask getByIdRequireTask ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getOrderLoadTask getByIdRequireTask ' + 'success');
                    if (rows.length > 0){
                        resolve();
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.REQUIRE_NO_EXISTE);
                    }
                }
            })
        }).then(()=>{
            loadTaskDAO.getLoadTask(params,(error,rows)=>{
                if(error){
                    logger.error('getOrderLoadTask getLoadTask ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('getOrderLoadTask getLoadTask ' + 'success');
                    resUtil.resetQueryRes(res,rows,null);
                    return next;
                }
            })
        })
    })
}
const getLoadTaskProfitOfCar = (req,res,next) => {
    let params = req.params;
    loadTaskDAO.getLoadTaskProfitOfCar(params,(error,rows)=>{
        if(error){
            logger.error('getLoadTaskProfitOfCar ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getLoadTaskProfitOfCar ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
        }
    })
}
const getSyncLoadTask = (req,res,next) => {
    let params = req.params;
    let resultData ={};
    new Promise((resolve,reject)=>{
        loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
            if(error){
                logger.error('getSyncLoadTask getByIdLoadTask ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getSyncLoadTask getByIdLoadTask ' + 'success');
                if (rows.length > 0){
                    if (rows[0].hook_id){
                        params.hookId = rows[0].hook_id;
                        params.supplierId = rows[0].supplier_id;
                        resolve();
                    } else {
                        resUtil.resetFailedRes(res,sysMsg.LOADTASK_NO_HOOKID);
                    }
                }else {
                    resUtil.resetFailedRes(res,sysMsg.REQUIRE_NO_EXISTE);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            supplierInfo.querySupplier({supplierId:params.supplierId},(error,rows)=>{
                if(error){
                    logger.error('getSyncLoadTask querySupplier ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getSyncLoadTask querySupplier ' + 'success');
                    if (rows.length > 0){
                        params.appUrl = hostPort(rows[0].app_url);
                        params.entrustId = rows[0].app_id;
                        resolve();
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NOT_EXISTS);
                    }
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                let options ={
                    dpDemandId:params.hookId
                }
                params.options = options;
                exRouteRequireDAO.getDpDemand(params,(error,result)=>{
                    if(error){
                        logger.error('getSyncLoadTask getDpDemand ' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    }else{
                        logger.info('getSyncLoadTask getDpDemand ' + 'success');
                        if (result.success){
                            resultData.require = result.result;
                            resolve();
                        } else {
                            resUtil.resetFailedRes(res,"对方服务器:"+result.msg);
                        }
                    }
                })
            }).then(()=>{
                exRouteRequireDAO.getRouteLoadTask(params,(error,result)=>{
                    if(error){
                        logger.error('getSyncLoadTask getRouteLoadTask ' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('getSyncLoadTask getRouteLoadTask ' + 'success');
                        if (result.success){
                            resultData.routeLoadTask = result.result;
                            resUtil.resetQueryRes(res,resultData,null);
                            return next;
                        } else {
                            resUtil.resetFailedRes(res,"对方服务器:"+result.msg);
                        }
                    }
                })
            })
        })
    })
}
const syncComplete = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
            if(error){
                logger.error('syncComplete getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('syncComplete getById ' + 'success');
                if (rows.length > 0){
                    if (rows[0].hook_id){
                        params.hookId = rows[0].hook_id;
                        params.supplierId = rows[0].supplier_id;
                        resolve();
                    } else {
                        resUtil.resetFailedRes(res,sysMsg.LOADTASK_NO_HOOKID);
                    }
                }else {
                    resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            supplierInfo.querySupplier({supplierId:params.supplierId},(error,rows)=>{
                if(error){
                    logger.error('syncComplete querySupplier ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('syncComplete querySupplier ' + 'success');
                    if (rows.length > 0){
                        params.appUrl = hostPort(rows[0].app_url);
                        params.entrustId = rows[0].app_id;
                        resolve();
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.SUPPLIER_NOT_EXISTS);
                    }
                }
            })
        }).then(()=>{
            let options ={
                entrustId:params.entrustId,
                dpDemandId:params.hookId,
                demandStatus:2,//完成
                appUrl:params.appUrl
            }
            exRouteRequireDAO.putLoadTaskStatusToSupplier(options,(error,result)=>{
                if(error){
                    logger.error('syncComplete putLoadTaskStatusToSupplier ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('syncComplete putLoadTaskStatusToSupplier ' + 'success');
                    if (result.success){
                        resUtil.resetQueryRes(res,result,null);
                        return next;
                    } else {
                        resUtil.resetFailedRes(res,"对方服务器:"+result.msg);
                    }
                }
            })
        })
    })
}
const getRouteLoadTask = (req,res,next) => {
    let params = req.params;
    loadTaskDAO.getRouteLoadTask(params,(error,rows)=>{
        if(error){
            logger.error('getRouteLoadTask ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getRouteLoadTask ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
        }
    })
}
const doPayment = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
            if(error){
                logger.error('doPayment getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('doPayment getById ' + 'success');
                if (rows.length > 0){
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS);
                }
            }
        })
    }).then(()=>{
        params.paymentFlag = sysConsts.LOAD_TASK_PAYMENTFLAG.yes;
        params.paymentOn = new Date();
        params.paymentOnId = moment().format("YYYYMMDD");
        loadTaskDAO.updateById(params,(error,rows)=>{
            if(error){
                logger.error('doPayment updateById ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info('doPayment updateById ' + 'success');
                resUtil.resetUpdateRes(res,rows,null);
                return next;
            }
        })
    })
}
const getRouteOfCar = (req,res,next) => {
    let params = req.params;
    let loadTaskIdArray = new Array();
    new Promise((resolve,reject)=>{
        loadTaskDetailDAO.getRouteId(params,(error,rows)=>{
            if(error){
                logger.error('getRouteOfCar getRouteId ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getRouteOfCar getRouteId ' + 'success');
                if (rows.length > 0){
                    for (let i in rows){
                        loadTaskIdArray.push(rows[i].dp_load_task_id);
                    }
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.LOADTASK_DETAIL_NO_EXISTE);
                }
            }
        })
    }).then(()=>{
        loadTaskDAO.getLoadTask({loadTaskIdArray:loadTaskIdArray},(error,rows)=>{
            if(error){
                logger.error('getRouteOfCar getLoadTask ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info('getRouteOfCar getLoadTask ' + 'success');
                resUtil.resetQueryRes(res,rows,null);
                return next;
            }
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
const statisticsPrice = (req,res,next) => {
    let params = req.params;
    params.dbMonth = moment().format("YYYYMM");
    loadTaskDAO.getOrderLoadPrice(params,(error,rows)=>{
        if(error){
            logger.error('statisticsPrice ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('statisticsPrice ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
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
    getSyncLoadTask,
    getOrderLoadTask,
    getLoadTaskProfitOfCar,
    syncComplete,
    getRouteLoadTask,
    doPayment,
    getRouteOfCar,
    statisticsPrice
}