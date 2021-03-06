'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const logger = serverLogger.createLogger('InquiryCar.js');
const inquiryCarDAO = require('../dao/InquiryCarDAO.js');
const inquiryDAO = require('../dao/InquiryDAO.js');
const commonUtil = require("../util/CommonUtil");
const sysConsts = require("../util/SystemConst");

const getInquiryCarByInquiryId = (req,res,next) => {
    let params = req.params;
    inquiryCarDAO.getByInquiryId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryCarByInquiryId ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getInquiryCarByInquiryId ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addCar = (req,res,next) => {
    let params = req.params;
    let priceItem;
    const getInquiryInfo = () =>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.getById({inquiryId:params.inquiryId},(error,rows)=>{
                if(error){
                    logger.error('addCar getInquiryInfo ' + error.message);
                    reject({err:erroe});
                }else{
                    logger.info('addCar getInquiryInfo ' + 'success');
                    if (rows.length >0){
                        params.distance = rows[0].distance;
                        resolve(params);
                    } else {
                        reject({msg:sysMsg.USER_GET_NO_INQUIRY});
                    }
                }
            })
        });
    }
    const addInfo = (inqInfo)=>{
        return new Promise((resolve,reject)=>{
            priceItem = commonUtil.calculatedAmount(inqInfo.serviceType,inqInfo.oldCar,inqInfo.modelId,inqInfo.distance,inqInfo.safeStatus,inqInfo.plan);
            inqInfo.transPrice = inqInfo.carNum * priceItem.trans;
            inqInfo.insurePrice = inqInfo.carNum * priceItem.insure;
            inquiryCarDAO.addCar(inqInfo,(error,result)=>{
                if(error){
                    logger.error('addCar addInfo ' + error.message);
                    reject({err:error});
                }else{
                    if(result && result.insertId < 1){
                        logger.warn('addCar addInfo '+'Failed to create vehicle valuation!');
                        reject({msg:'创建车辆估值失败'});
                        reject(error);
                    }else{
                        logger.info('addCar addInfo ' + 'success');
                        resolve(inqInfo);
                    }
                }
            })
        });
    }
    const getSum = (inqInfo)=>{
        return new Promise((resolve,reject)=>{
            inquiryCarDAO.getSumPrice({inquiryId:inqInfo.inquiryId,status:sysConsts.CAR.inquiryStatus.showInUser},(error,rows)=>{
                if(error){
                    logger.error('addCar getSum ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1){
                        logger.warn('addCar getSum '+'No vehicle valuation information available!');
                        reject({msg:'查无此车辆估值信息'});
                    }else{
                        logger.info('addCar getSum '+'success');
                        inqInfo.fee = rows[0].trans_price;
                        inqInfo.safePrice = rows[0].insure_price;
                        inqInfo.carNum = rows[0].sum_car_num;
                        resolve(inqInfo);
                    }
                }
            })
        });
    }
    const updateFee = (feeInfo)=>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.updateFee({carNum:feeInfo.carNum,inquiryId:feeInfo.inquiryId,fee:feeInfo.fee,safePrice:feeInfo.safePrice},(error,result)=>{
                if(error){
                    logger.error('addCar updateFee ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addCar updateFee '+'success');
                    let inquiry_id = [{
                        inquiryId:feeInfo.inquiryId
                    }]
                    resUtil.resetQueryRes(res,inquiry_id,null);
                    return next();
                }
            })
        });
    }
    getInquiryInfo()
        .then(addInfo)
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
const addCarByOrder = (req,res,next) => {
    let params = req.params;
    params.type = 1;
    inquiryCarDAO.addCarByOrder(params,(error,result)=>{
        if(error){
            logger.error('addCarByOrder ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else if(result && result.insertId < 1){
            logger.warn('addCarByOrder '+'Failed to create vehicle valuation!');
            resUtil.resetFailedRes(res,'创建车辆估值失败',null);
        }else{
            logger.info('addCarByOrder ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    const updateStu = () =>{
        return new Promise((resolve,reject)=>{
            params.status = sysConsts.CAR.inquiryStatus.unShowInUser;
            inquiryCarDAO.updateStatus(params,(error,result)=>{
                if(error){
                    logger.error('updateStatus updateStu ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateStatus updateStu ' + 'success');
                    resolve(params);
                }
            })
        });
    }
    const getInquiryId = (inquiryInfo) =>{
        return new Promise((resolve,reject)=>{
            inquiryCarDAO.getByInquiryId({inquiryCarId:inquiryInfo.inquiryCarId},(error,rows)=>{
                if(error){
                    logger.error('updateStatus getInquiryId ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1){
                        logger.warn('updateStatus getInquiryId ' + 'No vehicle information available!');
                        reject({msg:'查无此车辆信息'});
                    }else{
                        logger.info('updateStatus getInquiryId ' + 'success');
                        inquiryInfo.inquiryId = rows[0].inquiry_id;
                        resolve(inquiryInfo);
                    }
                }
            })
        });
    }
    const getSum = (inquiryInfo) =>{
        return new Promise((resolve,reject)=>{
            let options = {
                inquiryId:inquiryInfo.inquiryId,
                status :sysConsts.CAR.inquiryStatus.showInUser
            }
            inquiryCarDAO.getSumPrice(options,(error,rows)=>{
                if(error){
                    logger.error('updateStatus getSum ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateStatus getSum ' + 'success');
                    if (rows[0].trans_price) {
                        inquiryInfo.fee = rows[0].trans_price;
                    }else {
                        inquiryInfo.fee = 0;
                    }
                    if (rows[0].insure_price) {
                        inquiryInfo.safePrice = rows[0].insure_price;
                    }else {
                        inquiryInfo.safePrice = 0;
                    }
                    inquiryInfo.carNum = rows[0].sum_car_num;
                    resolve(inquiryInfo);
                }
            })
        });
    }
    const updateFee = (inquiryInfo) =>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.updateFee({carNum:inquiryInfo.carNum,inquiryId:inquiryInfo.inquiryId,fee:inquiryInfo.fee,safePrice:inquiryInfo.safePrice},(error,result)=>{
                if(error){
                    logger.error('updateStatus updateFee ' + error.message);
                    reject({err:error});
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('updateStatus updateFee '+'success');
                    let updateMsg = [{
                        inquiryId:inquiryInfo.inquiryCarId
                    }]
                    resUtil.resetQueryRes(res,updateMsg,null);
                    return next();
                }
            })
        });
    }
    updateStu()
        .then(getInquiryId)
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
const updateInquiryCar = (req,res,next) => {
    let params = req.params;
    const getInquiryId = ()=>{
        return new Promise((resolve,reject)=>{
            inquiryCarDAO.getByInquiryId({inquiryCarId:params.inquiryCarId},(error,rows)=>{
                if(error){
                    logger.error('updateInquiryCar getInquiryId ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1){
                        logger.warn('updateInquiryCar getInquiryId ' + 'No vehicle information available!');
                        reject({msg:'查无此车辆信息'});
                    }else{
                        logger.info('updateInquiryCar getInquiryId ' + 'success');
                        params.inquiryId = rows[0].inquiry_id;
                        resolve(params);
                    }
                }
            })
        });
    }
    const getById = (inquiryInfo)=>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.getById({inquiryId:inquiryInfo.inquiryId},(error,rows)=>{
                if(error){
                    logger.error('updateInquiryCar getById ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateInquiryCar getById ' + 'success');
                    inquiryInfo.serviceType = rows[0].service_type;
                    inquiryInfo.distance = rows[0].distance;
                    resolve(inquiryInfo);
                }
            })
        });
    }
    const updateCar = (CarInfo)=>{
        return new Promise((resolve,reject)=>{
            let priceItem = commonUtil.calculatedAmount(CarInfo.serviceType,CarInfo.oldCar,CarInfo.modelId,CarInfo.distance,CarInfo.safeStatus,CarInfo.plan);
            CarInfo.fee = CarInfo.carNum * priceItem.trans;
            CarInfo.safePrice = CarInfo.carNum * priceItem.insure;
            inquiryCarDAO.updateInquiryCar(CarInfo,(error,result)=>{
                if(error){
                    logger.error('updateInquiryCar updateCar ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateInquiryCar updateCar ' + 'success');
                    resolve(CarInfo);
                }
            })
        });
    }
    const getSum = (CarInfo) =>{
        return new Promise((resolve,reject)=>{
            let options = {
                inquiryId:CarInfo.inquiryId,
                status :sysConsts.CAR.inquiryStatus.showInUser
            }
            inquiryCarDAO.getSumPrice(options,(error,rows)=>{
                if(error){
                    logger.error('updateInquiryCar getSumPrice ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateInquiryCar getSumPrice ' + 'success');
                    if (rows[0].trans_price) {
                        CarInfo.fee = rows[0].trans_price;
                    }else {
                        CarInfo.fee = 0;
                    }
                    if (rows[0].insure_price) {
                        CarInfo.safePrice = rows[0].insure_price;
                    }else {
                        CarInfo.safePrice = 0;
                    }
                    CarInfo.carNum = rows[0].sum_car_num;
                    resolve(CarInfo);
                }
            })
        });
    }
    const updateFee = (CarInfo)=>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.updateFee({carNum:CarInfo.carNum,inquiryId:CarInfo.inquiryId,fee:CarInfo.fee,safePrice:CarInfo.safePrice},(error,result)=>{
                if(error){
                    logger.error('updateInquiryCar updateFee ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateInquiryCar updateFee '+'success');
                    let updateMsg = [{
                        inquiryId:CarInfo.inquiryCarId
                    }]
                    resUtil.resetQueryRes(res,updateMsg,null);
                    return next();
                }
            })
        });
    }
    getInquiryId()
        .then(getById)
        .then(updateCar)
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
module.exports = {
    getInquiryCarByInquiryId,
    addCar,
    addCarByOrder,
    updateStatus,
    updateInquiryCar
}