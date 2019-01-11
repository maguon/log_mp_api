'use strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Statistics.js');
const commonUtil = require("../util/CommonUtil");
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const orderInfoDAO = require("../dao/InquiryOrderDAO");

const orderCountsByMonths =(req,res,next) => {
    let params = req.params;
    let now = new Date();
    if (!params.endMonth){
        params.endMonth = moment(now).format('YYYY-MM');
    }
    if (!params.startMonth){
        now.setMonth(now.getMonth()-11);
        params.startMonth = moment(now).format('YYYY-MM');
    }
    orderInfoDAO.statisticsCountsByMounths(params,(error,result)=>{
        if(error){
            logger.error('statisticsCountsByMounths' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('statisticsCountsByMounths' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    orderCountsByMonths
}