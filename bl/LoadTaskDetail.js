'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('LoadTask.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const loadTaskDAO = require("../dao/LoadTaskDAO");
const loadTaskDetailDAO = require("../dao/LoadTaskDetailDAO");

const addLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    let detailId =0;
    new Promise((resolve,reject)=>{
        loadTaskDAO.getById({loadTaskId:params.loadTaskId},(error,rows)=>{
            if(error){
                logger.error('getLoadTask' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('getLoadTask' + 'success');
                if (rows.length >0){
                    params.requireId = rows[0].require_id;
                    params.orderId = rows[0].order_id;
                    params.supplierId = rows[0].supplier_id;
                    params.carNum = rows[0].car_count;
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.LOAD_TASK_NO_EXISTS);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.dateId = moment().format("YYYYMMDD");
            loadTaskDetailDAO.add(params,(error,rows)=>{
                if(error){
                    logger.error('addLoadTaskDetail' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('addLoadTaskDetail' + 'success');
                    detailId = rows.insertId;
                    resolve();
                }
            })
        }).then(()=>{
            let carNum =1;
            carNum = params.carNum + carNum;
            loadTaskDAO.updateById({carNum:carNum,loadTaskId: params.loadTaskId},(error,rows)=>{
                if(error){
                    logger.error('updateLoadTaskCarNum' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('updateLoadTaskCarNum' + 'success');
                    resUtil.resetQueryRes(res,detailId,null);
                    return next;
                }
            })
        })

    })
}
const getArrangeLoadTaskDetail = (req,res,next) => {
    let params = req.params;
    loadTaskDetailDAO.getArrangeLoadTaskDetail(params,(error,rows)=>{
        if(error){
            logger.error('getArrangeLoadTaskDetail' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getArrangeLoadTaskDetail' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
        }
    })
}
module.exports={
    addLoadTaskDetail,
    getArrangeLoadTaskDetail
}