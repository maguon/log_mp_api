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
    inquiryManageDAO.getInquiryManageId(params,(error,rows)=>{
        if(error){
            logger.error('getInquiryManageId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            let inquiryManage = {
                routeStart: rows[0].route_start,
                routeEnd: rows[0].route_end,
                inquiryName: rows[0].inquiry_name,
                customerId: rows[0].customer_id,
                phone: rows[0].phone,
                inquiryManageId: rows[0].id,
                status: rows[0].status,
                inquiryTime: rows[0].created_on
            }
            logger.info('getInquiryManageId' + 'success');
            resUtil.resetQueryRes(res,inquiryManage,null);
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
            let inquiryManageOrder = {
                estimatedTotalFreight: rows[0].estimated_total_freight,
                negotiatingTotalFreight: rows[0].negotiating_total_freight,
                mark: rows[0].mark
            }
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