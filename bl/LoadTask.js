'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('LoadTask.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const oAuthUtil = require("../util/OAuthUtil");
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
const submitToSupplier = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
            if(error){
                logger.error('getLoadTask' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getLoadTask' + 'success');
                if (rows.length > 0){
                    params.options = {
                        routeStart:rows[0].route_start,
                        baseAddrId:rows[0].route_start_id,
                        routeEnd:rows[0].route_end,
                        receiveId:rows[0].route_end_id,
                        preCount:rows[0].car_count,
                        dateId:rows[0].plan_date_id,
                        remark:rows[0].remark
                    }
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.ORDER_NO_EXISTE);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.req = req;
            oAuthUtil.saveLoadTaskToSupplier(params,(error,result)=>{
                if(error){
                    logger.error(' saveLoadTaskToSupplier ' + error.message);
                    reject(error);
                }else{
                    logger.info('saveLoadTaskToSupplier' + 'success');
                    resUtil.resetQueryRes(res,result,null);
                }
            })
        }).then(()=>{

        })
    })
}
module.exports={
    addLoadTask,
    submitToSupplier
}