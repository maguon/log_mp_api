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
    params.dateId = moment().format("YYYYMMDD");
    const insetRouInq = () =>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.addRouteInquiry(params,(error,result)=> {
                if (error) {
                    logger.error('addRouteInquiry insetRouInq ' + error.message);
                    reject(error);
                }else{
                    if(result && result.insertId < 1) {
                        logger.warn('addRouteInquiry insetRouInq ' + ' Inquiry information creation failed!');
                        reject({msg:'询价信息创建失败!'});
                    }else{
                        logger.info('addRouteInquiry insetRouInq ' + 'success');
                        params.inquiryId = result.insertId;
                        resolve(params.carInfo);
                    }
                }
            })
        });
    }
    const addCar = (CarRecords) =>{
        return new Promise((resolve,reject)=>{
            let x =0;
            CarRecords.forEach((record,i)=>{
                params.modelId = record.modelId;
                params.oldCar = record.oldCar;
                params.safeStatus = record.safeStatus;
                params.plan = record.plan;
                params.carNum = record.carNum;
                let price = commonUtil.calculatedAmount(params.serviceType,record.oldCar,record.modelId,params.distance,record.safeStatus, record.plan);
                params.transPrice = price.trans * record.carNum;
                params.insurePrice = price.insure * record.carNum;
                params.status = systemConst.CAR.inquiryStatus.showInUser;
                inquiryCarDAO.addCar(params,(error,result)=>{
                    if(error){
                        logger.error('addRouteInquiry addCar ' + error.message);
                        reject(error);
                    }else{
                        logger.info('addRouteInquiry addCar '+ i + ' success');
                        x++;
                        if (x == CarRecords.length){
                            setTimeout(()=>{
                                resolve();
                            },500);
                        }
                    }
                })
            })
        });
    }
    const getSum = ()=>{
        return new Promise((resolve,reject)=>{
            inquiryCarDAO.getSumPrice({inquiryId:params.inquiryId,status:systemConst.CAR.inquiryStatus.showInUser},(error,rows)=>{
                if(error){
                    logger.error('addRouteInquiry getSum ' + error.message);
                    reject(error);
                }else {
                    if(rows && rows.length < 1){
                        logger.warn('addRouteInquiry getSum '+'No vehicle valuation information available!');
                        reject({msg:'查无此车辆估值信息!'});
                    }else{
                        logger.info('addRouteInquiry getSum '+'success');
                        params.fee = rows[0].trans_price;
                        params.safePrice = rows[0].insure_price;
                        params.carNum = rows[0].sum_car_num;;
                        resolve(params);
                    }
                }
            })
        });
    }
    const updateFee = (record) =>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.updateFee({carNum:record.carNum,inquiryId:record.inquiryId,fee:record.fee,safePrice:record.safePrice},(error,result)=>{
                if(error){
                    logger.error('addRouteInquiry updateFee ' + error.message);
                    reject(error);
                }else{
                    logger.info('addRouteInquiry updateFee '+'success');
                    let inquiry_id = [{
                        inquiryId:record.inquiryId
                    }]
                    resUtil.resetQueryRes(res,inquiry_id,null);
                    return next();
                }
            })
        });
    }

    insetRouInq()
        .then(addCar)
        .then(getSum)
        .then(updateFee)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const getInquiryByUserId = (req,res,next) => {
    let params = req.params;
    if (params.statusList) {
        params.statusList = params.statusList.split(",");
    }
    inquiryDAO.getInquiryByUserId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryByUserId ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryByUserId ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateInquiryStatus = (req,res,next) => {
    let params = req.params;
    inquiryDAO.updateInquiryStatus(params,(error,result)=>{
        if(error){
            logger.error('updateInquiryStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateInquiryStatus ' + 'success');
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
            logger.error('updateFeePrice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateFeePrice ' + 'success');
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
            logger.error('cancelInquiry ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('cancelInquiry ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const getUnConsultOrderCount = (req,res,next) => {
    let params = req.params;
    params.status= systemConst.INQUIRY.status.enquiryPrice;
    inquiryDAO.getById(params,(error,rows)=>{
        if(error){
            logger.error('getUnConsultOrderCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUnConsultOrderCount  ' + 'success');
            resUtil.resetQueryRes(res,rows.length,null);
            return next();
        }
    })
}
module.exports = {
    addRouteInquiry,
    getInquiryByUserId,
    updateInquiryStatus,
    updateFeePrice,
    cancelInquiry,
    getUnConsultOrderCount
}