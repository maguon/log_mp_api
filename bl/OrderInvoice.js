'use strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('OrderInvoice.js');
const orderInvoiceDAO = require('../dao/OrderInvoiceApplyDAO');

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

module.exports={
    addByAdmin
}