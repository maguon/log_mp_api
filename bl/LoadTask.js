'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('LoadTask.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const orderInfoDAO = require("../dao/InquiryOrderDAO");
const requireTaskDAO = require("../dao/RequireTaskDAO");
const loadTaskDAO = require("../dao/LoadTaskDAO");

const addLoadTask = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderInfoDAO.getById({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('getOrder' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getOrder' + 'success');
                if (rows.length > 0){
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.ORDER_NO_EXISTE);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            requireTaskDAO.getById({requireId:params.requireId},(error,rows)=>{
                if(error){
                    logger.error('getRequireTaskById' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getRequireTaskById' + 'success');
                    if (rows.length > 0){
                        resolve();
                    }else {
                        resUtil.resetFailedRes(res,sysMsg.REQUIRE_NO_EXISTE);
                    }
                }
            })
        }).then(()=>{
            params.planDateId = moment(params.planDateId).format("YYYYMMDD");
            loadTaskDAO.add(params,(error,rows)=>{
                if(error){
                    logger.error('addLoadTask' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('addLoadTask' + 'success');
                    resUtil.resetCreateRes(res,rows,null);
                    return next;
                }
            })
        })
    })
}

module.exports={
    addLoadTask
}