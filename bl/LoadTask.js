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
    const getLoadTask = ()=>{
        return new Promise((resolve,reject)=>{
            loadTaskDetailDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('submitToSupplier getLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('submitToSupplier getLoadTask ' + 'success');
                    if (rows.length > 0){
                        resolve(params);
                    }else {
                        reject({msg:sysMsg.LOADTASK_DETAIL_SYNC_NULL});
                    }
                }
            })
        });
    }
    const getLoadTaskOrder = (taskOrder)=>{
        return new Promise((resolve,reject)=>{
            loadTaskDAO.getLoadTaskOrder({loadTaskId:taskOrder.loadTaskId},(error,rows)=> {
                if (error) {
                    logger.error('submitToSupplier getLoadTaskOrder ' + error.message);
                    reject(error);
                } else {
                    logger.info('submitToSupplier getLoadTaskOrder ' + 'success');
                    if (rows.length > 0){
                        taskOrder.supplierId = rows[0].supplier_id;
                        taskOrder.options = {
                            routeStart:rows[0].route_start,
                            routeEnd:rows[0].route_end,
                            preCount:rows[0].car_count,
                            dateId:rows[0].plan_date_id
                        }
                        // if (rows[0].service_type == sysConsts.ORDER.serviceType.selfMention){
                        taskOrder.options.remark = "发货地址:"+rows[0].route_start_detail + ";收货地址:"+rows[0].route_end_detail;
                        // }else if (rows[0].service_type == sysConsts.ORDER.serviceType.doorToDoor){
                        //     taskOrder.options.remark = "发货地址:"+rows[0].send_address + ";收货地址:"+rows[0].recv_address;
                        // }
                        resolve(taskOrder);
                    }else {
                        reject({msg:sysMsg.ORDER_NO_EXISTE});
                    }
                }
            });
        });
    }
    const getSupplier = (info)=>{
        return new Promise((resolve,reject)=>{
            supplierInfo.querySupplier({supplierId:info.supplierId},(error,rows)=>{
                if(error){
                    logger.error('submitToSupplier getSupplier ' + error.message);
                    reject({err:error});
                }else {
                    logger.info('submitToSupplier getSupplier ' + 'success');
                    if (rows.length >0){
                        if (rows[0].close_flag == sysConsts.SUPPLIER.closeFlag.close){
                            reject({msg:sysMsg.SUPPLIER_CLOSE_NOTALLOW_SYNC});
                        }else{
                            if (rows[0].close_flag == sysConsts.SUPPLIER.closeFlag.open){
                                info.appId = rows[0].app_id;
                                info.baseAddrId = rows[0].base_addr_id;
                                info.makeId = rows[0].car_module_id;
                                info.appUrl = hostPort(rows[0].app_url);
                                info.options.baseAddrId = info.baseAddrId;
                                info.options.receiveId = rows[0].receive_id;
                                resolve(info);
                            }else{
                                reject({msg:'closeFlag error!'});
                            }
                        }
                    }else {
                        reject({msg:sysMsg.SUPPLIER_NOT_EXISTS});
                    }
                }
            })
        });
    }
    const saveSupplier = (taskInfo)=>{
        return new Promise((resolve,reject)=>{
            taskInfo.req = req;
            exRouteRequireDAO.saveLoadTaskToSupplier(taskInfo,(error,result)=>{
                if(error){
                    logger.error('submitToSupplier saveSupplier ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('submitToSupplier saveSupplier ' + 'success');
                    if (result.success){
                        taskInfo.hookId = result.id;
                        resolve(taskInfo);
                    } else {
                        reject({msg:"对方服务器:"+result.msg});
                    }
                }
            })
        });
    }
    const updatLoadTask = (taskInfo)=>{
        return new Promise((resolve,reject)=>{
            loadTaskDAO.updateById({loadTaskId:taskInfo.loadTaskId,hookId:taskInfo.hookId},(error,rows)=>{
                if(error){
                    logger.error('submitToSupplier updatLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('submitToSupplier updatLoadTask ' + 'success');
                    resolve(taskInfo);
                }
            })
        });
    }
    const getDetail =(taskInfo)=>{
        return new Promise((resolve,reject)=>{
            loadTaskDAO.getLoadTaskWithDetail({loadTaskId:taskInfo.loadTaskId},(error,rows)=> {
                if (error) {
                    logger.error('submitToSupplier getDetail ' + error.message);
                    reject({err: error});
                } else {
                    logger.info('submitToSupplier getDetail ' + 'success');
                    resolve(rows);
                }
            });
        });
    }
    const saveDetail = (info)=>{
        return new Promise((resolve,reject)=>{
            for (let i in info) {
                params.req = req;
                params.options = {
                    vin: info[i].vin,
                    makeId: params.makeId,
                    routeStart: info[i].route_start,
                    baseAddrId: params.baseAddrId,
                    entrustId: params.appId
                    // orderDate:moment(info[i].plan_date_id.toString()).format("YYYY-MM-DD")
                }
                saveDetailToSupplier(params,info[i].dltd_id);
            }
            logger.info('submitToSupplier saveDetail ' + 'success');
            resUtil.resetQueryRes(res,params.hookId,null);
        });
    }
    const saveDetailToSupplier = (taskInfo,dltdId)=>{
        return new Promise((resolve,reject)=>{
            exRouteRequireDAO.saveLoadTaskDetailToSupplier(taskInfo,(error,result)=> {
                if (error) {
                    logger.error('submitToSupplier saveDetailToSupplier ' + error.message);
                    reject({err:error});
                } else {
                    logger.info('submitToSupplier saveDetailToSupplier ' + 'success');
                    if (result.success) {
                        taskInfo.detailHookId = result.id;
                        loadTaskDetailDAO.updateById({detailHookId:result.id,loadTaskDetailId:dltdId},(error,result)=>{
                            if(error){
                                logger.error('submitToSupplier updateLoadTaskDetailHookId ' + error.message);
                                resUtil.resInternalError(error,res,next);
                                reject(error);
                            }else{
                                logger.info('submitToSupplier updateLoadTaskDetailHookId ' + 'success');
                            }
                        })
                        resolve();
                    }else{
                        reject({msg:"对方服务器:"+result.msg});
                    }
                }
            });
        });
    }
    getLoadTask()
        .then(getLoadTaskOrder)
        .then(getSupplier)
        .then(saveSupplier)
        .then(updatLoadTask)
        .then(getDetail)
        .then(saveDetail)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const delLoadTask = (req,res,next) => {
    let params = req.params;
    let loadTaskHookId = 0;
    let supplierId =0;
    const getLoadTask = ()=>{
        return new Promise((resolve,reject)=>{
            loadTaskDAO.getById({loadTaskId:params.loadTaskId,orderId:params.orderId,requireId:params.requireId},(error,rows)=>{
                if(error){
                    logger.error('delLoadTask getLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('delLoadTask getLoadTask ' + 'success');
                    if (rows.length > 0){
                        loadTaskHookId = rows[0].hook_id;
                        supplierId = rows[0].supplier_id;
                        resolve(loadTaskHookId,supplierId);
                    }else {
                        reject({msg:sysMsg.LOAD_TASK_NO_EXISTS});
                    }
                }
            })
        });
    }
    const getSupplier = (loadTaskHookId,supplierId)=>{
        return new Promise((resolve,reject)=>{
            supplierInfo.querySupplier({supplierId:supplierId},(error,rows)=> {
                if (error) {
                    logger.error('delLoadTask getSupplier ' + error.message);
                    reject({err:error});
                } else {
                    logger.info('delLoadTask getSupplier ' + 'success');
                    if (rows.length > 0) {
                        if (loadTaskHookId != 0) {
                            if (!(rows[0].app_id || rows[0].app_url)) {
                                reject({msg:sysMsg.SUPPLIER_NO_APP_MSG});
                            } else {
                                let options = {
                                    entrustId: rows[0].app_id,
                                    dpDemandId: loadTaskHookId,
                                    demandStatus: 0,//删除
                                    appUrl: hostPort(rows[0].app_url)
                                }
                                exRouteRequireDAO.putLoadTaskStatusToSupplier(options,(error,result)=>{
                                    if(error){
                                        logger.error('delLoadTask putLoadTaskStatusToSupplier ' + error.message);
                                        reject({err:error});
                                    }else{
                                        logger.info('delLoadTask putLoadTaskStatusToSupplier ' + 'success');
                                        if (result.success){
                                            resolve(params);
                                        } else {
                                            reject({msg:result.msg});
                                        }
                                    }
                                })
                            }
                        }else{//if (loadTaskHookId != 0)
                            resolve(params);
                        }
                    }else{//if (rows.length > 0)
                        reject({msg:sysMsg.SUPPLIER_NOT_EXISTS});
                    }
                }
            });
        });
    }
    const delLoad = (taskInfo)=>{
        return new Promise((resolve,reject)=>{
            loadTaskDAO.deleteById({loadTaskId:taskInfo.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('delLoadTask delLoad ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('delLoadTask delLoad ' + 'success');
                    if (rows.affectedRows > 0){
                        resolve(taskInfo);
                    } else {
                        reject({msg:sysMsg.LOADTASK_DO_FAIL});
                    }
                }
            })
        });
    }
    const getTaskDetail = (taskInfo)=>{
        return new Promise((resolve,reject)=>{
            loadTaskDetailDAO.getById({loadTaskId:taskInfo.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('delLoadTask getTaskDetail ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('delLoadTask getTaskDetail ' + 'success');
                    if (rows.length > 0){
                        resolve(taskInfo);
                    } else {
                        resUtil.resetQueryRes(res,taskInfo.loadTaskId,null);
                    }
                }
            })
        });
    }
    const delTaskDetail = (taskInfo)=>{
        return new Promise((resolve,reject)=>{
            loadTaskDetailDAO.deleteById({loadTaskId:taskInfo.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('delLoadTask delTaskDetail ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('delLoadTask delTaskDetail ' + 'success');
                    resUtil.resetUpdateRes(res,rows,null);
                    return next;
                }
            })
        });
    }
    getLoadTask()
        .then(getSupplier)
        .then(delLoad)
        .then(getTaskDetail)
        .then(delTaskDetail)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const updateLoadTask = (req,res,next) => {
    let params = req.params;
    let loadTaskHookId = 0;
    const getLoadTask =()=>{
        return new Promise((resolve,reject)=>{
            loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('updateLoadTask getLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateLoadTask getLoadTask ' + 'success');
                    if (rows.length > 0){
                        loadTaskHookId = rows[0].hook_id;
                        if (loadTaskHookId == 0){
                            resolve(params);
                        }else{
                            reject({msg:sysMsg.LOCKTASK_UPDATE_ALREADY_SYNC});
                        }
                    }else {
                        reject({msg:sysMsg.LOAD_TASK_NO_EXISTS});
                    }
                }
            })
        });
    }
    const updateTask = (taskInfo)=>{
        return new Promise((resolve,reject)=>{
            taskInfo.planDateId = moment(taskInfo.planDate.toString()).format("YYYYMMDD");
            loadTaskDAO.updateById(taskInfo,(error,rows)=>{
                if(error){
                    logger.error('updateLoadTask updateTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateLoadTask updateTask ' + 'success');
                    resUtil.resetUpdateRes(res,rows,null);
                    return next;
                }
            })
        });
    }
    getLoadTask()
        .then(updateTask)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const updateLoadTaskStatus = (req,res,next) => {
    let params = req.params;
    if (params.status == sysConsts.LOAD_TASK_STATUS.loading){
        params.loadDateId = moment().format("YYYYMMDD");
        params.loadDate = moment().format("YYYY-MM-DD");
    } else{
        if (params.status == sysConsts.LOAD_TASK_STATUS.served){
            params.arriveDateId = moment().format("YYYYMMDD");
            params.arriveDate = moment().format("YYYY-MM-DD");
        }
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
    const getOrderInfo =()=>{
        return new Promise((resolve,reject)=>{
            orderInfoDAO.getById({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('getOrderLoadTask getOrderInfo ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('getOrderLoadTask getOrderInfo ' + 'success');
                    if (rows.length > 0){
                        resolve(params);
                    }else {
                        reject({msg:sysMsg.ORDER_NO_EXISTE});
                    }
                }
            })
        });
    }
    const getReqLoadTask = (reqInfo)=>{
        return new Promise((resolve,reject)=>{
            requireTaskDAO.getById({requireId:reqInfo.requireId},(error,rows)=>{
                if(error){
                    logger.error('getOrderLoadTask getReqLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('getOrderLoadTask getReqLoadTask ' + 'success');
                    if (rows.length > 0){
                        resolve(reqInfo);
                    }else {
                        reject({msg:sysMsg.REQUIRE_NO_EXISTE});
                    }
                }
            })
        });
    }
    const getLoadTask = (taskInfo)=>{
        return new Promise((resolve,reject)=>{
            loadTaskDAO.getLoadTask(taskInfo,(error,rows)=>{
                if(error){
                    logger.error('getOrderLoadTask getLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('getOrderLoadTask getLoadTask ' + 'success');
                    resUtil.resetQueryRes(res,rows,null);
                    return next;
                }
            })
        });
    }
    getOrderInfo()
        .then(getReqLoadTask)
        .then(getLoadTask)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
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
    const getLoadTask = ()=>{
        return new Promise((resolve,reject)=>{
            loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('getSyncLoadTask getLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('getSyncLoadTask getLoadTask ' + 'success');
                    if (rows.length > 0){
                        if (rows[0].hook_id){
                            params.hookId = rows[0].hook_id;
                            params.supplierId = rows[0].supplier_id;
                            resolve(params);
                        } else {
                            reject({msg:sysMsg.LOADTASK_NO_HOOKID});
                        }
                    }else {
                        reject({msg:sysMsg.REQUIRE_NO_EXISTE});
                    }
                }
            })
        });
    }
    const getSupplier = (taskinfo)=>{
        return new Promise((resolve,reject)=>{
            supplierInfo.querySupplier({supplierId:taskinfo.supplierId},(error,rows)=>{
                if(error){
                    logger.error('getSyncLoadTask getSupplier ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('getSyncLoadTask getSupplier ' + 'success');
                    if (rows.length > 0){
                        taskinfo.appUrl = hostPort(rows[0].app_url);
                        taskinfo.entrustId = rows[0].app_id;
                        resolve(taskinfo);
                    }else {
                        reject({msg:sysMsg.SUPPLIER_NOT_EXISTS});
                    }
                }
            })
        });
    }
    const getDemand = (taskinfo)=>{
        return new Promise((resolve,reject)=>{
            let options ={
                dpDemandId:taskinfo.hookId
            }
            taskinfo.options = options;
            exRouteRequireDAO.getDpDemand(taskinfo,(error,result)=>{
                if(error){
                    logger.error('getSyncLoadTask getDemand ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('getSyncLoadTask getDemand ' + 'success');
                    if (result.success){
                        resultData.require = result.result;
                        resolve(taskinfo);
                    } else {
                        reject({msg:"对方服务器:"+result.msg});
                    }
                }
            })
        });
    }
    const getRouteLoadTask = (taskinfo)=>{
        return new Promise((resolve,reject)=>{
            exRouteRequireDAO.getRouteLoadTask(taskinfo,(error,result)=>{
                if(error){
                    logger.error('getSyncLoadTask getRouteLoadTask ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('getSyncLoadTask getRouteLoadTask ' + 'success');
                    if (result.success){
                        resultData.routeLoadTask = result.result;
                        resUtil.resetQueryRes(res,resultData,null);
                        return next;
                    } else {
                        reject({msg:"对方服务器:"+result.msg});
                    }
                }
            })
        });
    }
    getLoadTask()
        .then(getSupplier)
        .then(getDemand)
        .then(getRouteLoadTask)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
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
    submitToSupplier,//供应商同步需求
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