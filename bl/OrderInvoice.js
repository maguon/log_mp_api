'use strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const logger = serverLogger.createLogger('OrderInvoice.js');
const orderInvoiceDAO = require('../dao/OrderInvoiceApplyDAO');
const sysConsts = require("../util/SystemConst");
const orderInfoDAO = require("../dao/InquiryOrderDAO");
const moment = require('moment/moment.js');

const addByAdmin = (req,res,next)=>{
    let params = req.params;
    params.userId = 0;
    params.dateId = moment().format("YYYYMMDD");
    orderInvoiceDAO.addOrderInvoiceApply(params,(error,result)=>{
        if (error){
            logger.error('addByAdmin addOrderInvoiceApply ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('addByAdmin addOrderInvoiceApply ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const updateInvoiceStatus = (req,res,next)=>{
    let params = req.params;
    params.status = sysConsts.ORDER_INVOICE_APPLY.status.invoiced;
    orderInvoiceDAO.updateStatus(params,(error,rows)=>{
        if (error){
            logger.error('updateInvoiceStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('updateInvoiceStatus ' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next();
        }
    });
}
const replaceOrderId =(req,res,next)=>{
    let params = req.params;
    let orderId = params.orderId;
    new Promise((resolve,reject)=>{
        orderInfoDAO.getById({orderId:orderId},(error,rows)=>{
            if (error){
                logger.error('replaceOrderId getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            } else {
                logger.info('replaceOrderId getById ' + 'success');
                if (rows.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_ORDER_UNREGISTERED);
                }

            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderInvoiceDAO.getByOrderId({orderId:orderId},(error,rows)=>{
                if (error){
                    logger.error('replaceOrderId getByOrderId ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                } else {
                    logger.info('replaceOrderId getByOrderId ' + 'success');
                    if (rows.length > 0){
                        resUtil.resetFailedRes(res,sysMsg.ADMIN_ORDER_INVOICE_ONLYONE);
                    } else {
                        resolve();
                    }

                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                params.orderId = 0;
                orderInvoiceDAO.updateOrderId(params,(error,rows)=>{
                    if (error){
                        logger.error('replaceOrderId updateOrderId ' + error.message);
                        resUtil.resInternalError(error,res,next);
                        reject(error);
                    } else {
                        logger.info('replaceOrderId updateOrderId ' + 'success');
                        resolve();
                    }
                });
            }).then(()=>{
                params.orderId = orderId;
                orderInvoiceDAO.updateOrderId(params,(error,rows)=>{
                    if (error){
                        logger.error('replaceOrderId updateOrderId2 ' + error.message);
                        resUtil.resInternalError(error,res,next);
                    } else {
                        logger.info('replaceOrderId updateOrderId2 ' + 'success');
                        resUtil.resetUpdateRes(res,rows,null);
                        return next();
                    }
                });
            })
        })
    })

}
const updateInvoiceApplyMsg = (req,res,next)=>{
    let params = req.params;
    orderInvoiceDAO.updateById(params,(error,rows)=>{
        if (error){
            logger.error('updateInvoiceApplyMsg ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('updateInvoiceApplyMsg ' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next();
        }
    });
}
const getNoInvoiceOrderList = (req,res,next)=>{
    let params = req.params;
    params.orderStatus = sysConsts.ORDER.status.completed;
    orderInvoiceDAO.getOrderInvoice(params,(error,rows)=>{
        if (error){
            logger.error('getNoInvoiceOrderList ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('getNoInvoiceOrderList ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    });
}
const getInvoicedOrderList = (req,res,next)=>{
    let params = req.params;
    params.isApply = true;
    orderInvoiceDAO.getOrderInvoice(params,(error,rows)=>{
        if (error){
            logger.error('getInvoicedOrderList ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('getInvoicedOrderList ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    });
}
const delInvoiceApply = (req,res,next)=>{
    let params = req.params;
    let status = 0;
    new Promise((resolve,reject)=>{
        orderInvoiceDAO.getById(params,(error,rows)=>{
            if (error){
                logger.error('delInvoiceApply getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            } else {
                logger.info('delInvoiceApply getById ' + 'success');
                status = rows[0].status;
                if (status == sysConsts.ORDER_INVOICE_APPLY.status.invoiced){
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_ORDER_INVOICE_APPLY_REVOKE);
                    reject(error);
                } else {
                    resolve();
                }
            }
        })
    }).then(()=>{
        orderInvoiceDAO.deleteRevokeInvoice(params,(error,result)=>{
            if (error){
                logger.error('delInvoiceApply deleteRevokeInvoice ' + error.message);
                resUtil.resInternalError(error,res,next);
            } else {
                logger.info('delInvoiceApply deleteRevokeInvoice ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const updateRefuseStatus = (req,res,next)=>{
    let params = req.params;
    params.status = sysConsts.ORDER_INVOICE_APPLY.status.refuse;
    orderInvoiceDAO.updateStatus(params,(error,rows)=>{
        if (error){
            logger.error('updateRefuseStatus updateStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('updateRefuseStatus updateStatus ' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next();
        }
    });
}
const addByUser = (req,res,next)=>{
    let params = req.params;
    params.adminId = 0;
    params.dateId = moment().format("YYYYMMDD");
    orderInvoiceDAO.addOrderInvoiceApply(params,(error,result)=>{
        if (error){
            logger.error('addByUser addOrderInvoiceApply ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('addByUser addOrderInvoiceApply ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const statisticsInvoice = (req,res,next)=>{
    let params = req.params;
    params.dbMonth = moment().format("YYYYMM");
    orderInvoiceDAO.getStatisticsInvoice(params,(error,result)=>{
        if (error){
            logger.error('statisticsInvoice ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('statisticsInvoice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const statisticsOrder = (req,res,next)=>{
    let params = req.params;
    orderInvoiceDAO.getStatisticsOrder(params,(error,result)=>{
        if (error){
            logger.error('statisticsOrder ' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('statisticsOrder ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
module.exports={
    addByAdmin,
    updateInvoiceStatus,
    updateInvoiceApplyMsg,
    getNoInvoiceOrderList,
    getInvoicedOrderList,
    replaceOrderId,
    delInvoiceApply,
    updateRefuseStatus,
    addByUser,
    statisticsInvoice,
    statisticsOrder
}