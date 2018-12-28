'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('RefundApply.js');
const refundApplyDAO = require('../dao/RefundApplyDAO.js');

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
module.exports = {
    addRefundApply,
    getRefundApply
}