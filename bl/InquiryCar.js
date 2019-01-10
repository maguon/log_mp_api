'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('InquiryCar.js');
const inquiryCarDAO = require('../dao/InquiryCarDAO.js');
const inquiryDAO = require('../dao/InquiryDAO.js');
const commonUtil = require("../util/CommonUtil");
const sysConsts = require("../util/SystemConst");

const getInquiryCarByInquiryId = (req,res,next) => {
    let params = req.params;
    inquiryCarDAO.getInquiryCarByInquiryId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryCarByInquiryId' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getInquiryCarByInquiryId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addCar = (req,res,next) => {
    let params = req.params;
    let priceItem;
    new Promise((resolve,reject)=>{
        inquiryDAO.getById({inquiryId:params.inquiryId},(error,rows)=>{
            if(error){
                logger.error('getInquiryById' + error.message);
                reject(error);
            }else{
                logger.info('getInquiryById' + 'success');
                if (rows.length >0){
                    params.distance = rows[0].distance;
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.USER_GET_NO_INQUIRY);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            priceItem = commonUtil.calculatedAmount(params.serviceType,params.oldCar,params.modelId,params.distance,params.safeStatus,params.plan);
            params.transPrice = params.carNum * priceItem.trans;
            params.insurePrice = params.carNum * priceItem.insure;
            inquiryCarDAO.addCar(params,(error,result)=>{
                if(error){
                    logger.error('addInquiryCar' + error.message);
                    reject(error);
                }else if(result && result.insertId < 1){
                    logger.warn('addInquiryCar'+'创建车辆估值失败');
                    resUtil.resetFailedRes(res,'创建车辆估值失败',null);
                    reject(error);
                }else{
                    logger.info('addInquiryCar' + 'success');
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                inquiryCarDAO.getSumPrice({inquiryId:params.inquiryId,status:sysConsts.CAR.inquiryStatus.showInUser},(error,rows)=>{
                    if(error){
                        logger.error('getSumPrice' + error.message);
                        reject(error);
                    }else if(rows && rows.length < 1){
                        logger.warn('getSumPrice'+'查无此车辆估值信息');
                        resUtil.resetFailedRes(res,'查无此车辆估值信息',null);
                    }else{
                        logger.info('getSumPrice'+'success');
                        params.fee = rows[0].trans_price;
                        params.safePrice = rows[0].insure_price;
                        params.carNum = rows[0].sum_car_num;;
                        resolve();
                    }
                })
            }).then(()=>{
                inquiryDAO.updateFee({carNum:params.carNum,inquiryId:params.inquiryId,fee:params.fee,safePrice:params.safePrice},(error,result)=>{
                    if(error){
                        logger.error('updateFee' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('updateFee'+'success');
                        let inquiry_id = [{
                            inquiryId:params.inquiryId
                        }]
                        resUtil.resetQueryRes(res,inquiry_id,null);
                        return next();
                    }
                })
            })
        })

    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const addCarByOrder = (req,res,next) => {
    let params = req.params;
    params.type = 1;
    inquiryCarDAO.addCarByOrder(params,(error,result)=>{
        if(error){
            logger.error('addCarByOrder' + error.message);
            resUtil.resInternalError(error,res,next);
        }else if(result && result.insertId < 1){
            logger.warn('addCarByOrder'+'创建车辆估值失败');
            resUtil.resetFailedRes(res,'创建车辆估值失败',null);
        }else{
            logger.info('addCarByOrder' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        params.status = sysConsts.CAR.inquiryStatus.unShowInUser;
        inquiryCarDAO.updateStatus(params,(error,result)=>{
            if(error){
                logger.error('updateStatus' + error.message);
                reject(error);
            }else{
                logger.info('updateStatus' + 'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            inquiryCarDAO.getInquiryCar({inquiryCarId:params.inquiryCarId},(error,rows)=>{
                if(error){
                    logger.error('getInquiryCar' + error.message);
                    reject(error);
                }else if(rows && rows.length < 1){
                    logger.warn('getInquiryCar' + '查无此车辆信息');
                    resUtil.resetFailedRes(res,'查无此车辆信息',null);
                }else{
                    logger.info('getInquiryCar' + 'success');
                    params.inquiryId = rows[0].inquiry_id;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                let options = {
                    inquiryId:params.inquiryId,
                    status :sysConsts.CAR.inquiryStatus.showInUser
                }
                inquiryCarDAO.getSumPrice(options,(error,rows)=>{
                    if(error){
                        logger.error('getSumPrice' + error.message);
                        reject(error);
                    }else{
                        logger.info('getSumPrice' + 'success');
                        if (rows[0].trans_price) {
                            params.fee = rows[0].trans_price;
                        }else {
                            params.fee = 0;
                        }
                        if (rows[0].insure_price) {
                            params.safePrice = rows[0].insure_price;
                        }else {
                            params.safePrice = 0;
                        }
                        params.carNum = rows[0].sum_car_num;;
                        resolve();
                    }
                })
            }).then(()=>{
                inquiryDAO.updateFee({carNum:params.carNum,inquiryId:params.inquiryId,fee:params.fee,safePrice:params.safePrice},(error,result)=>{
                    if(error){
                        logger.error('updateFee' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('updateFee'+'success');
                        let updateMsg = [{
                            inquiryId:params.inquiryCarId
                        }]
                        resUtil.resetQueryRes(res,updateMsg,null);
                        return next();
                    }
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateInquiryCar = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        inquiryCarDAO.getInquiryCar({inquiryCarId:params.inquiryCarId},(error,rows)=>{
            if(error){
                logger.error('getInquiryCar' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getInquiryCar' + '查无此车辆信息');
                resUtil.resetFailedRes(res,'查无此车辆信息',null);
            }else{
                logger.info('getInquiryCar' + 'success');
                params.inquiryId = rows[0].inquiry_id;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            inquiryDAO.getById({inquiryId:params.inquiryId},(error,rows)=>{
                if(error){
                    logger.error('getById' + error.message);
                    reject(error);
                }else{
                    logger.info('getById' + 'success');
                    params.serviceType = rows[0].service_type;
                    params.distance = rows[0].distance;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                let priceItem = commonUtil.calculatedAmount(params.serviceType,params.oldCar,params.modelId,params.distance,params.safeStatus,params.plan);
                params.fee = params.carNum * priceItem.trans;
                params.safePrice = params.carNum * priceItem.insure;
                inquiryCarDAO.updateInquiryCar(params,(error,result)=>{
                    if(error){
                        logger.error('updateInquiryCar' + error.message);
                        reject(error);
                    }else{
                        logger.info('updateInquiryCar' + 'success');
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    let options = {
                        inquiryId:params.inquiryId,
                        status :sysConsts.CAR.inquiryStatus.showInUser
                    }
                    inquiryCarDAO.getSumPrice(options,(error,rows)=>{
                        if(error){
                            logger.error('getSumPrice' + error.message);
                            reject(error);
                        }else{
                            logger.info('getSumPrice' + 'success');
                            if (rows[0].trans_price) {
                                params.fee = rows[0].trans_price;
                            }else {
                                params.fee = 0;
                            }
                            if (rows[0].insure_price) {
                                params.safePrice = rows[0].insure_price;
                            }else {
                                params.safePrice = 0;
                            }
                            params.carNum = rows[0].sum_car_num;;
                            resolve();
                        }
                    })
                }).then(()=>{
                    inquiryDAO.updateFee({carNum:params.carNum,inquiryId:params.inquiryId,fee:params.fee,safePrice:params.safePrice},(error,result)=>{
                        if(error){
                            logger.error('updateFee' + error.message);
                            resUtil.resInternalError(error,res,next);
                        }else{
                            logger.info('updateFee'+'success');
                            let updateMsg = [{
                                inquiryId:params.inquiryCarId
                            }]
                            resUtil.resetQueryRes(res,updateMsg,null);
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
module.exports = {
    getInquiryCarByInquiryId,
    addCar,
    addCarByOrder,
    updateStatus,
    updateInquiryCar
}