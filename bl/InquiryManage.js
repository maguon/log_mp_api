'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('InquiryManage.js');
const inquiryManageDAO = require('../dao/InquiryManageDAO.js');

const updateInquiryManageStatus = (req,res,next) => {
    let params = req.params;
    inquiryManageDAO.updateInquiryManageStatus(params,(error,result)=>{
        if(error){
            logger.error('updateInquiryManageStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateInquiryManageStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const getInquiryManage = (req,res,next) => {
    let params = req.params;
    inquiryManageDAO.getInquiryManage(params,(error,result)=>{
        if(error){
            logger.error('getInquiryManage' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryManage' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getInquiryManageId = (req,res,next) => {
    let params = req.params;
    inquiryManageDAO.getInquiryManageId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryManageId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryManageId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getInquiryManageCar = (req,res,next) => {
    let params = req.params;
    inquiryManageDAO.getInquiryManageCar(params,(error,result)=>{
        if(error){
            logger.error('getInquiryManageCar' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryManageCar' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addInquiryManageOrder = (req,res,next) => {
    let params = req.params;
    inquiryManageDAO.addInquiryManageOrder(params,(error,result)=>{
        if(error){
            logger.error('addInquiryManageOrder' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addInquiryManageOrder' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const getInquiryManageOrder = (req,res,next) => {
    let params = req.params;
    inquiryManageDAO.getInquiryManageOrder(params,(error,rows)=>{
        if(error){
            logger.error('getInquiryManageOrder' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            let inquiryManageOrder = [{
                inquiryManageOrderId: rows[0].id,
                estimatedTotalFreight: rows[0].fee_price,
                negotiatingTotalFreight: rows[0].freight_price,
                mark: rows[0].mark,
                createdOn: rows[0].created_on + '00:00:00'
            }]
            logger.info('getInquiryManageOrder' + 'success');
            resUtil.resetQueryRes(res,inquiryManageOrder,null);
            return next();
        }
    })
}
module.exports = {
    getInquiryManage,
    getInquiryManageId,
    updateInquiryManageStatus,
    getInquiryManageCar,
    addInquiryManageOrder,
    getInquiryManageOrder
}