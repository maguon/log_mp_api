'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('RequireTask.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const requireTask = require("../dao/RequireTaskDAO");
const orderInfoDAO = require("../dao/InquiryOrderDAO");

const addRequireTask = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderInfoDAO.updateById({status:sysConsts.ORDER.status.carsToBeArranged,orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('updateStatus' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('updateStatus' + 'success');
                if (rows.changedRows > 0){
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_ADD_REQUIRE_ORDER_STATUS);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderInfoDAO.getById({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('getOrderInfo' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('getOrderInfo' + 'success');
                    params.routeStart = rows[0].route_start;
                    params.routeStartId = rows[0].route_start_id;
                    params.routeEnd = rows[0].route_end;
                    params.routeEndId = rows[0].route_end_id;
                    params.carNum = rows[0].car_num;
                    resolve();
                }
            })
        }).then(()=>{
            params.dateId = moment().format("YYYYMMDD");
            requireTask.add(params,(error,rows)=>{
                if(error){
                    logger.error('addRequireTask' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('addRequireTask' + 'success');
                    resUtil.resetCreateRes(res,rows,null);
                    return next;
                }
            })
        })
    })
}
const getRequireOrder = (req,res,next) => {
    let params = req.params;
    requireTask.add(params,(error,rows)=>{
        if(error){
            logger.error('addRequireTask' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addRequireTask' + 'success');
            resUtil.resetCreateRes(res,rows,null);
            return next;
        }
    })
}
module.exports={
    addRequireTask,
    getRequireOrder
}