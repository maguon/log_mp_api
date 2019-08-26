'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const logger = serverLogger.createLogger('Commodity.js');
const commodityDAO = require('../dao/CommodityDAO.js');
const moment = require('moment/moment.js');

const getCommodity = (req,res,next) => {
    let params = req.params;
    commodityDAO.getCommodity(params,(error,rows)=>{
        if(error){
            logger.error(' getCommodity ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getCommodity ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const addCommodity = (req,res,next)=>{
    let params = req.params;
    if(params.type == 1 ){
        //全款购车
        params.earnestMoney = 0;
    }
    if(params.type == 2 ){
        //定金购车
    }
    if(params.type == 3 ){
        //到货付款
        params.earnestMoney = 0;
    }
    params.status = 1;
    params.showStatus = 0;

    commodityDAO.addCommodity(params,(error,result)=>{
        if(error){
            logger.error('addCommodity ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('addCommodity ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
};
const updateCommodity = (req,res,next) => {
    let params = req.params;
    if(params.type == 1 ){
        //全款购车
        params.earnestMoney = 0;
    }
    if(params.type == 2 ){
        //定金购车
    }
    if(params.type == 3 ){
        //到货付款
        params.earnestMoney = 0;
    }
    params.status = 1;
    params.showStatus = 0;
    commodityDAO.updateCommodity(params,(error,result)=>{
        if(error){
            logger.error('updateCommodity ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateCommodity  ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    commodityDAO.updateStatus(params,(error,result)=>{
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
const deleteCommodity = (req,res,next) => {
    let params = req.params;

    commodityDAO.deleteCommodity(params,(error,result)=>{
        if(error){
            logger.error(' deleteCommodity ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' deleteCommodity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports={
    getCommodity,
    addCommodity,
    updateCommodity,
    updateStatus,
    deleteCommodity
}