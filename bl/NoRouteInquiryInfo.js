'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('NoRouteInquiryInfo.js');
const moment = require('moment/moment.js');
const noRouteInquiry = require("../dao/NoRouteInquiryInfoDAO");

const addNoRouteInquiry =(req,res,next) => {
    let params = req.params;
    params.dateId = moment().format("YYYYMMDD");
    noRouteInquiry.add(params,(error,result)=>{
        if(error){
            logger.error('addNoRouteInquiry ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addNoRouteInquiry ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
module.exports={
    addNoRouteInquiry
}