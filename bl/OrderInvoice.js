'use strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('OrderInvoice.js');
const orderInvoiceDAO = require('../dao/OrderInvoiceApplyDAO');
const sysConsts = require("../util/SystemConst");

const addByAdmin = (req,res,next)=>{
    let params = req.params;
    params.userId = 0;
    orderInvoiceDAO.addOrderInvoiceApply(params,(error,result)=>{
        if (error){
            logger.error('addOrderInvoiceApply:' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('addOrderInvoiceApply:' + 'success');
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
            logger.error('updateInvoiceStatus:' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('updateInvoiceStatus:' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next();
        }
    });
}
const updateInvoiceOrder = (req,res,next)=>{
    let params = req.params;
    if (!params.orderId){
        params.orderId = 0;
    }
    orderInvoiceDAO.updateOrderId(params,(error,rows)=>{
        if (error){
            logger.error('updateInvoiceOrder:' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('updateInvoiceOrder:' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next();
        }
    });
}
const updateInvoiceApplyMsg = (req,res,next)=>{
    let params = req.params;
    orderInvoiceDAO.updateById(params,(error,rows)=>{
        if (error){
            logger.error('updateInvoiceApplyMsg:' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('updateInvoiceApplyMsg:' + 'success');
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
            logger.error('getNoInvoiceOrderList:' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('getNoInvoiceOrderList:' + 'success');
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
            logger.error('getInvoicedOrderList:' + error.message);
            resUtil.resInternalError(error,res,next);
        } else {
            logger.info('getInvoicedOrderList:' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    });
}
module.exports={
    addByAdmin,
    updateInvoiceStatus,
    updateInvoiceOrder,
    updateInvoiceApplyMsg,
    getNoInvoiceOrderList,
    getInvoicedOrderList
}