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
    new Promise((resolve,reject)=>{
        orderInfoDAO.statisticsCountsByMounths({startMonth:params.startMonth,endMonth:params.endMonth},(error,rows)=>{
            if(error){
                logger.error('allOrderCountsByMonths' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else{
                logger.info('allOrderCountsByMonths' + 'success');
                orderCountsList.all = rows;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.createdType = sysConsts.ORDER.type.internal;
            orderInfoDAO.statisticsCountsByMounths(params,(error,rows)=>{
                if(error){
                    logger.error('internalOrderCountsByMonths' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                    reject(error);
                }else{
                    logger.info('internalOrderCountsByMonths' + 'success');
                    orderCountsList.internal = rows;
                    resolve();
                }
            });
        }).then(()=>{
            params.createdType = sysConsts.ORDER.type.extrnal;
            orderInfoDAO.statisticsCountsByMounths(params,(error,rows)=>{
                if(error){
                    logger.error('extrnalOrderCountsByMonths' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('extrnalOrderCountsByMonths' + 'success');
                    orderCountsList.extrnal = rows;
                    resUtil.resetQueryRes(res,orderCountsList,null);
                    return next();
                }
            });
        })
    })
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
    new Promise((resolve,reject)=>{
        orderInfoDAO.statisticsPriceByMounths(params,(error,rows)=>{
            if(error){
                logger.error('allOrderPriceByMonths' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else{
                logger.info('allOrderPriceByMonths' + 'success');
                orderPriceList.all = rows;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.createdType = sysConsts.ORDER.type.internal;
            orderInfoDAO.statisticsPriceByMounths(params,(error,rows)=>{
                if(error){
                    logger.error('internalOrderPriceByMonths' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                    reject(error);
                }else{
                    logger.info('internalOrderPriceByMonths' + 'success');
                    orderPriceList.internal = rows;
                    resolve();
                }
            })
        }).then(()=>{
            params.createdType = sysConsts.ORDER.type.extrnal;
            orderInfoDAO.statisticsPriceByMounths(params,(error,rows)=>{
                if(error){
                    logger.error('extrnalOrderPriceByMonths' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('extrnalOrderPriceByMonths' + 'success');
                    orderPriceList.extrnal = rows;
                    resUtil.resetQueryRes(res,orderPriceList,null);
                    return next();
                }
            });
        })
    });
}
const orderCountsByDay =(req,res,next) => {
    let orderCountsList = {};
    let params = req.params;
    if (params.selectDays == sysConsts.STASTICS.byDay.thirty ){
        params.startDay = moment().subtract(30,"days").format("YYYYMMDD");
        params.endDay = moment().format("YYYYMMDD");
    }else if (params.selectDays == sysConsts.STASTICS.byDay.ten){
        params.startDay = moment().subtract(10,"days").format("YYYYMMDD");
        params.endDay = moment().format("YYYYMMDD");
    }
    new Promise((resolve,reject)=>{
        orderInfoDAO.statisticsCountsByDays(params,(error,rows)=>{
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
            orderInfoDAO.statisticsCountsByDays(params,(error,rows)=>{
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
            orderInfoDAO.statisticsCountsByDays(params,(error,rows)=>{
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
module.exports = {
    orderCountsByMonths,
    orderPriceByMonths,
    orderCountsByDay
}