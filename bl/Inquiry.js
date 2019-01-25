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
const commonUtil = require("../util/CommonUtil");

const addRouteInquiry = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        params.dateId = moment().format("YYYYMMDD");
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
            let carInfo = params.carInfo;
            let x =0;
            for (let i = 0; i < carInfo.length; i++) {
                params.modelId = carInfo[i].modelId;
                params.oldCar = carInfo[i].oldCar;
                params.safeStatus = carInfo[i].safeStatus;
                params.plan = carInfo[i].plan;
                params.carNum = carInfo[i].carNum;
                let price = commonUtil.calculatedAmount(params.serviceType,carInfo[i].oldCar,carInfo[i].modelId,params.distance,carInfo[i].safeStatus, carInfo[i].plan);
                params.transPrice = price.trans * carInfo[i].carNum;
                params.insurePrice = price.insure * carInfo[i].carNum;
                params.status = systemConst.CAR.inquiryStatus.showInUser;
                inquiryCarDAO.addCar(params,(error,result)=>{
                    if(error){
                        logger.error('addInquiryCar' + error.message);
                        reject(error);
                    }else{
                        logger.info('addInquiryCar:'+ i + ':success');
                        x++;
                        if (x == carInfo.length){
                            setTimeout(()=>{
                                resolve();
                            },500);
                        }
                    }
                })
            }
        }).then(()=>{
            new Promise((resolve,reject)=>{
                inquiryCarDAO.getSumPrice({inquiryId:params.inquiryId,status:systemConst.CAR.inquiryStatus.showInUser},(error,rows)=>{
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
    if (params.statusList) {
        params.statusList = params.statusList.split(",");
    }
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