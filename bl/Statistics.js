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
const invoiceApplyDAO = require("../dao/OrderInvoiceApplyDAO");

const orderMsgByMonths =(req,res,next) => {
    let orderCountsList = {};
    let params = req.params;
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");;
    }
    new Promise((resolve,reject)=>{
        orderInfoDAO.statisticsMonths(params,(error,rows)=>{
            if(error){
                logger.error('allOrderMsgByMonths' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else{
                logger.info('allOrderMsgByMonths' + 'success');
                orderCountsList.all = rows;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.createdType = sysConsts.ORDER.type.internal;
            orderInfoDAO.statisticsMonths(params,(error,rows)=>{
                if(error){
                    logger.error('internalOrderMsgByMonths' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                    reject(error);
                }else{
                    logger.info('internalOrderMsgByMonths' + 'success');
                    orderCountsList.internal = rows;
                    resolve();
                }
            });
        }).then(()=>{
            params.createdType = sysConsts.ORDER.type.extrnal;
            orderInfoDAO.statisticsMonths(params,(error,rows)=>{
                if(error){
                    logger.error('extrnalOrderMsgByMonths' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('extrnalOrderMsgByMonths' + 'success');
                    orderCountsList.extrnal = rows;
                    resUtil.resetQueryRes(res,orderCountsList,null);
                    return next();
                }
            });
        })
    })
}
const orderMsgByDay =(req,res,next) => {
    let orderCountsList = {};
    let params = req.params;
    params.startDay = moment().subtract(params.selectDays,"days").format("YYYYMMDD");
    params.endDay = moment().format("YYYYMMDD");
    new Promise((resolve,reject)=>{
        orderInfoDAO.statisticsByDays(params,(error,rows)=>{
            if (error) {
                logger.error('statisticsCountsByDays' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else {
                orderCountsList.all = rows;
                resolve();
            }
        });
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.createdType = sysConsts.ORDER.type.internal;
            orderInfoDAO.statisticsByDays(params,(error,rows)=>{
                if (error){
                    logger.error('statisticsCountsByDays' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                    reject(error);
                } else{
                    orderCountsList.internal = rows;
                    resolve();
                }
            });
        }).then(()=>{
            params.createdType = sysConsts.ORDER.type.extrnal;
            orderInfoDAO.statisticsByDays(params,(error,rows)=>{
                if (error){
                    logger.error('statisticsCountsByDays' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                } else{
                    orderCountsList.extrnal = rows;
                    resUtil.resetQueryRes(res,orderCountsList,null);
                    return next();
                }
            });
        })
    })

}
const invoiceMsgByMonths =(req,res,next) => {
    let invoiceList = {};
    let params = req.params;
    if (!params.endMonth){
        params.endMonth = moment().format("YYYYMM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYYMM");;
    }
    new Promise((resolve,reject)=>{
        invoiceApplyDAO.statisticsByMonths(params,(error,rows)=>{
            if(error){
                logger.error('allInvoiceMsgByMonths' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else{
                logger.info('allInvoiceMsgByMonths' + 'success');
                invoiceList.all = rows;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.createdType = sysConsts.ORDER.type.internal;
            invoiceApplyDAO.statisticsByMonths(params,(error,rows)=>{
                if(error){
                    logger.error('internalInvoiceMsgByMonths' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                    reject(error);
                }else{
                    logger.info('internalInvoiceMsgByMonths' + 'success');
                    invoiceList.internal = rows;
                    resolve();
                }
            });
        }).then(()=>{
            params.createdType = sysConsts.ORDER.type.extrnal;
            invoiceApplyDAO.statisticsByMonths(params,(error,rows)=>{
                if(error){
                    logger.error('extrnalInvoiceMsgByMonths' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('extrnalInvoiceMsgByMonths' + 'success');
                    invoiceList.extrnal = rows;
                    resUtil.resetQueryRes(res,invoiceList,null);
                    return next();
                }
            });
        })
    })
}
const invoiceMsgByDays =(req,res,next) => {
    let invoiceList = {};
    let params = req.params;
    params.startDay = moment().subtract(params.selectDays,"days").format("YYYYMMDD");
    params.endDay = moment().format("YYYYMMDD");
    new Promise((resolve,reject)=>{
        invoiceApplyDAO.statisticsByMonths(params,(error,rows)=>{
            if(error){
                logger.error('allInvoiceMsgByDays' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else{
                logger.info('allInvoiceMsgByDays' + 'success');
                invoiceList.all = rows;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.createdType = sysConsts.ORDER.type.internal;
            invoiceApplyDAO.statisticsByMonths(params,(error,rows)=>{
                if(error){
                    logger.error('internalInvoiceMsgByDays' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                    reject(error);
                }else{
                    logger.info('internalInvoiceMsgByDays' + 'success');
                    invoiceList.internal = rows;
                    resolve();
                }
            });
        }).then(()=>{
            params.createdType = sysConsts.ORDER.type.extrnal;
            invoiceApplyDAO.statisticsByMonths(params,(error,rows)=>{
                if(error){
                    logger.error('extrnalInvoiceMsgByDays' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('extrnalInvoiceMsgByDays' + 'success');
                    invoiceList.extrnal = rows;
                    resUtil.resetQueryRes(res,invoiceList,null);
                    return next();
                }
            });
        })
    })
}
module.exports = {
    orderMsgByMonths,
    orderMsgByDay,
    invoiceMsgByMonths,
    invoiceMsgByDays
}