'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Inquiry.js');
const inquiryDAO = require('../dao/InquiryDAO.js');

const getAdminUserInfo = (req,res,next) => {
    let params = req.params;
    inquiryDAO.getAdminUserInfo(params,(error,result)=>{
        if(error){
            logger.error('getAdminUserInfo' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUserInfo' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addRouteInquiry = (req,res,next) => {
    let params = req.params;
    inquiryDAO.addRouteInquiry(params,(error,result)=>{
        if(error){
            logger.error('addRouteInquiry' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addRouteInquiry' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getAdminUserInfo,
    addRouteInquiry
}