'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('WechatBl.js');

const getUserIdByCode = (req,res,next) =>{
    wechatDAO.getUserIdByCode(req.params,(error,result)=>{
        if (error) {
            logger.error(' getUserIdByCode ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{

            logger.info(' getUserIdByCode ' + 'success');
            resUtil.resetQueryRes(res, result);

        }
    })
}
const unifiedOrder = (req,res,next) => {
    let params = req.params;
    let paramsOrder = '';
    new Promise((resolve,reject)=>{
        wechatDAO.unifiedOrder(params,(error,rows)=>{
            if (error) {
                logger.error(' unifiedOrder ' + error.message);
                throw resUtil.resInternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                paramsOrder = {
                    return_code: rows[0].return_code,
                    result_code: rows[0].result_code,
                    return_msg: rows[0].return_msg,
                    appid: rows[0].appid,
                    mch_id: rows[0].mch_id,
                    device_info: rows[0].device_info,
                    nonce_str: rows[0].nonce_str,
                    sign: rows[0].sign,
                    err_code: rows[0].err_code,
                    err_code_des: rows[0].err_code_des,
                    trade_type: rows[0].trade_type,
                    prepay_id: rows[0].prepay_id,
                    code_url: rows[0].code_url,
                }
                logger.info(' unifiedOrder ' + 'success');
                resolve(paramsOrder);
            }
        })
    }).then(()=>{
        wechatDAO.createUnifiedOrder(paramsOrder,(error,result)=>{
            if (error) {
                logger.error(' createUnifiedOrder ' + error.message);
                throw resUtil.resInternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('createUnifiedOrder' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}
const orderQuery = (req,res,next) => {
    let params = req.params;
    wechatDAO.orderQuery(params,(error,result)=>{
        if (error) {
            logger.error(' orderQuery ' + error.message);
            throw resUtil.resInternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info(' orderQuery ' + 'success');
            resUtil.resetQueryRes(res,result);
            return next();
        }
    })
}
const closeOrder = (req,res,next) => {
    let params = req.params;
    wechatDAO.closeOrder(params,(error,result)=>{
        if (error) {
            logger.error(' closeOrder ' + error.message);
            throw resUtil.resInternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{

            logger.info(' closeOrder ' + 'success');
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    })
}
const refund = (req,res,next) => {
    let params = req.params;
    wechatDAO.refund(params,(error,result)=>{
        if (error) {
            logger.error(' refund ' + error.message);
            throw resUtil.resInternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{

            logger.info(' refund ' + 'success');
            resUtil.resetCreateRes(res, result);
            return next();
        }
    })
}
const refundQuery = (req,res,next) => {
    let params = req.params;
    wechatDAO.refundQuery(params,(error,result)=>{
        if (error) {
            logger.error(' refundQuery ' + error.message);
            throw resUtil.resInternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{

            logger.info(' refundQuery ' + 'success');
            resUtil.resetQueryRes(res, result);
            return next();
        }
    })
}
const getUserById = (req,res,next) => {

}
module.exports ={
    getUserIdByCode,
    unifiedOrder,
    orderQuery,
    closeOrder,
    refund,
    refundQuery
}
