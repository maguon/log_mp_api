'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('TransAndInsurePrice.js');
const commonUtil = require("../util/CommonUtil");
const sysMsg = require("../util/SystemMsg")

const transAndInsurePrice = (req,res,next) => {
    let params = req.params;
    let price = commonUtil.calculatedAmount(params.serviceType,params.oldCar,params.modelType,params.distance,params.safeStatus,params.valuation);
    if (!price){
        resUtil.resetFailedRes(res,sysMsg.GET_TRANS_AND_INSURE_PRICE);
    } else {
        logger.info('transAndInsurePrice ' + 'success');
        price.insure = parseFloat(price.insure.toFixed(2));
        price.trans = parseFloat(price.trans.toFixed(2));
        resUtil.resetQueryRes(res,price,null);
        return next();
    }
}
module.exports = {
    transAndInsurePrice
}