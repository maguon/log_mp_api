'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('InquiryOrder.js');
const inquiryOrderDAO = require('../dao/InquiryOrderDAO.js');
const inquiryDAO = require('../dao/InquiryDAO.js');
const cityDAO = require('../dao/CityInfoDAO.js');
const routeDAO = require('../dao/RouteDAO.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');

const addInquiryOrderByUser = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        inquiryDAO.getInquiryByUserId(params,(error,rows)=>{
            if(error){
                logger.error('getInquiryByUserId' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getInquiryByUserId'+'查无此询价信息');
                resUtil.resetFailedRes(res,'查无此询价信息',null);
            }else{
                logger.info('getInquiryByUserId'+'success');
                let feePrice = 0;
                let count = 0;
                feePrice = feePrice + rows[0].total_trans_price;
                params.totalInsurePrice = feePrice + rows[0].total_insure_price;
                count = count +rows[0].car_num;
                params.feePrice = feePrice;
                params.count = count;
                params.serviceType = rows[0].service_type;
                params.createdType = 1;
                params.routeStartId = rows[0].start_id;
                params.routeEndId = rows[0].end_id;
                params.routeStart = rows[0].start_city;
                params.routeEnd = rows[0].end_city;
                params.routeId = rows[0].route_id;
                params.oraTransPrice = rows[0].ora_trans_price;
                params.oraInsurePrice = rows[0].ora_insure_price;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.dateId = moment().format("YYYYMMDD");
            inquiryOrderDAO.addInquiryOrder(params,(error,result)=>{
                if(error){
                    logger.error('addInquiryOrder' + error.message);
                    reject(error);
                }else{
                    logger.info('addInquiryOrder'+'success');
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                inquiryDAO.updateInquiryStatus({status:2,inquiryId:params.inquiryId},(error,result)=>{
                    if(error){
                        logger.error('updateInquiryStatus' + error.message);
                        reject(error);
                    }else{
                        logger.info('updateInquiryStatus'+'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const addInquiryOrderByAdmin = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        inquiryDAO.getInquiryByUserId(params,(error,rows)=>{
            if(error){
                logger.error('getInquiryByUserId' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getInquiryByUserId'+'查无此询价信息');
                resUtil.resetFailedRes(res,'查无此询价信息',null);
            }else{
                logger.info('getInquiryByUserId'+'success');
                let feePrice = 0;
                let count = 0;
                feePrice = feePrice + rows[0].fee_price;
                count = count + rows[0].car_num;
                params.userId = rows[0].user_id;
                params.feePrice = feePrice;
                params.count = count;
                params.serviceType = rows[0].service_type;
                params.createdType = 2;
                params.routeStartId = rows[0].start_id;
                params.routeEndId = rows[0].end_id;
                params.routeStart = rows[0].start_city;
                params.routeEnd = rows[0].end_city;
                params.routeId = rows[0].route_id;
                params.oraTransPrice = rows[0].ora_trans_price;
                params.oraInsurePrice = rows[0].ora_insure_price;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            routeDAO.getRoute({routeId:params.routeId},(error,rows)=>{
                if(error){
                    logger.error('getRoute' + error.message);
                    reject(error);
                }else if(rows && rows.length < 1){
                    logger.warn('getRoute'+'没有这个路线');
                    resUtil.resetFailedRes(res,'没有这个路线',null);
                }else{
                    logger.info('getRoute'+'success');
                    params.distance = rows[0].distance;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                params.dateId = moment().format("YYYYMMDD");
                inquiryOrderDAO.addInquiryOrder(params,(error,result)=>{
                    if(error){
                        logger.error('addInquiryOrder' + error.message);
                        reject(error);
                    }else{
                        logger.info('addInquiryOrder'+'success');
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    inquiryDAO.updateInquiryStatus({status:2,inquiryId:params.inquiryId},(error,result)=>{
                        if(error){
                            logger.error('updateInquiryStatus' + error.message);
                            reject(error);
                        }else{
                            logger.info('updateInquiryStatus'+'success');
                            resUtil.resetUpdateRes(res,result,null);
                            return next();
                        }
                    })
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const putInquiryOrder = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.putInquiryOrder(params,(error,result)=>{
        if(error){
            logger.error('putInquiryOrder' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('putInquiryOrder' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
    /*new Promise((resolve,reject)=>{
        inquiryDAO.getInquiryByUserId(params,(error,rows)=>{
            if(error){
                logger.error('getInquiryByUserId' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getInquiryByUserId'+'查无此询价信息');
                resUtil.resetFailedRes(res,'查无此询价信息',null);
            }else{
                logger.info('getInquiryByUserId'+'success');
                let feePrice = 0;
                let count = 0;
                for(let i = 0 ; i < rows.length ; i++){
                    feePrice = feePrice + rows[i].fee * rows[i].car_num;
                    count = count +rows[i].car_num
                }
                params.feePrice = feePrice;
                params.count = count;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            inquiryOrderDAO.putInquiryOrder(params,(error,result)=>{
                if(error){
                    logger.error('putInquiryOrder' + error.message);
                    reject(error);
                }else{
                    logger.info('putInquiryOrder' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })*/
}
const putReceiveInfo = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('putReceiveInfo' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putReceiveInfo' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const putFreightPrice = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.putFreightPrice(params,(error,result)=>{
        if(error){
            logger.error('putFreightPrice' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putFreightPrice' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const putStatus = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('updateStatus' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const getOrder = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.getOrder(params,(error,result)=>{
        if(error){
            logger.error('getOrder' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrder' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getOrderByUser = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.getOrderByUser(params,(error,result)=>{
        if(error){
            logger.error('getOrderByUser' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrderByUser' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const putAdminMark = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.putAdminMark(params,(error,result)=>{
        if(error){
            logger.error('putAdminMark' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putAdminMark' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const cancelOrder = (req,res,next) => {
    let params = req.params;
    params.myDate = new Date();
    inquiryOrderDAO.cancelOrder(params,(error,result)=>{
        if(error){
            logger.error('cancelOrder' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('cancelOrder' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const putSendInfo = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('putSendInfo' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putSendInfo' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const addOrder = (req,res,next) => {
    let params = req.params;
    let routeStartId = "";
    let routeEndId = "";
    routeStartId = routeStartId + params.routeStartId;
    routeEndId = routeEndId + params.routeEndId;
    if(params.routeStartId > params.routeEndId){
        params.routeId =routeEndId + routeStartId;
    }else{
        params.routeId = routeStartId + routeEndId;
    }
    new Promise((resolve,reject)=>{
        routeDAO.getRoute({routeId:params.routeId},(error,rows)=>{
            if(error){
                logger.error('getRoute' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getRoute'+'没有这个路线');
                resUtil.resetFailedRes(res,'没有这个路线',null);
            }else{
                logger.info('getRoute'+'success');
                params.distance = rows[0].distance;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            cityDAO.queryCity({cityId:params.routeStartId},(error,rows)=>{
                if(error){
                    logger.error('queryCity' + error.message);
                    reject(error);
                }else if(rows && rows.length < 1){
                    logger.warn('queryCity'+'没有这个城市');
                    resUtil.resetFailedRes(res,'没有这个城市',null);
                }else{
                    logger.info('queryCity'+'success');
                    params.routeStart = rows[0].city_name;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                cityDAO.queryCity({cityId:params.routeEndId},(error,rows)=>{
                    if(error){
                        logger.error('queryCity' + error.message);
                        reject(error);
                    }else if(rows && rows.length < 1){
                        logger.warn('queryCity'+'没有这个城市');
                        resUtil.resetFailedRes(res,'没有这个城市',null);
                    }else{
                        logger.info('queryCity'+'success');
                        params.routeEnd = rows[0].city_name;
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    params.dateId = moment().format("YYYYMMDD");
                    inquiryOrderDAO.addOrder(params,(error,result)=>{
                        if(error){
                            logger.error('addOrder' + error.message);
                            reject(error);
                        }else{
                            logger.info('addOrder' + 'success');
                            resUtil.resetCreateRes(res,result,null);
                            return next();
                        }
                    })
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const getOrderNew = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.getOrderNew(params,(error,result)=>{
        if(error){
            logger.error('getOrderNew' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrderNew' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updatePaymentRemark = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updatePaymentRemark(params,(error,result)=>{
        if(error){
            logger.error('updatePaymentRemark:' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updatePaymentRemark:' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateById = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('updateById:' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateById:' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addInquiryOrderByAdmin,
    addInquiryOrderByUser,
    putInquiryOrder,
    putReceiveInfo,
    putFreightPrice,
    putStatus,
    getOrder,
    putAdminMark,
    cancelOrder,
    putSendInfo,
    getOrderByUser,
    addOrder,
    getOrderNew,
    updatePaymentRemark,
    updateById
}

