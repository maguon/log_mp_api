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
    let orderCountsList = {};
    let params = req.params;
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");;
    }
    allOrderCountsByMonths(params,(error,data)=>{
        if (error){
            resUtil.resInternalError(error,res,next);
        } else {
            orderCountsList.all = data;
            internalOrderCountsByMonths(params,(error,data)=>{
                if (error){
                    resUtil.resInternalError(error,res,next);
                } else {
                    orderCountsList.internal = data;
                    extrnalOrderCountsByMonths(params,(error,data)=>{
                        if (error){
                            resUtil.resInternalError(error,res,next);
                        } else {
                            orderCountsList.extrnal = data;
                            logger.info('orderCountsByMonths' + 'success');
                            resUtil.resetQueryRes(res,orderCountsList,null);
                            return next();
                        }
                    });
                }
            });
        }
    });
}
const orderPriceByMonths =(req,res,next) => {
    let orderPriceList = {};
    let params = req.params;
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");
    }
    allOrderPriceByMonths(params,(error,data)=>{
        if (error){
            resUtil.resInternalError(error,res,next);
        } else {
            orderPriceList.all = data;
            internalOrderPriceByMonths(params,(error,data)=>{
                if (error){
                    resUtil.resInternalError(error,res,next);
                } else {
                    orderPriceList.internal = data;
                    extrnalOrderPriceByMonths(params,(error,data)=>{
                        if (error){
                            resUtil.resInternalError(error,res,next);
                        } else {
                            orderPriceList.extrnal = data;
                            logger.info('orderPriceByMonths' + 'success');
                            resUtil.resetQueryRes(res,orderPriceList,null);
                            return next();
                        }
                    });
                }
            });
        }
    });
}
const allOrderPriceByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");;
    }
    orderInfoDAO.statisticsPriceByMounths({startMonth:params.startMonth,endMonth:params.endMonth},(error,rows)=>{
        if(error){
            logger.error('allOrderPriceByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('allOrderPriceByMonths' + 'success');
            callback(null,rows);
        }
    })
}
const internalOrderPriceByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");
    }
    orderInfoDAO.statisticsPriceByMounths({startMonth:params.startMonth,endMonth:params.endMonth,createdType:sysConsts.ORDER.type.internal},(error,rows)=>{
        if(error){
            logger.error('internalOrderCountsByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('internalOrderCountsByMonths' + 'success');
            callback(null,rows);
        }
    })
}
const extrnalOrderPriceByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");;
    }
    orderInfoDAO.statisticsPriceByMounths({startMonth:params.startMonth,endMonth:params.endMonth,createdType:sysConsts.ORDER.type.extrnal},(error,rows)=>{
        if(error){
            logger.error('internalOrderCountsByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('internalOrderCountsByMonths' + 'success');
            callback(null,rows);
        }
    })
}
const allOrderCountsByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");;
    }
    orderInfoDAO.statisticsCountsByMounths({startMonth:params.startMonth,endMonth:params.endMonth},(error,rows)=>{
        if(error){
            logger.error('allOrderCountsByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('allOrderCountsByMonths' + 'success');
            callback(null,rows);
        }
    })
}
const internalOrderCountsByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");;
    }
    orderInfoDAO.statisticsCountsByMounths({startMonth:params.startMonth,endMonth:params.endMonth,createdType:sysConsts.ORDER.type.internal},(error,rows)=>{
        if(error){
            logger.error('internalOrderCountsByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('internalOrderCountsByMonths' + 'success');
            callback(null,rows);
        }
    })
}
const extrnalOrderCountsByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");;
    }
    orderInfoDAO.statisticsCountsByMounths({startMonth:params.startMonth,endMonth:params.endMonth,createdType:sysConsts.ORDER.type.extrnal},(error,rows)=>{
        if(error){
            logger.error('internalOrderCountsByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('internalOrderCountsByMonths' + 'success');
            callback(null,rows);
        }
    })
}

module.exports = {
    orderCountsByMonths,
    orderPriceByMonths
}