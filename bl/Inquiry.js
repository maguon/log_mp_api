'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Inquiry.js');
const inquiryDAO = require('../dao/InquiryDAO.js');

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
const queryRouteInquiry = (req,res,next) => {
    let params = req.params;
    inquiryDAO.queryRouteInquiry(params,(error,rows)=>{
        if(error){
            logger.error('addRouteInquiry' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            let inquiry = {
                routeId: rows[0].route_id,
                distance:rows[0].distance,
                serviceType: rows[0].service_type,
                modelId: rows[0].model_id,
                carFlag: rows[0].car_flag,
                vacationMoney: rows[0].vacation_money,
                fee: rows[0].distance * rows[0].car_flag
            }
            logger.info('queryRouteInquiry' + 'success');
            resUtil.resetQueryRes(res,inquiry,null);
            return next();
        }
    })
}
module.exports = {
    addRouteInquiry,
    queryRouteInquiry
}