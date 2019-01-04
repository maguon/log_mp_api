'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('RefundApply.js');
const refundApplyDAO = require('../dao/RefundApplyDAO.js');
const sysConst = require("../util/SystemConst");

const addRefundApply = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.addRefundApply(params,(error,result)=>{
        if(error){
            logger.error('addRefundApply' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addRefundApply' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getRefundApply = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.getRefundApply(params,(error,result)=>{
        if(error){
            logger.error('getRefundApply' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getRefundApply' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateRefuseStatus = (req,res,next)=>{
    let params = req.params;
    params.status = sysConst.REFUND_STATUS.refuse;
    refundApplyDAO.updateRefuseStatus(params,(error,result)=>{
        if(error){
            logger.error('updateRefuseStatus' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefuseStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateRefundStatus = (req,res,next)=>{
    let params = req.params;
    params.status = sysConst.REFUND_STATUS.refunded;
    refundApplyDAO.updateRefundStatus(params,(error,result)=>{
        if(error){
            logger.error('updateRefundStatus' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefundStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const getRefundApplyStat = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.getRefundApplyStat(params,(error,result)=>{
        if(error){
            logger.error('getRefundApplyStat' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getRefundApplyStat' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}

const updateRefundById = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.updateRefundById(params,(error,result)=>{
        if(error){
            logger.error('updateRefundById:' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefundById:' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const deleteById = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.deleteById(params,(error,result)=>{
        if(error){
            logger.error('deleteRefundApply:' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('deleteRefundApply:' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addRefundApply,
    getRefundApply,
    updateRefuseStatus,
    updateRefundStatus,
    getRefundApplyStat,
    updateRefundById,
    deleteById
}