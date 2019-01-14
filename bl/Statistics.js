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
        params.endMonth = moment().format("YYYY-MM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYY-MM");;
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
const allOrderCountsByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYY-MM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYY-MM");;
    }
    orderInfoDAO.statisticsCountsByMounths({startMonth:params.startMonth,endMonth:params.endMonth},(error,rows)=>{
        if(error){
            logger.error('allOrderCountsByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('allOrderCountsByMonths' + 'success');
            let zeroResult = getZeroList(params.startMonth,params.endMonth);
            for (let i in rows){
                for (let j in zeroResult){
                    if (rows[i].day_month == zeroResult[j].day_month){
                        zeroResult[j].order_counts = rows[i].order_counts;
                    }
                }
            }
            callback(null,zeroResult);
        }
    })
}
const internalOrderCountsByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYY-MM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYY-MM");;
    }
    orderInfoDAO.statisticsCountsByMounths({startMonth:params.startMonth,endMonth:params.endMonth,createdType:sysConsts.ORDER.type.internal},(error,rows)=>{
        if(error){
            logger.error('internalOrderCountsByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('internalOrderCountsByMonths' + 'success');
            let zeroResult = getZeroList(params.startMonth,params.endMonth);
            for (let i in rows){
                for (let j in zeroResult){
                    if (rows[i].day_month == zeroResult[j].day_month){
                        zeroResult[j].order_counts = rows[i].order_counts;
                    }
                }
            }
            callback(null,zeroResult);
        }
    })
}
const extrnalOrderCountsByMonths =(params,callback) => {
    if (!params.endMonth){
        params.endMonth = moment().format("YYYY-MM");;
    }
    if (!params.startMonth){
        params.startMonth = moment().subtract(11,'months').format("YYYY-MM");;
    }
    orderInfoDAO.statisticsCountsByMounths({startMonth:params.startMonth,endMonth:params.endMonth,createdType:sysConsts.ORDER.type.extrnal},(error,rows)=>{
        if(error){
            logger.error('internalOrderCountsByMonths' + error.message);
            callback(error,null);
        }else{
            logger.info('internalOrderCountsByMonths' + 'success');
            let zeroResult = getZeroList(params.startMonth,params.endMonth);
            for (let i in rows){
                for (let j in zeroResult){
                    if (rows[i].day_month == zeroResult[j].day_month){
                        zeroResult[j].order_counts = rows[i].order_counts;
                    }
                }
            }
            callback(null,zeroResult);
        }
    })
}
const getZeroList = (startDate,endDate)=>{
    let start = startDate.split("-"), end = endDate.split("-");
    let sYear = parseInt(start[0]) , sMonth = parseInt(start[1]) ,
        eYear = parseInt(end[0]) , eMonth = parseInt(end[1]) ,
        months = (eYear - sYear) * 12 + (eMonth-sMonth) + 1;
    let result = new Array();
    for(let i =0;i<months;i++){
        let selectMonth = moment(startDate).add(i,'months').format("YYYY-MM");
        let options = {
            day_month:selectMonth,
            order_counts:0
        }
        result.push(options);
    }
    return result;
}

module.exports = {
    orderCountsByMonths
}