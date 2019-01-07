'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('InquiryCar.js');
const inquiryCarDAO = require('../dao/InquiryCarDAO.js');
const inquiryDAO = require('../dao/InquiryDAO.js');

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
    new Promise((resolve,reject)=>{
        inquiryCarDAO.addCar(params,(error,result)=>{
            if(error){
                logger.error('addRouteInquiry' + error.message);
                reject(error);
            }else if(result && result.insertId < 1){
                logger.warn('addRouteInquiry'+'创建车辆估值失败');
                resUtil.resetFailedRes(res,'创建车辆估值失败',null);
            }else{
                logger.info('addRouteInquiry' + 'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            inquiryCarDAO.getInquiryCarByInquiryId({inquiryId:params.inquiryId},(error,rows)=>{
                if(error){
                    logger.error('getInquiryCarByInquiryId' + error.message);
                    reject(error);
                }else if(rows && rows.length < 1){
                    logger.warn('getInquiryCarByInquiryId'+'没有此询价车辆估值信息');
                    resUtil.resetFailedRes(res,'没有此询价车辆估值信息',null);
                }else{
                    logger.info('getInquiryCarByInquiryId' + 'success');
                    let fee = 0;
                    let carNum = 0;
                    let safePrice = 0;
                    for(let i = 0;i < rows.length; i++){
                        fee = fee + rows[i].trans_price * rows[i].car_num;
                        carNum = carNum + rows[i].car_num;
                        safePrice = safePrice + rows[i].insure_price * rows[i].car_num;
                    }
                    params.fee = fee;
                    params.carNum = carNum;
                    params.safePrice = safePrice;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                inquiryDAO.updateFeeByCar({safePrice:params.safePrice,inquiryId:params.inquiryId,fee:params.fee,carNum:params.carNum},(error,result)=>{
                    if(error){
                        logger.error('updateFee' + error.message);
                        reject(error);
                    }else{
                        logger.info('updateFee'+'success');
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
                inquiryCarDAO.getInquiryCarByInquiryId({inquiryId:params.inquiryId},(error,rows)=>{
                    if(error){
                        logger.error('getInquiryCarByInquiryId' + error.message);
                        reject(error);
                    }else if(rows && rows.length < 1){
                        logger.warn('getInquiryCarByInquiryId' + '查无此询价车辆信息');
                        resUtil.resetFailedRes(res,'查无此询价车辆信息',null);
                    }else{
                        logger.info('getInquiryCarByInquiryId' + 'success');
                        params.carNum= 0;
                        params.oraTransPrice = 0;
                        params.oraInsurePrice = 0;
                        for (let i = 0; i < rows.length; i++) {
                            params.carNum = params.carNum + rows[i].car_num;
                            params.oraTransPrice = params.oraTransPrice + rows[i].trans_price * rows[i].car_num;
                            params.oraInsurePrice = params.oraInsurePrice + rows[i].insure_price * rows[i].car_num;
                        }
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    inquiryDAO.updateCarNum(params,(error,result)=>{
                        if(error){
                            logger.error('updateCarNum' + error.message);
                            reject(error);
                        }else{
                            logger.info('updateCarNum' + 'success');
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
const updateInquiryCar = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
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
            inquiryCarDAO.getInquiryCarByInquiryId({inquiryCarId:params.inquiryCarId},(error,rows)=>{
                if(error){
                    logger.error('getInquiryCarByInquiryId' + error.message);
                    reject(error);
                }else if(rows && rows.length < 1){
                    logger.warn('getInquiryCarByInquiryId' + '查无此车辆信息');
                    resUtil.resetFailedRes(res,'查无此车辆信息',null);
                }else{
                    logger.info('getInquiryCarByInquiryId' + 'success');
                    params.inquiryId = rows[0].inquiry_id;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                inquiryCarDAO.getInquiryCarByInquiryId({inquiryId:params.inquiryId},(error,rows)=>{
                    if(error){
                        logger.error('getInquiryCarByInquiryId' + error.message);
                        reject(error);
                    }else if(rows && rows.length < 1){
                        logger.warn('getInquiryCarByInquiryId' + '查无此车辆信息');
                        resUtil.resetFailedRes(res,'查无此车辆信息',null);
                    }else{
                        logger.info('getInquiryCarByInquiryId' + 'success');
                        let carNum = 0;
                        let oraTransPrice = 0;
                        let oraInsurePrice = 0;
                        for (let i = 0; i < rows.length; i++) {
                            carNum = carNum + rows[i].car_num;
                            oraTransPrice = oraTransPrice + rows[i].trans_price * rows[i].car_num;
                            oraInsurePrice = oraInsurePrice + rows[i].insure_price * rows[i].car_num;
                        }
                        params.oraTransPrice = oraTransPrice;
                        params.oraInsurePrice = oraInsurePrice;
                        params.carNum = carNum;
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    inquiryDAO.updateCarNum(params,(error,result)=>{
                        if(error){
                            logger.error('updateCarNum' + error.message);
                            reject(error);
                        }else{
                            logger.info('updateCarNum' + 'success');
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
module.exports = {
    getInquiryCarByInquiryId,
    addCar,
    addCarByOrder,
    updateStatus,
    updateInquiryCar
}