'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Inquiry.js');
const inquiryDAO = require('../dao/InquiryDAO.js');
const inquiryCarDAO = require('../dao/InquiryCarDAO.js');
const moment = require('moment/moment.js');
const systemConst = require('../util/SystemConst.js');

const addRouteInquiry = (req,res,next) => {
    let params = req.params;
    let modelId = params.modelId;
    let oldCar = params.oldCar;
    let carNum = params.carNum;
    let plan = params.plan;
    let safeStatus = params.safeStatus;
    new Promise((resolve,reject)=>{
        inquiryDAO.addRouteInquiry(params,(error,result)=>{
            if(error){
                logger.error('addRouteInquiry' + error.message);
                reject(error);
            }else if(result && result.insertId < 1){
                logger.warn('addRouteInquiry'+'询价信息创建失败');
                resUtil.resetFailedRes(res,'询价信息创建失败',null);
            }else{
                logger.info('addRouteInquiry' + 'success');
                params.inquiryId = result.insertId;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            for (let i = 0; i < modelId.length; i++) {
                params.modelId = modelId[i];
                params.oldCar = oldCar[i];
                params.carNum = carNum[i];
                params.plan = plan[i];
                params.safeStatus = safeStatus[i];
                params.valuation = params.plan;
                params.modelType = params.modelId;
                systemConst.transAndInsurePrice(params,(rows)=>{
                    params.fee = rows[0].trans;
                    params.safePrice = rows[0].insure;
                });
                inquiryCarDAO.addCar(params,(error,result)=>{
                    if(error){
                        logger.error('addRouteInquiry' + error.message);
                        reject(error);
                    }else{
                        logger.info('addRouteInquiry'+ i + 'success');
                    }
                })
            }
            setTimeout(()=>{
                resolve();
            },500);
        }).then(()=>{
            new Promise((resolve,reject)=>{
                inquiryCarDAO.getInquiryCarByInquiryId({inquiryId:params.inquiryId,type:0},(error,rows)=>{
                    if(error){
                        logger.error('getInquiryCarByInquiryId' + error.message);
                        reject(error);
                    }else if(rows && rows.length < 1){
                        logger.warn('getInquiryCarByInquiryId'+'查无此车辆估值信息');
                        resUtil.resetFailedRes(res,'查无此车辆估值信息',null);
                    }else{
                        logger.info('getInquiryCarByInquiryId'+'success');
                        let fee = 0;
                        let safePrice = 0;
                        let count = 0;
                        for(let i = 0;i<rows.length;i++){
                            fee = fee + rows[i].trans_price * rows[i].car_num;
                            safePrice = safePrice + rows[i].insure_price * rows[i].car_num;
                            count = count + rows[i].car_num;
                        }
                        params.fee = fee;
                        params.safePrice = safePrice;
                        params.carNum = count;
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    inquiryDAO.updateFee({carNum:params.carNum,inquiryId:params.inquiryId,fee:params.fee,safePrice:params.safePrice},(error,result)=>{
                        if(error){
                            logger.error('updateFee' + error.message);
                            reject(error);
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
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const getInquiryByUserId = (req,res,next) => {
    let params = req.params;
    inquiryDAO.getInquiryByUserId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryByUserId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryByUserId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateInquiryStatus = (req,res,next) => {
    let params = req.params;
    inquiryDAO.updateInquiryStatus(params,(error,result)=>{
        if(error){
            logger.error('updateInquiryStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateInquiryStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateFeePrice = (req,res,next) => {
    let params = req.params;
    params.myDate = new Date();
    params.status = systemConst.INQUIRY.status.enquiryPrice;
    inquiryDAO.updateFeePrice(params,(error,result)=>{
        if(error){
            logger.error('updateFeePrice' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateFeePrice' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const cancelInquiry = (req,res,next) => {
    let params = req.params;
    params.myDate = new Date();
    inquiryDAO.cancelInquiry(params,(error,result)=>{
        if(error){
            logger.error('cancelInquiry' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('cancelInquiry' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addRouteInquiry,
    getInquiryByUserId,
    updateInquiryStatus,
    updateFeePrice,
    cancelInquiry
}