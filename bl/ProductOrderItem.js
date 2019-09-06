'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const sysConst = require("../util/SystemConst");
const moment = require('moment/moment.js');
const logger = serverLogger.createLogger('ProductOrderItem.js');
const productOrderItemDAO = require('../dao/ProductOrderItemDAO');

const getUserProductOrderItem = (req,res,next) => {
    let params = req.params;
    productOrderItemDAO.getUserProductOrderItem(params,(error,rows)=>{
        if(error){
            logger.error(' getUserProductOrderItem ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getUserProductOrderItem ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
module.exports={
    getUserProductOrderItem
}