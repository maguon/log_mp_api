'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('TransAndInsurePrice.js');
const systemConst = require('../util/SystemConst.js');


const transAndInsurePrice = (req,res,next) => {
    let params = req.params;
    systemConst.transAndInsurePrice({insuranceFlag:params.insuranceFlag,distance:params.distance,modelType:params.modelType,oldCar:params.oldCar,serviceType:params.serviceType,valuation:params.valuation},(rows)=>{
        if(rows.length < 1){
            logger.warn('transAndInsurePrice' + '计算错误');
            resUtil.resetFailedRes(res,'计算错误',next);
        }else{
            logger.info('transAndInsurePrice' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
module.exports = {
    transAndInsurePrice
}