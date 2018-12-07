'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('InquiryOrder.js');
const inquiryOrderDAO = require('../dao/InquiryOrderDAO.js');
const inquiryDAO = require('../dao/InquiryDAO.js');

const addInquiryOrder = (req,res,next) => {
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
                count = count +rows[0].car_num;
                params.feePrice = feePrice;
                params.count = count;
                params.serviceType = rows[0].service_type;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
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
const putInquiryOrder = (req,res,next) => {
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
    })
}
const putReceiveInfo = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.putReceiveInfo(params,(error,result)=>{
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
    inquiryOrderDAO.putStatus(params,(error,result)=>{
        if(error){
            logger.error('putStatus' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putStatus' + 'success');
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
const addOrderCar = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.addOrderCar(params,(error,result)=>{
        if(error){
            logger.error('addOrderCar' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addOrderCar' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const putMark = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.putMark(params,(error,result)=>{
        if(error){
            logger.error('putMark' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putMark' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addInquiryOrder,
    putInquiryOrder,
    putReceiveInfo,
    putFreightPrice,
    putStatus,
    getOrder,
    addOrderCar,
    putMark
}

