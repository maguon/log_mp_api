'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const logger = serverLogger.createLogger('ProductOrder.js');
const productOrderDAO = require('../dao/ProductOrderDAO.js');

const getProductOrder = (req,res,next) => {
    let params = req.params;
    productOrderDAO.getProductOrder(params,(error,rows)=>{
        if(error){
            logger.error(' getProductOrder ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getProductOrder ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    productOrderDAO.updateStatus(params,(error,result)=>{
        if(error){
            logger.error(' updateStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports={
    getProductOrder,
    updateStatus
}